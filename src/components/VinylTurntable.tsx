import React, { useEffect, useRef, useState } from 'react';
import {
  Disc3,
  Play,
  Square,
  Volume2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { VinylRecord, formatYear } from '../data/archives';
import { TurntableState } from '../audio/turntableEngine';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface VinylTurntableProps {
  lang: Language;
  records: VinylRecord[];
  activeRecord: VinylRecord;
  turntableState: TurntableState;
  onSelectRecord: (record: VinylRecord, autoPlay?: boolean) => void;
  onTogglePlay: () => void;
  onToggleCue: () => void;
  onSetRpm: (rpm: 33.33 | 45 | 78) => void;
  onSetVolume: (vol: number) => void;
  onSetCrackle: (level: number) => void;
  onSeek: (progress: number, dropAndPlay?: boolean) => void;
}

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const VinylTurntable: React.FC<VinylTurntableProps> = ({
  lang,
  records,
  activeRecord,
  turntableState,
  onSelectRecord,
  onTogglePlay,
  onToggleCue,
  onSetRpm,
  onSetVolume,
  onSetCrackle,
  onSeek,
}) => {
  const t = TRANSLATIONS[lang].turntable;
  const platterRef = useRef<HTMLDivElement | null>(null);
  const discRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(0);
  const isDraggingGrooveRef = useRef(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const animateDisc = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (turntableState.isPlaying && discRef.current) {
        const degPerSec = (turntableState.currentRpm / 60) * 360;
        rotationRef.current = (rotationRef.current + degPerSec * dt) % 360;
        discRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }
      rafId = requestAnimationFrame(animateDisc);
    };

    rafId = requestAnimationFrame(animateDisc);
    return () => cancelAnimationFrame(rafId);
  }, [turntableState.isPlaying, turntableState.currentRpm]);

  const tonearmAngle = !turntableState.tonearmDropped
    ? -24
    : 16 + turntableState.progress * 21;

  const computeGrooveProgressFromPointer = (clientX: number, clientY: number): number | null => {
    const el = platterRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const radius = rect.width / 2;
    const normRadius = dist / radius;

    if (normRadius < 0.28 || normRadius > 0.98) return null;
    const clamped = Math.max(0.36, Math.min(0.92, normRadius));
    return (0.92 - clamped) / (0.92 - 0.36);
  };

  const handlePlatterPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const prog = computeGrooveProgressFromPointer(e.clientX, e.clientY);
    if (prog !== null) {
      isDraggingGrooveRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      onSeek(prog, true);
    }
  };

  const handlePlatterPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const prog = computeGrooveProgressFromPointer(e.clientX, e.clientY);
    setHoverProgress(prog);
    if (isDraggingGrooveRef.current && prog !== null) {
      onSeek(prog, true);
    }
  };

  const handlePlatterPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingGrooveRef.current) {
      isDraggingGrooveRef.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const elapsedSeconds = turntableState.progress * activeRecord.durationSeconds;
  const speedRatio = turntableState.currentRpm / activeRecord.nativeRpm;
  const activeTitle = lang === 'th' ? activeRecord.title : activeRecord.titleEn;

  return (
    <section
      id="turntable"
      aria-labelledby="turntable-heading"
      className="border-t border-[#E4E0D8] bg-[#FAF9F6] py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 border-b border-[#DCD7CD] pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-[#1E3A8A]">{t.kicker}</p>
            <h2
              id="turntable-heading"
              className="text-balance mt-2 text-3xl font-semibold tracking-tight text-[#141413] sm:text-4xl"
            >
              {t.heading}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#4A4843]">{t.subheading}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#57534E]">
            <span className="font-mono tabular-nums">
              {t.platterLabel}{' '}
              {turntableState.currentRpm === 33.33 ? '33⅓' : turntableState.currentRpm} RPM
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {t.regLabel} {activeRecord.catalogNo}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left 7 cols: Realistic Interactive Teak & Brushed Aluminum Turntable */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-[#C8BFB0] bg-gradient-to-br from-[#3D2B1F] via-[#2F2017] to-[#231710] p-4 shadow-lg sm:p-7">
              <div className="relative rounded-lg border border-white/10 bg-[#1B1A19] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Disc3 className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                    <span className="font-mono text-xs tracking-wider text-[#E5DFD3]">
                      PRD ARCHIVE REFERENCE TURNTABLE
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs tabular-nums text-[#A8A29E]">
                    <span>{turntableState.isPlaying ? t.spinning : t.stopped}</span>
                    <span aria-hidden="true">/</span>
                    <span>{turntableState.tonearmDropped ? t.needleDown : t.needleUp}</span>
                  </div>
                </div>

                {/* Turntable Mechanical Surface */}
                <div className="relative mx-auto flex aspect-square w-full max-w-[440px] items-center justify-center select-none sm:aspect-[1.12/1] sm:max-w-[500px]">
                  <div
                    className="absolute bottom-4 left-3 z-20 flex flex-col items-start gap-1 sm:bottom-6 sm:left-4"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-3 w-5 rounded-sm border border-black/40 transition-colors ${
                        turntableState.isPlaying
                          ? 'bg-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                          : 'bg-[#451A1A]'
                      }`}
                    />
                    <span className="font-mono text-[10px] text-[#78716C]">STROBE</span>
                  </div>

                  <div
                    ref={platterRef}
                    onPointerDown={handlePlatterPointerDown}
                    onPointerMove={handlePlatterPointerMove}
                    onPointerUp={handlePlatterPointerUp}
                    onPointerLeave={() => setHoverProgress(null)}
                    role="slider"
                    aria-label={t.sliderAria}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(turntableState.progress * 100)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        onSeek(Math.min(0.98, turntableState.progress + 0.05), true);
                      } else if (e.key === 'ArrowLeft') {
                        onSeek(Math.max(0, turntableState.progress - 0.05), true);
                      }
                    }}
                    className="relative aspect-square w-[82%] max-w-[360px] -translate-x-4 cursor-crosshair touch-none rounded-full bg-gradient-to-b from-[#D6D3D1] via-[#78716C] to-[#44403C] p-[6px] shadow-[0_14px_30px_rgba(0,0,0,0.65)] sm:-translate-x-6"
                  >
                    <svg
                      viewBox="0 0 200 200"
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      aria-hidden="true"
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="97"
                        fill="none"
                        stroke="#E7E5E4"
                        strokeWidth="1.5"
                        strokeDasharray="1.8 4.2"
                        opacity="0.7"
                      />
                    </svg>

                    <div
                      ref={discRef}
                      className="relative flex h-full w-full items-center justify-center rounded-full bg-[#111111] shadow-inner will-change-transform"
                      style={{
                        backgroundImage:
                          'repeating-radial-gradient(circle at center, #141414 0px, #141414 2px, #1F1E1D 3px, #0D0D0D 4px)',
                      }}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 rounded-full opacity-35"
                        style={{
                          background:
                            'conic-gradient(from 35deg, transparent 0deg, rgba(255,255,255,0.22) 38deg, transparent 78deg, transparent 180deg, rgba(255,255,255,0.18) 215deg, transparent 255deg)',
                        }}
                      />

                      <div className="pointer-events-none absolute h-[42%] w-[42%] rounded-full border border-white/10" />

                      <div
                        className="relative z-10 flex h-[34%] w-[34%] flex-col items-center justify-center rounded-full border-2 p-2 text-center shadow-md"
                        style={{
                          backgroundColor: activeRecord.labelColor,
                          borderColor: activeRecord.labelAccent,
                          color: activeRecord.labelAccent,
                        }}
                      >
                        <span className="font-mono text-[8px] tracking-widest uppercase opacity-90 sm:text-[9px]">
                          PRD ARCHIVE
                        </span>
                        <span className="mt-0.5 line-clamp-2 text-[9px] font-semibold leading-tight sm:text-[10px]">
                          {lang === 'th' ? activeRecord.yearBE : activeRecord.yearBE - 543}
                        </span>
                        <span className="mt-0.5 font-mono text-[8px] opacity-85">
                          {activeRecord.nativeRpm === 33.33 ? '33⅓' : activeRecord.nativeRpm} RPM
                        </span>
                        <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-gradient-to-br from-[#F5F5F4] to-[#78716C] shadow" />
                      </div>
                    </div>

                    {hoverProgress !== null && (
                      <div
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/70"
                        style={{
                          width: `${(0.92 - hoverProgress * (0.92 - 0.36)) * 100}%`,
                          height: `${(0.92 - hoverProgress * (0.92 - 0.36)) * 100}%`,
                        }}
                      />
                    )}
                  </div>

                  {/* Articulated Tonearm */}
                  <div
                    className="pointer-events-none absolute right-2 top-5 z-30 h-[78%] w-[24%] sm:right-3 sm:top-6"
                    aria-hidden="true"
                  >
                    <div className="absolute right-3 top-2 h-14 w-14 rounded-full border border-white/15 bg-gradient-to-b from-[#57534E] to-[#1C1917] shadow-xl sm:h-16 sm:w-16">
                      <div className="absolute inset-2 rounded-full border border-white/20 bg-gradient-to-br from-[#D6D3D1] to-[#57534E]" />
                    </div>

                    <div
                      className="absolute right-[38px] top-[34px] origin-top transition-transform duration-300 ease-out sm:right-[42px] sm:top-[38px]"
                      style={{
                        transform: `rotate(${tonearmAngle}deg)`,
                      }}
                    >
                      <div className="mx-auto -mt-10 h-6 w-5 rounded-sm border border-white/20 bg-gradient-to-r from-[#A8A29E] via-[#F5F5F4] to-[#78716C] shadow" />
                      <div className="mx-auto h-36 w-2 rounded-full bg-gradient-to-r from-[#A8A29E] via-[#F5F5F4] to-[#78716C] shadow-md sm:h-44" />
                      <div className="-ml-1.5 -mt-1 h-7 w-4 rotate-[22deg] rounded-sm border border-white/25 bg-[#292524] shadow-lg">
                        <div className="mx-auto mt-1 h-2 w-2 rounded-full bg-[#D4AF37]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Groove Timeline Scrubber & Frequency Meter */}
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-[#D6D3D1]">
                    <span className="truncate font-medium text-white">{activeTitle}</span>
                    <span className="ml-3 shrink-0 font-mono tabular-nums text-[#A8A29E]">
                      {formatTime(elapsedSeconds)} / {formatTime(activeRecord.durationSeconds)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(turntableState.progress * 100)}
                    onChange={(e) => onSeek(Number(e.target.value) / 100, true)}
                    aria-label={t.seekAria}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#292524] accent-[#D4AF37]"
                  />

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="flex h-5 items-end gap-1" aria-hidden="true">
                      {turntableState.frequencyBars.map((bar, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 rounded-t-sm bg-[#D4AF37]/85 transition-all duration-75"
                          style={{
                            height: `${Math.max(15, Math.round(bar * 100))}%`,
                            opacity: turntableState.isPlaying ? 0.9 : 0.25,
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[11px] tabular-nums text-[#A8A29E]">
                      {t.realSpeed} {speedRatio.toFixed(2)}× ({t.nativeSpeed}{' '}
                      {activeRecord.nativeRpm === 33.33 ? '33⅓' : activeRecord.nativeRpm} RPM)
                    </span>
                  </div>
                </div>

                {/* Hardware Controls */}
                <div className="mt-5 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={onTogglePlay}
                      className={`inline-flex min-h-[44px] items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                        turntableState.isPlaying
                          ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
                          : 'bg-[#D4AF37] text-[#141413] hover:bg-[#E5C158]'
                      }`}
                    >
                      {turntableState.isPlaying ? (
                        <>
                          <Square className="h-4 w-4 fill-current" aria-hidden="true" />
                          <span>{t.stopBtn}</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                          <span>{t.playBtn}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onToggleCue}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-white/20 bg-[#292524] px-3.5 py-2 text-xs font-medium text-[#E7E5E4] transition-colors hover:bg-[#3A3532] whitespace-nowrap shrink-0"
                    >
                      {turntableState.tonearmDropped ? (
                        <>
                          <ArrowUpFromLine className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                          <span>{t.liftNeedle}</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownToLine className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                          <span>{t.dropNeedle}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSeek(0, turntableState.isPlaying)}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-white/15 bg-transparent px-3 py-2 text-xs text-[#D6D3D1] transition-colors hover:bg-white/10 whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.restartBtn}</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[#A8A29E]">{t.speedLabel}</span>
                      <div
                        className="inline-flex rounded-md bg-[#111111] p-1"
                        role="group"
                        aria-label={t.speedLabel}
                      >
                        {([33.33, 45, 78] as const).map((rpm) => {
                          const active = turntableState.currentRpm === rpm;
                          return (
                            <button
                              key={rpm}
                              type="button"
                              onClick={() => onSetRpm(rpm)}
                              className={`min-h-[34px] rounded px-2.5 font-mono text-xs tabular-nums transition-colors whitespace-nowrap shrink-0 ${
                                active
                                  ? 'bg-[#D4AF37] font-semibold text-[#141413]'
                                  : 'text-[#A8A29E] hover:text-white'
                              }`}
                            >
                              {rpm === 33.33 ? '33⅓' : rpm}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex flex-col gap-1 text-[11px] text-[#A8A29E]">
                        <span className="flex items-center gap-1">
                          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {t.volumeLabel} ({Math.round(turntableState.volume * 100)}%)
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={Math.round(turntableState.volume * 100)}
                          onChange={(e) => onSetVolume(Number(e.target.value) / 100)}
                          className="h-1.5 w-full cursor-pointer accent-[#D4AF37]"
                        />
                      </label>

                      <label className="flex flex-col gap-1 text-[11px] text-[#A8A29E]">
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          {t.crackleLabel} ({Math.round(turntableState.crackleLevel * 100)}%)
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={Math.round(turntableState.crackleLevel * 100)}
                          onChange={(e) => onSetCrackle(Number(e.target.value) / 100)}
                          className="h-1.5 w-full cursor-pointer accent-[#D4AF37]"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 cols: Archival Vinyl Record Shelf & Liner Notes */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-xl border border-[#DDD8CE] bg-white p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-[#141413]">
                {t.shelfTitle(records.length)}
              </h3>
              <p className="mt-1 text-sm text-[#57534E]">{t.shelfSubtitle}</p>

              <div className="mt-5 divide-y divide-[#ECE8E0]">
                {records.map((rec) => {
                  const isCurrent = rec.id === activeRecord.id;
                  return (
                    <div key={rec.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6B665E]">
                            <span className="font-mono tabular-nums">{rec.catalogNo}</span>
                            <span aria-hidden="true">·</span>
                            <span>{lang === 'th' ? rec.discType : rec.discTypeEn}</span>
                            <span aria-hidden="true">·</span>
                            <span>{formatYear(rec.yearBE, lang)}</span>
                          </div>
                          <h4 className="mt-1 text-base font-semibold leading-snug text-[#141413]">
                            {lang === 'th' ? rec.title : rec.titleEn}
                          </h4>
                          <p className="mt-1 text-xs text-[#57534E]">
                            {lang === 'th' ? rec.ensemble : rec.ensembleEn}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectRecord(rec, true)}
                          className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                            isCurrent && turntableState.isPlaying
                              ? 'bg-[#1E3A8A] text-white'
                              : isCurrent
                              ? 'border border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A]'
                              : 'border border-[#D6D0C4] bg-[#FAF9F6] text-[#141413] hover:bg-[#EFECE5]'
                          }`}
                        >
                          <Disc3 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {isCurrent && turntableState.isPlaying
                              ? t.playingNow
                              : isCurrent
                              ? t.playThis
                              : t.placeAndPlay}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-[#DDD8CE] bg-white p-5 sm:p-6">
              <p className="text-xs font-medium tracking-wider text-[#926C2C]">{t.notesKicker}</p>
              <h4 className="mt-1.5 text-lg font-semibold text-[#141413]">{activeTitle}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#4A4843]">
                {lang === 'th' ? activeRecord.description : activeRecord.descriptionEn}
              </p>
              <dl className="mt-4 space-y-2 border-t border-[#ECE8E0] pt-4 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6B665E]">{t.provenanceLabel}</dt>
                  <dd className="text-right font-medium text-[#141413]">
                    {lang === 'th' ? activeRecord.provenance : activeRecord.provenanceEn}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6B665E]">{t.standardRpmLabel}</dt>
                  <dd className="font-mono tabular-nums text-[#141413]">
                    {activeRecord.nativeRpm === 33.33 ? '33⅓' : activeRecord.nativeRpm} RPM
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6B665E]">{t.curatorNoteLabel}</dt>
                  <dd className="text-right text-[#4A4843]">
                    {lang === 'th' ? activeRecord.trackNote : activeRecord.trackNoteEn}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
