import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { TimelineChapter } from '../data/archives';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface TimelineSectionProps {
  lang: Language;
  chapters: TimelineChapter[];
  onOpenArtifact: (archiveId: string) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  lang,
  chapters,
  onOpenArtifact,
}) => {
  const t = TRANSLATIONS[lang].timeline;

  return (
    <section id="history" aria-labelledby="history-heading" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-medium tracking-wider text-[#1E3A8A]">{t.kicker}</p>
          <h2
            id="history-heading"
            className="text-balance mt-2 text-3xl font-semibold tracking-tight text-[#141413] sm:text-4xl"
          >
            {t.heading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#4A4843]">{t.subheading}</p>
        </div>

        <div className="divide-y divide-[#E4E0D8] border-y border-[#E4E0D8]">
          {chapters.map((ch) => (
            <div
              key={ch.index}
              className="grid grid-cols-1 gap-4 py-7 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <div className="flex items-baseline gap-3 md:col-span-3">
                <span className="font-mono text-sm font-medium tabular-nums text-[#926C2C]">
                  {ch.index}.
                </span>
                <span className="text-base font-semibold tabular-nums text-[#141413]">
                  {lang === 'th' ? ch.yearRange : ch.yearRangeEn}
                </span>
              </div>

              <div className="md:col-span-6">
                <h3 className="text-xl font-semibold text-[#141413]">
                  {lang === 'th' ? ch.title : ch.titleEn}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-[#57534E]">
                  {lang === 'th' ? ch.subtitle : ch.subtitleEn}
                </p>
                <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-[#4A4843]">
                  {lang === 'th' ? ch.narrative : ch.narrativeEn}
                </p>
              </div>

              <div className="flex md:col-span-3 md:justify-end">
                <button
                  type="button"
                  onClick={() => onOpenArtifact(ch.milestoneArtifactId)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-md border border-[#D6D0C4] bg-white px-4 py-2 text-xs font-medium text-[#141413] transition-colors hover:bg-[#F4F1EA] whitespace-nowrap shrink-0"
                >
                  <span>{t.viewArtifact}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
