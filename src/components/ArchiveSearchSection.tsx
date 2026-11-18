import React, { useMemo, useState } from 'react';
import { Search, X, ArrowUpRight, Disc3, Box } from 'lucide-react';
import {
  ArchiveCategory,
  ArchiveEra,
  ArchiveItem,
  CATEGORY_LABELS,
  ERA_LABELS,
  formatYear,
} from '../data/archives';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface ArchiveSearchSectionProps {
  lang: Language;
  items: ArchiveItem[];
  onInspectItem: (item: ArchiveItem) => void;
  onPlayVinyl: (vinylTrackId: string) => void;
  onJumpTo3DZone: (zoneId: string) => void;
}

const CATEGORIES: Array<'ALL' | ArchiveCategory> = [
  'ALL',
  'เอกสารจดหมายเหตุ',
  'สื่อวิทยุและโทรทัศน์',
  'ภาพถ่ายประวัติศาสตร์',
  'แผ่นเสียงต้นฉบับ',
];

const ERAS: Array<'ALL' | ArchiveEra> = [
  'ALL',
  'พ.ศ. 2476–2490',
  'พ.ศ. 2491–2510',
  'พ.ศ. 2511–2535',
  'พ.ศ. 2536–ปัจจุบัน',
];

export const ArchiveSearchSection: React.FC<ArchiveSearchSectionProps> = ({
  lang,
  items,
  onInspectItem,
  onPlayVinyl,
  onJumpTo3DZone,
}) => {
  const t = TRANSLATIONS[lang].search;
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ArchiveCategory>('ALL');
  const [selectedEra, setSelectedEra] = useState<'ALL' | ArchiveEra>('ALL');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (selectedEra !== 'ALL' && item.era !== selectedEra) return false;
      if (!q) return true;
      const haystack = [
        item.title,
        item.titleEn,
        item.subtitle,
        item.subtitleEn,
        item.accessionNumber,
        item.creator,
        item.creatorEn,
        item.summary,
        item.summaryEn,
        item.yearBE.toString(),
        String(item.yearBE - 543),
        ...item.keywords,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, selectedCategory, selectedEra]);

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('ALL');
    setSelectedEra('ALL');
  };

  return (
    <section id="search" aria-labelledby="search-heading" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col gap-4 border-b border-[#E4E0D8] pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-[#1E3A8A]">{t.kicker}</p>
            <h2
              id="search-heading"
              className="text-balance mt-2 text-3xl font-semibold tracking-tight text-[#141413] sm:text-4xl"
            >
              {t.heading}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#4A4843]">{t.subheading}</p>
          </div>
          <div className="text-sm text-[#57534E] tabular-nums">
            {t.countPrefix}{' '}
            <span className="font-semibold text-[#141413]">{filteredItems.length}</span>{' '}
            {t.countMid} {items.length} {t.countSuffix}
          </div>
        </div>

        {/* Simple & Accessible Search Toolbar */}
        <div className="mb-8 rounded-xl border border-[#E4E0D8] bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.placeholder}
                aria-label={t.heading}
                className="min-h-[46px] w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] py-2.5 pl-10 pr-10 text-sm text-[#141413] placeholder:text-[#78716C] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label={t.clearLabel}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[#57534E] hover:bg-[#EFECE5]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="era-select" className="shrink-0 text-xs font-medium text-[#57534E]">
                {t.eraLabel}
              </label>
              <select
                id="era-select"
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value as 'ALL' | ArchiveEra)}
                className="min-h-[46px] rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#141413] focus:border-[#1E3A8A] focus:outline-none"
              >
                {ERAS.map((era) => (
                  <option key={era} value={era}>
                    {era === 'ALL' ? t.allEras : ERA_LABELS[era][lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Segmented Tabs + Quick Suggestions */}
          <div className="mt-4 flex flex-col gap-3 border-t border-[#F0ECE3] pt-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="flex flex-wrap gap-1.5 rounded-lg bg-[#F4F1EA] p-1"
              role="tablist"
              aria-label={t.heading}
            >
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                const label =
                  category === 'ALL' ? t.allCategories : CATEGORY_LABELS[category][lang];
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(category)}
                    className={`min-h-[38px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-white text-[#141413] shadow-sm'
                        : 'text-[#57534E] hover:text-[#141413]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B665E]">
              <span>{t.quickSuggest}</span>
              {t.quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="min-h-[32px] border-b border-dashed border-[#A8A29E] px-1 text-[#1E3A8A] hover:border-[#1E3A8A] whitespace-nowrap shrink-0"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-[#E4E0D8] bg-white px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-[#141413]">{t.emptyTitle}</h3>
            <p className="mt-2 text-sm text-[#57534E]">{t.emptyDesc}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex min-h-[44px] items-center rounded-md bg-[#1E3A8A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1E40AF]"
            >
              {t.resetBtn}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const imgFailed = brokenImages[item.id];
              const displayTitle = lang === 'th' ? item.title : item.titleEn;
              const displayCategory = lang === 'th' ? item.category : item.categoryEn;
              const displaySummary = lang === 'th' ? item.summary : item.summaryEn;

              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[#E4E0D8] bg-white transition-shadow duration-200 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => onInspectItem(item)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8DF] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
                  >
                    {!imgFailed ? (
                      <img
                        src={item.imagePath}
                        alt={displayTitle}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setBrokenImages((prev) => ({ ...prev, [item.id]: true }))
                        }
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EBE6DC] to-[#D9D2C5] p-6 text-center">
                        <span className="font-mono text-xs text-[#57534E]">
                          {item.accessionNumber}
                        </span>
                        <span className="mt-2 text-sm font-medium text-[#141413]">
                          {displayCategory}
                        </span>
                      </div>
                    )}
                  </button>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6B665E]">
                      <span className="font-medium text-[#1E3A8A]">{displayCategory}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{formatYear(item.yearBE, lang)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{item.accessionNumber}</span>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold leading-snug text-[#141413]">
                      <button
                        type="button"
                        onClick={() => onInspectItem(item)}
                        className="text-left hover:text-[#1E3A8A] focus-visible:outline-2 focus-visible:outline-[#1E3A8A]"
                      >
                        {displayTitle}
                      </button>
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4A4843]">
                      {displaySummary}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#F0ECE3] pt-4">
                      <button
                        type="button"
                        onClick={() => onInspectItem(item)}
                        className="inline-flex min-h-[40px] items-center gap-1 text-xs font-semibold text-[#141413] hover:text-[#1E3A8A] whitespace-nowrap shrink-0"
                      >
                        <span>{t.openDoc}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>

                      <div className="flex items-center gap-2">
                        {item.vinylTrackId && (
                          <button
                            type="button"
                            onClick={() => onPlayVinyl(item.vinylTrackId!)}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[#1E3A8A]/25 bg-[#1E3A8A]/5 px-3 py-1.5 text-xs font-medium text-[#1E3A8A] hover:bg-[#1E3A8A]/10 whitespace-nowrap shrink-0"
                          >
                            <Disc3 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{t.playVinyl}</span>
                          </button>
                        )}
                        {item.exhibitZoneId && !item.vinylTrackId && (
                          <button
                            type="button"
                            onClick={() => onJumpTo3DZone(item.exhibitZoneId!)}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[#D6D0C4] px-3 py-1.5 text-xs font-medium text-[#4A4843] hover:bg-[#F4F1EA] whitespace-nowrap shrink-0"
                          >
                            <Box className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{t.view3d}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
