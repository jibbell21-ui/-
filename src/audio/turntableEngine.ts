import { VinylRecord } from '../data/archives';

export interface TurntableState {
  isPlaying: boolean;
  tonearmDropped: boolean;
  progress: number; // 0 to 1 (outer groove to inner runout)
  currentRpm: 33.33 | 45 | 78;
  volume: number; // 0 to 1
  crackleLevel: number; // 0 to 1
  frequencyBars: number[]; // 12 normalized bars 0..1 for subtle live meter
}

/**
 * Pure Web Audio API Analog Turntable Engine
 * Generates authentic needle drop/lift mechanical cues, continuous vinyl surface crackle,
 * 50Hz plinth hum, RIAA tube warmth filtering, true RPM pitch/tempo scaling,
 * and rich multi-voice historical Thai broadcasting & musical compositions.
 */
export class AnalogTurntableEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private tubeFilter: BiquadFilterNode | null = null;
  private waveshaper: WaveShaperNode | null = null;
  private crackleGain: GainNode | null = null;
  private rumbleGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  private crackleSource: AudioBufferSourceNode | null = null;
  private rumbleOsc: OscillatorNode | null = null;

  private currentRecord: VinylRecord | null = null;
  private isPlaying = false;
  private tonearmDropped = false;
  private currentRpm: 33.33 | 45 | 78 = 33.33;
  private volume = 0.78;
  private crackleLevel = 0.42;

  // Musical playback clock (in native record seconds)
  private trackCursorSec = 0;
  private lastTickTime = 0;
  private nextStepIndex = 0;
  private schedulerTimer: number | null = null;
  private meterTimer: number | null = null;
  private onStateChange: (state: TurntableState) => void;

  private freqData = new Uint8Array(32);

  constructor(onStateChange: (state: TurntableState) => void) {
    this.onStateChange = onStateChange;
  }

  private ensureAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Tube warmth lowpass + subtle mid resonance
      this.tubeFilter = this.ctx.createBiquadFilter();
      this.tubeFilter.type = 'lowpass';
      this.tubeFilter.frequency.value = 3400;
      this.tubeFilter.Q.value = 0.85;

      // Soft analog tape/tube saturation curve
      this.waveshaper = this.ctx.createWaveShaper();
      this.waveshaper.curve = this.makeWarmthCurve(14);
      this.waveshaper.oversample = '2x';

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.78;

      this.crackleGain = this.ctx.createGain();
      this.crackleGain.gain.value = 0;

      this.rumbleGain = this.ctx.createGain();
      this.rumbleGain.gain.value = 0;

      // Signal chain: Voices/Crackle/Rumble -> waveshaper -> tubeFilter -> masterGain -> analyser -> destination
      this.crackleGain.connect(this.waveshaper);
      this.rumbleGain.connect(this.waveshaper);
      this.waveshaper.connect(this.tubeFilter);
      this.tubeFilter.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.startAmbientSurfaceLayers();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  private makeWarmthCurve(amount: number): Float32Array<ArrayBuffer> {
    const samples = 256;
    const buffer = new ArrayBuffer(samples * 4);
    const curve = new Float32Array(buffer);
    const deg = Math.PI / 180;
    for (let i = 0; i < samples; ++i) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  private startAmbientSurfaceLayers() {
    if (!this.ctx || !this.crackleGain || !this.rumbleGain) return;

    // 4-second looping procedural vinyl surface hiss + authentic dust ticks
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      // Pink-ish noise floor
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.04 * white) / 1.04;
      let sample = lastOut * 0.25;

      // Occasional organic dust pop / shellac crackle impulse
      const r = Math.random();
      if (r > 0.99945) {
        sample += (Math.random() > 0.5 ? 1 : -1) * (0.28 + Math.random() * 0.35);
      } else if (r > 0.9975) {
        sample += (Math.random() * 2 - 1) * 0.06;
      }
      data[i] = sample;
    }

    this.crackleSource = this.ctx.createBufferSource();
    this.crackleSource.buffer = buffer;
    this.crackleSource.loop = true;

    const crackleBand = this.ctx.createBiquadFilter();
    crackleBand.type = 'bandpass';
    crackleBand.frequency.value = 1850;
    crackleBand.Q.value = 0.65;

    this.crackleSource.connect(crackleBand);
    crackleBand.connect(this.crackleGain);
    this.crackleSource.start();

    // Subtle 50Hz turntable motor rumble
    this.rumbleOsc = this.ctx.createOscillator();
    this.rumbleOsc.type = 'sine';
    this.rumbleOsc.frequency.value = 52;
    this.rumbleOsc.connect(this.rumbleGain);
    this.rumbleOsc.start();
  }

  private playNeedleDropTransient(dropping: boolean) {
    if (!this.ctx || !this.waveshaper) return;
    const now = this.ctx.currentTime;

    // Mechanical stylus touchdown / lift thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(dropping ? 145 : 220, now);
    osc.frequency.exponentialRampToValueAtTime(dropping ? 42 : 95, now + 0.09);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(dropping ? 0.28 : 0.14, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.waveshaper);
    osc.start(now);
    osc.stop(now + 0.14);

    // Subtle groove-catch rustle on drop
    if (dropping) {
      const len = Math.floor(this.ctx.sampleRate * 0.18);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.25)) * 0.25;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const ng = this.ctx.createGain();
      ng.gain.value = 0.35;
      noise.connect(ng);
      ng.connect(this.waveshaper);
      noise.start(now);
    }
  }

  public loadRecord(record: VinylRecord, autoPlay = false) {
    const wasPlaying = this.isPlaying;
    this.pause(false);
    this.currentRecord = record;
    this.currentRpm = record.nativeRpm;
    this.trackCursorSec = 0;
    this.nextStepIndex = 0;

    if (autoPlay || wasPlaying) {
      this.play();
    } else {
      this.emitState();
    }
  }

  public play() {
    if (!this.currentRecord) return;
    this.ensureAudioContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.tonearmDropped = true;
    this.lastTickTime = performance.now();
    this.nextStepIndex = Math.floor(this.trackCursorSec / 0.35);

    this.playNeedleDropTransient(true);
    this.updateSurfaceGains();
    this.startLoops();
    this.emitState();
  }

  public pause(liftArm = true) {
    if (!this.isPlaying && (!liftArm || !this.tonearmDropped)) return;
    const wasDropped = this.tonearmDropped;
    this.isPlaying = false;
    if (liftArm) {
      this.tonearmDropped = false;
    }
    if (wasDropped && liftArm && this.ctx) {
      this.playNeedleDropTransient(false);
    }
    this.updateSurfaceGains();
    this.stopLoops();
    this.emitState();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause(true);
    } else {
      this.play();
    }
  }

  public toggleTonearmCue() {
    if (!this.currentRecord) return;
    this.ensureAudioContext();
    if (this.tonearmDropped) {
      this.pause(true);
    } else {
      this.play();
    }
  }

  public setRpm(rpm: 33.33 | 45 | 78) {
    this.currentRpm = rpm;
    if (this.crackleSource && this.currentRecord) {
      const ratio = this.getSpeedRatio();
      this.crackleSource.playbackRate.value = Math.max(0.5, Math.min(2.2, ratio));
    }
    this.emitState();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.03);
    }
    this.emitState();
  }

  public setCrackleLevel(level: number) {
    this.crackleLevel = Math.max(0, Math.min(1, level));
    this.updateSurfaceGains();
    this.emitState();
  }

  public seekProgress(progress: number, dropAndPlay = false) {
    if (!this.currentRecord) return;
    const clamped = Math.max(0, Math.min(0.99, progress));
    this.trackCursorSec = clamped * this.currentRecord.durationSeconds;
    this.nextStepIndex = Math.floor(this.trackCursorSec / 0.35);

    if (dropAndPlay) {
      this.ensureAudioContext();
      this.playNeedleDropTransient(true);
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.tonearmDropped = true;
        this.lastTickTime = performance.now();
        this.updateSurfaceGains();
        this.startLoops();
      }
    }
    this.emitState();
  }

  private getSpeedRatio(): number {
    if (!this.currentRecord) return 1;
    return this.currentRpm / this.currentRecord.nativeRpm;
  }

  private updateSurfaceGains() {
    if (!this.ctx || !this.crackleGain || !this.rumbleGain) return;
    const now = this.ctx.currentTime;
    const active = this.isPlaying && this.tonearmDropped;
    const targetCrackle = active ? 0.05 + this.crackleLevel * 0.22 : 0;
    const targetRumble = active ? 0.028 : 0;
    this.crackleGain.gain.setTargetAtTime(targetCrackle, now, 0.06);
    this.rumbleGain.gain.setTargetAtTime(targetRumble, now, 0.06);
  }

  private startLoops() {
    this.stopLoops();
    this.lastTickTime = performance.now();

    this.schedulerTimer = window.setInterval(() => {
      this.tickAudio();
    }, 65);

    this.meterTimer = window.setInterval(() => {
      this.emitState();
    }, 80);
  }

  private stopLoops() {
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.meterTimer !== null) {
      clearInterval(this.meterTimer);
      this.meterTimer = null;
    }
  }

  private tickAudio() {
    if (!this.isPlaying || !this.tonearmDropped || !this.currentRecord || !this.ctx) return;

    const nowMs = performance.now();
    const realDeltaSec = Math.min(0.25, (nowMs - this.lastTickTime) / 1000);
    this.lastTickTime = nowMs;

    const speedRatio = this.getSpeedRatio();
    this.trackCursorSec += realDeltaSec * speedRatio;

    if (this.trackCursorSec >= this.currentRecord.durationSeconds) {
      // Auto-return tonearm at inner runout groove
      this.trackCursorSec = 0;
      this.nextStepIndex = 0;
      this.pause(true);
      return;
    }

    const stepDuration = 0.35; // native seconds per musical step
    const currentStep = Math.floor(this.trackCursorSec / stepDuration);

    while (this.nextStepIndex <= currentStep) {
      this.triggerMusicalStep(this.nextStepIndex, this.currentRecord, speedRatio);
      this.nextStepIndex++;
    }
  }

  private triggerMusicalStep(step: number, record: VinylRecord, speedRatio: number) {
    if (!this.ctx || !this.waveshaper) return;
    const now = this.ctx.currentTime;
    const pitchScale = speedRatio;

    if (record.patternId === 'hsp_radio_2482') {
      // 1) Time signal pips + Morse "HSP" + Majestic Thai pentatonic brass fanfare
      const barStep = step % 32;
      if (barStep < 6) {
        // Classic 6-pip Greenwich/Bangkok time signal (1000Hz short pips, 6th pip elongated)
        const isFinalPip = barStep === 5;
        this.playVoice(
          1000 * pitchScale,
          'sine',
          now,
          isFinalPip ? 0.38 : 0.11,
          0.16,
          0.004,
          0.06
        );
      } else if (barStep >= 6 && barStep < 14) {
        // Morse callsign H-S-P tone pulses + warm harmonic bed
        const morseNotes = [660, 660, 0, 660, 784, 0, 880, 660];
        const freq = morseNotes[barStep - 6];
        if (freq > 0) {
          this.playVoice(freq * pitchScale, 'triangle', now, 0.14, 0.11, 0.005, 0.05);
        }
      } else {
        // Ceremonial Thai Pentatonic Brass & Woodwind Fanfare (C D E G A)
        const melody = [
          261.63, 329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63,
          293.66, 329.63, 392.0, 329.63, 261.63, 0, 261.63, 392.0, 523.25, 0,
        ];
        const idx = (barStep - 14) % melody.length;
        const note = melody[idx];
        if (note > 0) {
          this.playVoice(note * pitchScale, 'sawtooth', now, 0.28 / pitchScale, 0.14, 0.02, 0.15);
          this.playVoice((note * 0.5) * pitchScale, 'triangle', now, 0.34 / pitchScale, 0.16, 0.02, 0.18);
        }
        if (barStep % 4 === 0) {
          this.playVoice(130.81 * pitchScale, 'sine', now, 0.65 / pitchScale, 0.22, 0.02, 0.3);
        }
      }
    } else if (record.patternId === 'chao_phraya_2495') {
      // 2) Mid-century Suntaraporn-inspired Bangkok Ballroom Jazz Waltz / Slow Fox
      const barStep = step % 32;
      const chords: number[][] = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0], // Am7
        [293.66, 349.23, 440.0, 523.25], // Dm7
        [196.0, 246.94, 293.66, 349.23], // G7
      ];
      const chordIdx = Math.floor(barStep / 8) % chords.length;
      const chord = chords[chordIdx];

      // Walking upright bass
      const bassStep = barStep % 8;
      if (bassStep === 0 || bassStep === 2 || bassStep === 4 || bassStep === 6) {
        const bassNote = chord[bassStep % 3] * 0.5;
        this.playVoice(bassNote * pitchScale, 'triangle', now, 0.42 / pitchScale, 0.24, 0.015, 0.22);
      }

      // Warm electric organ / string chord pad on beat 1 and 5
      if (bassStep === 0 || bassStep === 4) {
        chord.forEach((n) => {
          this.playVoice(n * pitchScale, 'sine', now, 0.85 / pitchScale, 0.075, 0.04, 0.35);
        });
      }

      // Muted horn / vibraphone lead melody
      const leadMelody = [
        523.25, 0, 493.88, 440.0, 392.0, 0, 329.63, 392.0,
        440.0, 0, 392.0, 329.63, 293.66, 0, 329.63, 0,
        349.23, 0, 440.0, 523.25, 493.88, 440.0, 392.0, 0,
        329.63, 293.66, 261.63, 0, 392.0, 329.63, 261.63, 0,
      ];
      const lead = leadMelody[barStep];
      if (lead > 0) {
        this.playVoice(lead * pitchScale, 'triangle', now, 0.36 / pitchScale, 0.16, 0.015, 0.18);
        this.playVoice(lead * 2 * pitchScale, 'sine', now, 0.18 / pitchScale, 0.045, 0.01, 0.12);
      }

      // Brushed snare whisper on off-beats
      if (barStep % 2 === 1) {
        this.playBrushHit(now, 0.045);
      }
    } else if (record.patternId === 'tv4_chime_2498') {
      // 3) 1955 Channel 4 Bang Khun Phrom Test Card Harmonic + Thai Ranat-Ek Classical Ensemble
      const barStep = step % 32;
      if (barStep < 8) {
        // Test Card 440Hz + 880Hz tuning tone fade
        if (barStep === 0) {
          this.playVoice(440 * pitchScale, 'sine', now, 1.4 / pitchScale, 0.12, 0.08, 0.4);
          this.playVoice(880 * pitchScale, 'sine', now, 1.4 / pitchScale, 0.05, 0.08, 0.4);
        }
      } else {
        // Ranat-ek (percussive wooden xylophone timbre) Thai classical pentatonic motif
        const ranatScale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
        const pattern = [0, 2, 3, 4, 3, 2, 1, 0, 2, 4, 5, 4, 3, 2, 3, 1, 0, 1, 2, 3, 4, 2, 1, 0];
        const idx = pattern[(barStep - 8) % pattern.length];
        const freq = ranatScale[idx];
        // Percussive wooden mallet attack
        this.playVoice(freq * pitchScale, 'triangle', now, 0.22 / pitchScale, 0.21, 0.003, 0.14);
        this.playVoice(freq * 2.98 * pitchScale, 'sine', now, 0.06 / pitchScale, 0.09, 0.002, 0.04);

        // Deep Khong Wong / Ching pulse every 4 steps
        if (barStep % 4 === 0) {
          this.playVoice((freq * 0.25) * pitchScale, 'sine', now, 0.7 / pitchScale, 0.2, 0.008, 0.4);
        }
        if (barStep % 4 === 2) {
          // Metallic "Ching" ring
          this.playVoice(2480 * pitchScale, 'sine', now, 0.18 / pitchScale, 0.065, 0.002, 0.15);
        }
      }
    } else if (record.patternId === 'klui_archive_2510') {
      // 4) 2510 Documentary: Klui (Thai bamboo flute) & Warm Broadcast String Pad
      const barStep = step % 32;
      const kluiNotes = [
        392.0, 440.0, 523.25, 0, 587.33, 523.25, 440.0, 0,
        392.0, 329.63, 293.66, 0, 329.63, 392.0, 440.0, 0,
        523.25, 659.25, 587.33, 0, 523.25, 440.0, 392.0, 0,
        329.63, 293.66, 261.63, 0, 293.66, 392.0, 0, 0,
      ];
      const note = kluiNotes[barStep];
      if (note > 0) {
        this.playVoice(note * pitchScale, 'sine', now, 0.55 / pitchScale, 0.18, 0.055, 0.28);
        this.playVoice((note * 2) * pitchScale, 'sine', now, 0.35 / pitchScale, 0.035, 0.06, 0.2);
      }
      if (barStep % 8 === 0) {
        const padRoot = barStep < 16 ? 196.0 : 130.81;
        this.playVoice(padRoot * pitchScale, 'triangle', now, 1.9 / pitchScale, 0.12, 0.18, 0.7);
        this.playVoice((padRoot * 1.5) * pitchScale, 'sine', now, 1.9 / pitchScale, 0.08, 0.18, 0.7);
      }
    } else {
      // 5) 1985 (B.E. 2528) 80s Bangkok FM Stereo Synth-Pop Groove (Cmaj9 -> Am7 -> Fmaj7 -> G6)
      const barStep = step % 32;
      const chordRoots = [130.81, 110.0, 87.31, 98.0]; // C3, A2, F2, G2
      const chordPads: number[][] = [
        [261.63, 329.63, 392.0, 493.88, 587.33], // Cmaj9
        [220.0, 261.63, 329.63, 392.0, 493.88],  // Am9
        [174.61, 220.0, 261.63, 329.63, 392.0],  // Fmaj9
        [196.0, 246.94, 293.66, 329.63, 440.0],  // G6
      ];
      const sectionIdx = Math.floor(barStep / 8) % 4;
      const root = chordRoots[sectionIdx];
      const pad = chordPads[sectionIdx];
      const subStep = barStep % 8;

      // 80s Octave Driving Synth-Bass (classic sawtooth punch)
      const bassOctave = subStep % 2 === 0 ? 0.5 : 1.0;
      this.playVoice((root * bassOctave) * pitchScale, 'sawtooth', now, 0.22 / pitchScale, 0.17, 0.008, 0.12);
      this.playVoice((root * bassOctave * 0.5) * pitchScale, 'triangle', now, 0.24 / pitchScale, 0.16, 0.008, 0.12);

      // DX7-style Shimmering FM Electric Piano Arpeggio
      const arpFreq = pad[subStep % pad.length];
      this.playVoice(arpFreq * pitchScale, 'sine', now, 0.28 / pitchScale, 0.095, 0.004, 0.18);
      this.playVoice((arpFreq * 2) * pitchScale, 'triangle', now, 0.14 / pitchScale, 0.035, 0.002, 0.1);

      // Warm Analog Polysynth Pad swell at start of each chord bar
      if (subStep === 0) {
        pad.slice(0, 3).forEach((freq) => {
          this.playVoice(freq * pitchScale, 'triangle', now, 2.1 / pitchScale, 0.06, 0.15, 0.85);
        });
      }

      // Catchy 80s Retro Synth Lead Hook
      const synthHook = [
        659.25, 0, 587.33, 523.25, 587.33, 659.25, 783.99, 0,
        659.25, 0, 523.25, 493.88, 440.0, 0, 523.25, 0,
        587.33, 0, 523.25, 440.0, 523.25, 587.33, 659.25, 0,
        587.33, 523.25, 493.88, 392.0, 440.0, 493.88, 523.25, 0,
      ];
      const lead = synthHook[barStep];
      if (lead > 0) {
        // Dual detuned 80s chorus synth lead
        this.playVoice(lead * pitchScale, 'sawtooth', now, 0.3 / pitchScale, 0.085, 0.015, 0.16);
        this.playVoice((lead * 1.004) * pitchScale, 'triangle', now, 0.32 / pitchScale, 0.1, 0.015, 0.16);
      }

      // 80s Electronic Drum Machine: Punchy Kick on 0, 4 | Gated Snare on 2, 6 | Crisp Hi-Hat on odd steps
      if (subStep === 0 || subStep === 4) {
        this.play80sKick(now, pitchScale);
      }
      if (subStep === 2 || subStep === 6) {
        this.play80sSnare(now);
      }
      if (subStep % 2 === 1) {
        this.playBrushHit(now, 0.06);
      }
    }
  }

  private play80sKick(startTime: number, pitchScale: number) {
    if (!this.ctx || !this.waveshaper) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(135 * pitchScale, startTime);
    osc.frequency.exponentialRampToValueAtTime(46 * pitchScale, startTime + 0.12);

    gain.gain.setValueAtTime(0.32, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

    osc.connect(gain);
    gain.connect(this.waveshaper);
    osc.start(startTime);
    osc.stop(startTime + 0.24);
  }

  private play80sSnare(startTime: number) {
    if (!this.ctx || !this.waveshaper) return;
    // Snare body
    this.playVoice(185, 'triangle', startTime, 0.09, 0.16, 0.002, 0.07);
    // Gated white-noise burst
    const len = Math.floor(this.ctx.sampleRate * 0.16);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const gate = i < len * 0.65 ? 1 : Math.exp(-(i - len * 0.65) / (len * 0.12));
      ch[i] = (Math.random() * 2 - 1) * gate;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1750;
    bp.Q.value = 0.7;
    const g = this.ctx.createGain();
    g.gain.value = 0.16;
    src.connect(bp);
    bp.connect(g);
    g.connect(this.waveshaper);
    src.start(startTime);
  }

  private playVoice(
    freq: number,
    type: OscillatorType,
    startTime: number,
    duration: number,
    peakGain: number,
    attack: number,
    release: number
  ) {
    if (!this.ctx || !this.waveshaper) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, Math.min(8000, freq)), startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gain.gain.setValueAtTime(peakGain * 0.85, Math.max(startTime + attack, startTime + duration - release));
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.02);

    osc.connect(gain);
    gain.connect(this.waveshaper);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  private playBrushHit(startTime: number, level: number) {
    if (!this.ctx || !this.waveshaper) return;
    const len = Math.floor(this.ctx.sampleRate * 0.06);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.35));
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 3200;
    const g = this.ctx.createGain();
    g.gain.value = level;
    src.connect(hp);
    hp.connect(g);
    g.connect(this.waveshaper);
    src.start(startTime);
  }

  private getFrequencyBars(): number[] {
    if (!this.analyser || !this.isPlaying) {
      return new Array(12).fill(0.05);
    }
    this.analyser.getByteFrequencyData(this.freqData);
    const bars: number[] = [];
    for (let i = 0; i < 12; i++) {
      const val = this.freqData[i + 1] ?? 0;
      bars.push(Math.max(0.08, Math.min(1, val / 210)));
    }
    return bars;
  }

  public getState(): TurntableState {
    const progress =
      this.currentRecord && this.currentRecord.durationSeconds > 0
        ? Math.min(1, this.trackCursorSec / this.currentRecord.durationSeconds)
        : 0;
    return {
      isPlaying: this.isPlaying,
      tonearmDropped: this.tonearmDropped,
      progress,
      currentRpm: this.currentRpm,
      volume: this.volume,
      crackleLevel: this.crackleLevel,
      frequencyBars: this.getFrequencyBars(),
    };
  }

  private emitState() {
    this.onStateChange(this.getState());
  }

  public dispose() {
    this.stopLoops();
    if (this.crackleSource) {
      try {
        this.crackleSource.stop();
      } catch {
        // ignore already stopped
      }
    }
    if (this.rumbleOsc) {
      try {
        this.rumbleOsc.stop();
      } catch {
        // ignore already stopped
      }
    }
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
