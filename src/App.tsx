import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
  Search,
  Disc3,
  Box,
  CalendarDays,
  Globe,
  Share2,
  Check,
  Download,
} from 'lucide-react';
import {
  ARCHIVE_ITEMS,
  ArchiveItem,
  HERO_IMAGE_PATH,
  HISTORY_TIMELINE,
  VINYL_RECORDS,
  VinylRecord,
} from './data/archives';
import { AnalogTurntableEngine, TurntableState } from './audio/turntableEngine';
import { Language, TRANSLATIONS } from './i18n/translations';
import { ArchiveSearchSection } from './components/ArchiveSearchSection';
import { VirtualMuseum3D } from './components/VirtualMuseum3D';
import { VinylTurntable } from './components/VinylTurntable';
import { TimelineSection } from './components/TimelineSection';
import { GroupBookingSection } from './components/GroupBookingSection';
import { MuseumLocationMap } from './components/MuseumLocationMap';
import { AccessionModal } from './components/AccessionModal';
import { MiniTurntableBar } from './components/MiniTurntableBar';
import { downloadStandaloneHtml } from './utils/exportHtmlArchive';

const INITIAL_TURNTABLE_STATE: TurntableState = {
  isPlaying: false,
  tonearmDropped: false,
  progress: 0,
  currentRpm: VINYL_RECORDS[0].nativeRpm,
  volume: 0.78,
  crackleLevel: 0.42,
  frequencyBars: new Array(12).fill(0.08),
};

export default function App() {
  const [lang, setLang] = useState<Language>('th');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inspectedItem, setInspectedItem] = useState<ArchiveItem | null>(null);
  const [active3DZone, setActive3DZone] = useState<string>('overview');
  const [activeRecord, setActiveRecord] = useState<VinylRecord>(VINYL_RECORDS[0]);
  const [turntableState, setTurntableState] = useState<TurntableState>(INITIAL_TURNTABLE_STATE);
  const [hasInteractedAudio, setHasInteractedAudio] = useState(false);
  const [miniBarDismissed, setMiniBarDismissed] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'done'>('idle');
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  const engineRef = useRef<AnalogTurntableEngine | null>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === 'th'
        ? 'พิพิธภัณฑ์และหอจดหมายเหตุกรมประชาสัมพันธ์'
        : 'PRD Museum & Archives | Public Relations Department of Thailand';
  }, [lang]);

  useEffect(() => {
    const engine = new AnalogTurntableEngine((nextState) => {
      setTurntableState(nextState);
    });
    engine.loadRecord(VINYL_RECORDS[0], false);
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectRecord = useCallback((record: VinylRecord, autoPlay = false) => {
    setActiveRecord(record);
    setMiniBarDismissed(false);
    if (autoPlay) setHasInteractedAudio(true);
    engineRef.current?.loadRecord(record, autoPlay);
  }, []);

  const handlePlayVinylById = useCallback(
    (vinylTrackId: string) => {
      const target = VINYL_RECORDS.find((r) => r.id === vinylTrackId) ?? VINYL_RECORDS[0];
      handleSelectRecord(target, true);
      scrollToSection('turntable');
    },
    [handleSelectRecord, scrollToSection]
  );

  const handleJumpTo3DZone = useCallback(
    (zoneId: string) => {
      setActive3DZone(zoneId);
      scrollToSection('museum-3d');
    },
    [scrollToSection]
  );

  const handleOpenArchiveById = useCallback((archiveId: string) => {
    const found = ARCHIVE_ITEMS.find((item) => item.id === archiveId);
    if (found) setInspectedItem(found);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setHasInteractedAudio(true);
    setMiniBarDismissed(false);
    engineRef.current?.togglePlay();
  }, []);

  const handleToggleCue = useCallback(() => {
    setHasInteractedAudio(true);
    setMiniBarDismissed(false);
    engineRef.current?.toggleTonearmCue();
  }, []);

  const handleSetRpm = useCallback((rpm: 33.33 | 45 | 78) => {
    engineRef.current?.setRpm(rpm);
  }, []);

  const handleSetVolume = useCallback((vol: number) => {
    engineRef.current?.setVolume(vol);
  }, []);

  const handleSetCrackle = useCallback((level: number) => {
    engineRef.current?.setCrackleLevel(level);
  }, []);

  const handleSeek = useCallback((progress: number, dropAndPlay = false) => {
    if (dropAndPlay) {
      setHasInteractedAudio(true);
      setMiniBarDismissed(false);
    }
    engineRef.current?.seekProgress(progress, dropAndPlay);
  }, []);

  const handleShareSite = useCallback(async () => {
    const shareUrl = window.location.origin + window.location.pathname;
    const shareTitle = 'พิพิธภัณฑ์และหอจดหมายเหตุกรมประชาสัมพันธ์';
    const shareText =
      lang === 'th'
        ? 'เข้าชมประวัติศาสตร์ดิจิทัล สืบค้นเอกสารจดหมายเหตุ ชมห้องแสดง 3 มิติ และฟังแผ่นเสียงจริงของกรมประชาสัมพันธ์'
        : 'Explore Thailand’s Public Relations Department Museum & Archives: 3D gallery, historical search, and interactive vinyl turntable.';

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        return;
      } catch {
        // Fallback to clipboard copy if user dismissed or blocked in iframe
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2400);
    } catch {
      // Ignore clipboard failure
    }
  }, [lang]);

  const handleExportHtml = useCallback(async () => {
    if (exportStatus === 'exporting') return;
    setExportStatus('exporting');
    try {
      await downloadStandaloneHtml(lang);
      setExportStatus('done');
      window.setTimeout(() => setExportStatus('idle'), 2600);
    } catch {
      setExportStatus('idle');
    }
  }, [exportStatus, lang]);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#141413]">
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-[#E4E0D8] bg-[#F8F7F4]/95">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <a
            href="#top"
            className="max-w-[240px] truncate font-serif text-base font-semibold tracking-tight text-[#141413] whitespace-nowrap shrink-0 sm:max-w-none sm:text-lg"
          >
            {t.brand}
          </a>

          {/* Zone 2: 5 Clean Single-Line Nav Links */}
          <nav
            aria-label={lang === 'th' ? 'เมนูหลัก' : 'Primary Navigation'}
            className="hidden items-center gap-6 text-sm font-medium text-[#4A4843] lg:flex"
          >
            <a
              href="#search"
              className="hover:text-[#141413] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.search}
            </a>
            <a
              href="#museum-3d"
              className="hover:text-[#141413] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.museum3d}
            </a>
            <a
              href="#turntable"
              className="hover:text-[#141413] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.turntable}
            </a>
            <a
              href="#history"
              className="hover:text-[#141413] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.history}
            </a>
            <a
              href="#booking"
              className="hover:text-[#141413] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.booking}
            </a>
          </nav>

          {/* Zone 3: 1 Primary CTA on Desktop / Mobile Drawer Toggle on Small Viewports */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('booking')}
              className="hidden min-h-[40px] items-center gap-2 rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#1E40AF] whitespace-nowrap shrink-0 lg:inline-flex"
            >
              <span>{t.nav.ctaBooking}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-expanded={mobileMenuOpen}
              aria-label={
                mobileMenuOpen
                  ? lang === 'th'
                    ? 'ปิดเมนูนำทาง'
                    : 'Close navigation menu'
                  : lang === 'th'
                  ? 'เปิดเมนูนำทาง'
                  : 'Open navigation menu'
              }
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#D6D0C4] bg-white text-[#141413] lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Responsive Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label={lang === 'th' ? 'เมนูนำทางมือถือ' : 'Mobile Navigation'}
            className="border-t border-[#E4E0D8] bg-[#FAF9F6] px-4 py-3 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => scrollToSection('search')}
                className="min-h-[44px] rounded-md px-3 text-left text-sm font-medium text-[#141413] hover:bg-[#EFECE5]"
              >
                {t.nav.search}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('museum-3d')}
                className="min-h-[44px] rounded-md px-3 text-left text-sm font-medium text-[#141413] hover:bg-[#EFECE5]"
              >
                {t.nav.museum3d}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('turntable')}
                className="min-h-[44px] rounded-md px-3 text-left text-sm font-medium text-[#141413] hover:bg-[#EFECE5]"
              >
                {t.nav.turntable}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('history')}
                className="min-h-[44px] rounded-md px-3 text-left text-sm font-medium text-[#141413] hover:bg-[#EFECE5]"
              >
                {t.nav.history}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('booking')}
                className="min-h-[44px] rounded-md px-3 text-left text-sm font-medium text-[#1E3A8A] hover:bg-[#EFECE5]"
              >
                {t.nav.booking}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('location')}
                className="min-h-[44px] rounded-md px-3 text-left text-sm font-medium text-[#141413] hover:bg-[#EFECE5]"
              >
                {t.nav.location}
              </button>

              <div className="mt-2 flex items-center justify-between border-t border-[#E4E0D8] pt-3 px-3">
                <span className="text-xs font-medium text-[#57534E]">{t.hero.langLabel}</span>
                <div className="inline-flex rounded-md bg-[#E4E0D8] p-1">
                  <button
                    type="button"
                    onClick={() => setLang('th')}
                    className={`min-h-[34px] rounded px-3 text-xs font-medium ${
                      lang === 'th' ? 'bg-white text-[#141413] shadow-sm' : 'text-[#57534E]'
                    }`}
                  >
                    ไทย
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`min-h-[34px] rounded px-3 text-xs font-medium ${
                      lang === 'en' ? 'bg-white text-[#141413] shadow-sm' : 'text-[#57534E]'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        {/* Institutional Exhibition Marquee Hero */}
        <section className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6 md:pb-16 md:pt-12 lg:px-8">
          {/* Language Switcher Row above Hero Split */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E0D8] pb-4">
            <p className="text-xs font-medium tracking-wider text-[#1E3A8A]">{t.hero.kicker}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportHtml}
                disabled={exportStatus === 'exporting'}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-md border border-[#C8BFB0] bg-white px-3 py-1 text-xs font-medium text-[#141413] transition-colors hover:bg-[#EFECE5] disabled:opacity-60 whitespace-nowrap shrink-0"
              >
                {exportStatus === 'done' ? (
                  <Check className="h-3.5 w-3.5 text-[#14532D]" aria-hidden="true" />
                ) : (
                  <Download className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                )}
                <span>
                  {exportStatus === 'exporting'
                    ? t.footer.exportingHtmlBtn
                    : exportStatus === 'done'
                    ? t.footer.exportedHtmlBtn
                    : t.footer.exportHtmlBtn}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-[#57534E]" aria-hidden="true" />
                <div
                  className="inline-flex rounded-md bg-[#EFECE5] p-0.5"
                  role="group"
                  aria-label={t.hero.langLabel}
                >
                  <button
                    type="button"
                    onClick={() => setLang('th')}
                    className={`min-h-[32px] rounded px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      lang === 'th'
                        ? 'bg-white text-[#141413] shadow-sm'
                        : 'text-[#57534E] hover:text-[#141413]'
                    }`}
                  >
                    ภาษาไทย
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`min-h-[32px] rounded px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      lang === 'en'
                        ? 'bg-white text-[#141413] shadow-sm'
                        : 'text-[#57534E] hover:text-[#141413]'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12">
            {/* Left Editorial Column */}
            <div className="flex flex-col justify-center lg:col-span-6">
              <h1 className="text-balance text-[clamp(2.05rem,3.6vw,3.25rem)] font-semibold leading-[1.18] tracking-tight text-[#141413]">
                {t.hero.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-[1.75] text-[#4A4843] sm:text-lg">
                {t.hero.description}
              </p>

              {/* Hero Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('search')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#1E3A8A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>{t.hero.ctaSearch}</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('museum-3d')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md border border-[#C8BFB0] bg-white px-4 py-2.5 text-sm font-medium text-[#141413] transition-colors hover:bg-[#EFECE5] whitespace-nowrap shrink-0"
                >
                  <Box className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                  <span>{t.hero.cta3d}</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('turntable')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md border border-[#C8BFB0] bg-white px-4 py-2.5 text-sm font-medium text-[#141413] transition-colors hover:bg-[#EFECE5] whitespace-nowrap shrink-0"
                >
                  <Disc3 className="h-4 w-4 text-[#926C2C]" aria-hidden="true" />
                  <span>{t.hero.ctaTurntable}</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('booking')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md border border-[#C8BFB0] bg-white px-4 py-2.5 text-sm font-medium text-[#141413] transition-colors hover:bg-[#EFECE5] whitespace-nowrap shrink-0"
                >
                  <CalendarDays className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                  <span>{t.hero.ctaBooking}</span>
                </button>
              </div>
            </div>

            {/* Right Architectural Visual Frame */}
            <div className="flex flex-col lg:col-span-6">
              <div className="relative flex-1 overflow-hidden rounded-xl border border-[#DDD8CE] bg-[#E5DFD3] min-h-[280px]">
                {!heroImgFailed ? (
                  <img
                    src={HERO_IMAGE_PATH}
                    alt={t.hero.title}
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="h-full w-full object-cover lg:h-full"
                  />
                ) : (
                  <div className="flex h-full min-h-[300px] items-center justify-center bg-gradient-to-br from-[#EBE6DC] to-[#D6CEBE] p-8 text-center">
                    <p className="font-serif text-xl text-[#292524]">{t.hero.title}</p>
                  </div>
                )}
              </div>
              <p className="mt-2.5 font-serif text-xs italic text-[#6B665E]">
                {t.hero.figureCaption}
              </p>
            </div>
          </div>

          {/* Full-Width 4-Column Operational Utility & Collection Strip */}
          <div className="mt-10 grid grid-cols-1 divide-y divide-[#E4E0D8] rounded-xl border border-[#E4E0D8] bg-white sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
            <div className="p-5">
              <p className="text-xs text-[#6B665E]">{t.utilityStrip.hoursLabel}</p>
              <p className="mt-1 text-base font-semibold tabular-nums text-[#141413]">
                {t.utilityStrip.hoursValue}
              </p>
              <p className="mt-0.5 text-xs text-[#57534E]">{t.utilityStrip.hoursSub}</p>
            </div>

            <div className="p-5">
              <p className="text-xs text-[#6B665E]">{t.utilityStrip.archiveLabel}</p>
              <p className="mt-1 text-base font-semibold tabular-nums text-[#141413]">
                {t.utilityStrip.archiveValue(ARCHIVE_ITEMS.length)}
              </p>
              <p className="mt-0.5 text-xs text-[#57534E]">{t.utilityStrip.archiveSub}</p>
            </div>

            <div className="p-5">
              <p className="text-xs text-[#6B665E]">{t.utilityStrip.virtualLabel}</p>
              <p className="mt-1 text-base font-semibold tabular-nums text-[#141413]">
                {t.utilityStrip.virtualValue}
              </p>
              <p className="mt-0.5 text-xs text-[#57534E]">{t.utilityStrip.virtualSub}</p>
            </div>

            <div className="p-5">
              <p className="text-xs text-[#6B665E]">{t.utilityStrip.vinylLabel}</p>
              <p className="mt-1 text-base font-semibold tabular-nums text-[#141413]">
                {t.utilityStrip.vinylValue(VINYL_RECORDS.length)}
              </p>
              <p className="mt-0.5 text-xs text-[#57534E]">{t.utilityStrip.vinylSub}</p>
            </div>
          </div>
        </section>

        {/* Archive Search & Catalog Section */}
        <ArchiveSearchSection
          lang={lang}
          items={ARCHIVE_ITEMS}
          onInspectItem={(item) => setInspectedItem(item)}
          onPlayVinyl={handlePlayVinylById}
          onJumpTo3DZone={handleJumpTo3DZone}
        />

        {/* Interactive 3D Virtual Museum Hall */}
        <VirtualMuseum3D
          lang={lang}
          activeZoneId={active3DZone}
          isAudioPlaying={turntableState.isPlaying}
          onSelectZone={(zoneId) => setActive3DZone(zoneId)}
          onOpenArchiveItem={handleOpenArchiveById}
          onPlayVinyl={handlePlayVinylById}
        />

        {/* Authentic Interactive Vinyl Turntable */}
        <VinylTurntable
          lang={lang}
          records={VINYL_RECORDS}
          activeRecord={activeRecord}
          turntableState={turntableState}
          onSelectRecord={handleSelectRecord}
          onTogglePlay={handleTogglePlay}
          onToggleCue={handleToggleCue}
          onSetRpm={handleSetRpm}
          onSetVolume={handleSetVolume}
          onSetCrackle={handleSetCrackle}
          onSeek={handleSeek}
        />

        {/* Digital History Timeline */}
        <TimelineSection
          lang={lang}
          chapters={HISTORY_TIMELINE}
          onOpenArtifact={handleOpenArchiveById}
        />

        {/* Advance Group Visit Booking & Visitor Schedule */}
        <GroupBookingSection lang={lang} />

        {/* Ari Samphan Physical Museum Premises Map */}
        <MuseumLocationMap lang={lang} />
      </main>

      {/* Clean Institutional Footer */}
      <footer className="border-t border-[#E4E0D8] bg-[#EFECE5] py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="font-serif text-lg font-semibold text-[#141413]">{t.footer.title}</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#4A4843]">
                {t.footer.address}
              </p>
              <p className="mt-1 text-xs text-[#57534E]">{t.footer.hours}</p>
            </div>

            <div className="flex flex-col gap-4 md:col-span-6 md:items-end">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4A4843]">
                <a href="#search" className="hover:text-[#141413]">
                  {t.nav.search}
                </a>
                <a href="#museum-3d" className="hover:text-[#141413]">
                  {t.nav.museum3d}
                </a>
                <a href="#turntable" className="hover:text-[#141413]">
                  {t.nav.turntable}
                </a>
                <a href="#history" className="hover:text-[#141413]">
                  {t.nav.history}
                </a>
                <a href="#booking" className="hover:text-[#141413]">
                  {t.nav.booking}
                </a>
                <a href="#location" className="hover:text-[#141413]">
                  {t.nav.location}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportHtml}
                  disabled={exportStatus === 'exporting'}
                  className="inline-flex min-h-[38px] items-center gap-2 rounded-md border border-[#C8BFB0] bg-white px-3.5 py-1.5 text-xs font-medium text-[#141413] transition-colors hover:bg-[#FAF9F6] disabled:opacity-60 whitespace-nowrap shrink-0"
                >
                  {exportStatus === 'done' ? (
                    <Check className="h-3.5 w-3.5 text-[#14532D]" aria-hidden="true" />
                  ) : (
                    <Download className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                  )}
                  <span>
                    {exportStatus === 'exporting'
                      ? t.footer.exportingHtmlBtn
                      : exportStatus === 'done'
                      ? t.footer.exportedHtmlBtn
                      : t.footer.exportHtmlBtn}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleShareSite}
                  className="inline-flex min-h-[38px] items-center gap-2 rounded-md border border-[#C8BFB0] bg-white px-3.5 py-1.5 text-xs font-medium text-[#141413] transition-colors hover:bg-[#FAF9F6] whitespace-nowrap shrink-0"
                >
                  {linkCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#14532D]" aria-hidden="true" />
                      <span>{t.footer.copiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                      <span>{t.footer.shareBtn}</span>
                    </>
                  )}
                </button>

                <div className="inline-flex items-center gap-1 rounded-md bg-[#E4E0D8] p-1">
                  <button
                    type="button"
                    onClick={() => setLang('th')}
                    className={`min-h-[32px] rounded px-3 text-xs font-medium ${
                      lang === 'th' ? 'bg-white text-[#141413] shadow-sm' : 'text-[#57534E]'
                    }`}
                  >
                    ภาษาไทย
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`min-h-[32px] rounded px-3 text-xs font-medium ${
                      lang === 'en' ? 'bg-white text-[#141413] shadow-sm' : 'text-[#57534E]'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#DCD7CD] pt-6 text-xs text-[#6B665E]">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>

      {/* Museum Accession Detail Modal */}
      <AccessionModal
        lang={lang}
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
        onPlayVinyl={handlePlayVinylById}
        onJumpTo3DZone={handleJumpTo3DZone}
      />

      {/* Persistent Compact Mini Turntable Bar */}
      <MiniTurntableBar
        lang={lang}
        visible={hasInteractedAudio && !miniBarDismissed}
        record={activeRecord}
        isPlaying={turntableState.isPlaying}
        progress={turntableState.progress}
        onTogglePlay={handleTogglePlay}
        onJumpToTurntable={() => scrollToSection('turntable')}
        onDismiss={() => setMiniBarDismissed(true)}
      />
    </div>
  );
}
