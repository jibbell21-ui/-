import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Disc3, Box } from 'lucide-react';
import { ArchiveItem, formatYear } from '../data/archives';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface AccessionModalProps {
  lang: Language;
  item: ArchiveItem | null;
  onClose: () => void;
  onPlayVinyl: (vinylTrackId: string) => void;
  onJumpTo3DZone: (zoneId: string) => void;
}

export const AccessionModal: React.FC<AccessionModalProps> = ({
  lang,
  item,
  onClose,
  onPlayVinyl,
  onJumpTo3DZone,
}) => {
  const t = TRANSLATIONS[lang].modal;
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const title = lang === 'th' ? item.title : item.titleEn;
  const subtitle = lang === 'th' ? item.subtitle : item.subtitleEn;
  const summary = lang === 'th' ? item.summary : item.summaryEn;
  const transcription = lang === 'th' ? item.transcription : item.transcriptionEn;
  const location = lang === 'th' ? item.locationInMuseum : item.locationInMuseumEn;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accession-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[#D6D0C4] bg-[#FAF9F6] shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeLabel}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#D6D0C4] bg-white/95 text-[#141413] shadow-sm hover:bg-[#EFECE5]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left: Museum Visual Specimen Frame */}
        <div className="relative flex flex-col justify-between bg-[#ECE8DF] p-5 md:w-1/2">
          <div className="relative flex-1 overflow-hidden rounded-lg border border-[#D6D0C4] bg-[#1C1917]">
            <img
              src={item.imagePath}
              alt={title}
              referrerPolicy="no-referrer"
              className={`h-full max-h-[340px] w-full object-cover transition-transform duration-300 md:max-h-[460px] ${
                zoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              }`}
              onClick={() => setZoomed((z) => !z)}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#57534E]">
            <span className="italic">{location}</span>
            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded border border-[#D6D0C4] bg-white px-2.5 py-1 text-xs font-medium text-[#141413] hover:bg-[#F4F1EA]"
            >
              {zoomed ? (
                <>
                  <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.zoomOut}</span>
                </>
              ) : (
                <>
                  <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.zoomIn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Structured Museum Accession Metadata */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:w-1/2">
          <div className="pr-8">
            <p className="font-mono text-xs tracking-wider text-[#1E3A8A] tabular-nums">
              {item.accessionNumber} · {formatYear(item.yearBE, lang)}
            </p>
            <h3
              id="accession-modal-title"
              className="mt-2 text-2xl font-semibold leading-snug text-[#141413]"
            >
              {title}
            </h3>
            <p className="mt-1 text-sm text-[#57534E]">{subtitle}</p>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#292524]">{summary}</p>

          <div className="mt-5 border-y border-[#E4E0D8] py-4">
            <p className="text-xs font-medium text-[#6B665E]">{t.transcriptionTitle}</p>
            <blockquote className="mt-2 font-serif text-base italic leading-relaxed text-[#141413]">
              {transcription}
            </blockquote>
          </div>

          <dl className="mt-5 divide-y divide-[#ECE8E0] text-xs">
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="shrink-0 text-[#6B665E]">{t.category}</dt>
              <dd className="text-right font-medium text-[#141413]">
                {lang === 'th' ? item.category : item.categoryEn}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="shrink-0 text-[#6B665E]">{t.creator}</dt>
              <dd className="text-right font-medium text-[#141413]">
                {lang === 'th' ? item.creator : item.creatorEn}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="shrink-0 text-[#6B665E]">{t.medium}</dt>
              <dd className="text-right text-[#292524]">
                {lang === 'th' ? item.medium : item.mediumEn}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="shrink-0 text-[#6B665E]">{t.dimensions}</dt>
              <dd className="text-right font-mono tabular-nums text-[#292524]">
                {lang === 'th' ? item.dimensions : item.dimensionsEn}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="shrink-0 text-[#6B665E]">{t.provenance}</dt>
              <dd className="text-right text-[#292524]">
                {lang === 'th' ? item.provenance : item.provenanceEn}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            {item.vinylTrackId && (
              <button
                type="button"
                onClick={() => {
                  onPlayVinyl(item.vinylTrackId!);
                  onClose();
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#1E3A8A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1E40AF]"
              >
                <Disc3 className="h-4 w-4" aria-hidden="true" />
                <span>{t.playOnTurntable}</span>
              </button>
            )}
            {item.exhibitZoneId && (
              <button
                type="button"
                onClick={() => {
                  onJumpTo3DZone(item.exhibitZoneId!);
                  onClose();
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#C8BFB0] bg-white px-4 py-2.5 text-sm font-medium text-[#141413] hover:bg-[#F4F1EA]"
              >
                <Box className="h-4 w-4" aria-hidden="true" />
                <span>{t.viewIn3d}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
