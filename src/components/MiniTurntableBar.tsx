import React from 'react';
import { Disc3, Pause, Play, X } from 'lucide-react';
import { VinylRecord } from '../data/archives';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface MiniTurntableBarProps {
  lang: Language;
  visible: boolean;
  record: VinylRecord;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
  onJumpToTurntable: () => void;
  onDismiss: () => void;
}

export const MiniTurntableBar: React.FC<MiniTurntableBarProps> = ({
  lang,
  visible,
  record,
  isPlaying,
  progress,
  onTogglePlay,
  onJumpToTurntable,
  onDismiss,
}) => {
  if (!visible) return null;
  const t = TRANSLATIONS[lang].miniBar;

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex max-w-[min(420px,calc(100vw-2rem))] items-center gap-3 rounded-xl border border-[#C8BFB0] bg-[#1B1A19] px-3.5 py-2.5 text-white shadow-xl"
      role="region"
      aria-label={t.regionLabel}
    >
      <button
        type="button"
        onClick={onJumpToTurntable}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#292524]"
        title={t.jumpTitle}
      >
        <Disc3
          className={`h-6 w-6 text-[#D4AF37] ${isPlaying ? 'animate-spin' : ''}`}
          style={{ animationDuration: '3s' }}
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        onClick={onJumpToTurntable}
        className="min-w-0 flex-1 text-left"
      >
        <p className="truncate text-xs font-medium text-white">
          {lang === 'th' ? record.title : record.titleEn}
        </p>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full bg-[#D4AF37] transition-all duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </button>

      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={isPlaying ? t.pauseLabel : t.playLabel}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#D4AF37] text-[#141413] hover:bg-[#E5C158]"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>

      <button
        type="button"
        onClick={onDismiss}
        aria-label={t.closeLabel}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[#A8A29E] hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
