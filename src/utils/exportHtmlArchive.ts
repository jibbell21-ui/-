import {
  ARCHIVE_ITEMS,
  ArchiveItem,
  HERO_IMAGE_PATH,
  HISTORY_TIMELINE,
  VINYL_RECORDS,
  formatYear,
} from '../data/archives';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { TOUR_SLOTS } from '../components/GroupBookingSection';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeScriptJson(value: unknown): string {
  // Prevent premature </script> termination inside inline <script>
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

async function compressImageToDataUrl(
  path: string,
  maxWidth: number,
  quality: number
): Promise<string | null> {
  try {
    const response = await fetch(path);
    if (!response.ok) return null;
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Image load failed'));
        el.src = objectUrl;
      });

      const scale = img.naturalWidth > maxWidth ? maxWidth / img.naturalWidth : 1;
      const targetW = Math.max(1, Math.round(img.naturalWidth * scale));
      const targetH = Math.max(1, Math.round(img.naturalHeight * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.drawImage(img, 0, 0, targetW, targetH);
      return canvas.toDataURL('image/jpeg', quality);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

const MAX_BYTES = 9.5 * 1024 * 1024; // Guarantee strictly under 10 MB

function buildHtmlDocument(
  lang: Language,
  imageMap: Record<string, string>
): string {
  const t = TRANSLATIONS[lang];
  const categories = Array.from(
    new Set(ARCHIVE_ITEMS.map((item) => (lang === 'th' ? item.category : item.categoryEn)))
  );

  // Assign short keys (img0, img1...) so base64 payloads are stored once in IMAGES map
  const pathToKey: Record<string, string> = {};
  const keyedImages: Record<string, string> = {};
  Object.keys(imageMap).forEach((path, idx) => {
    const key = `img${idx}`;
    pathToKey[path] = key;
    keyedImages[key] = imageMap[path];
  });

  const renderArchiveCard = (item: ArchiveItem) => {
    const title = lang === 'th' ? item.title : item.titleEn;
    const subtitle = lang === 'th' ? item.subtitle : item.subtitleEn;
    const category = lang === 'th' ? item.category : item.categoryEn;
    const summary = lang === 'th' ? item.summary : item.summaryEn;
    const transcription = lang === 'th' ? item.transcription : item.transcriptionEn;
    const creator = lang === 'th' ? item.creator : item.creatorEn;
    const provenance = lang === 'th' ? item.provenance : item.provenanceEn;
    const yearLabel = formatYear(item.yearBE, lang);
    const imgKey = pathToKey[item.imagePath];

    const searchBlob = [
      item.accessionNumber,
      item.title,
      item.titleEn,
      item.subtitle,
      item.subtitleEn,
      item.category,
      item.categoryEn,
      item.summary,
      item.summaryEn,
      String(item.yearBE),
      ...item.keywords,
    ]
      .join(' ')
      .toLowerCase();

    return `
      <article class="card archive-card" data-category="${escapeHtml(category)}" data-search="${escapeHtml(searchBlob)}">
        ${
          imgKey
            ? `<div class="card-media"><img data-img-key="${escapeHtml(imgKey)}" alt="${escapeHtml(title)}" /></div>`
            : ''
        }
        <div class="card-body">
          <div class="meta-line">
            <span>${escapeHtml(item.accessionNumber)}</span>
            <span>&middot;</span>
            <span>${escapeHtml(yearLabel)}</span>
            <span>&middot;</span>
            <span>${escapeHtml(category)}</span>
          </div>
          <h3>${escapeHtml(title)}</h3>
          <p class="subtitle">${escapeHtml(subtitle)}</p>
          <p class="summary">${escapeHtml(summary)}</p>
          <blockquote>${escapeHtml(transcription)}</blockquote>
          <dl class="specs">
            <div><dt>${escapeHtml(t.modal.creator)}</dt><dd>${escapeHtml(creator)}</dd></div>
            <div><dt>${escapeHtml(t.modal.provenance)}</dt><dd>${escapeHtml(provenance)}</dd></div>
          </dl>
        </div>
      </article>
    `;
  };

  const renderVinylRows = () =>
    VINYL_RECORDS.map((rec) => {
      const title = lang === 'th' ? rec.title : rec.titleEn;
      const ensemble = lang === 'th' ? rec.ensemble : rec.ensembleEn;
      const note = lang === 'th' ? rec.trackNote : rec.trackNoteEn;
      const discType = lang === 'th' ? rec.discType : rec.discTypeEn;
      const mins = Math.floor(rec.durationSeconds / 60);
      const secs = String(rec.durationSeconds % 60).padStart(2, '0');

      return `
        <div class="vinyl-item">
          <div class="vinyl-info">
            <div class="meta-line">
              <span>${escapeHtml(rec.catalogNo)}</span>
              <span>&middot;</span>
              <span>${escapeHtml(formatYear(rec.yearBE, lang))}</span>
              <span>&middot;</span>
              <span>${rec.nativeRpm} RPM</span>
              <span>&middot;</span>
              <span>${escapeHtml(discType)}</span>
              <span>&middot;</span>
              <span>${mins}:${secs}</span>
            </div>
            <h3>${escapeHtml(title)}</h3>
            <p class="subtitle">${escapeHtml(ensemble)}</p>
            <p class="summary">${escapeHtml(note)}</p>
          </div>
          <button type="button" class="btn-secondary play-preview-btn" data-pattern="${escapeHtml(rec.patternId)}" data-title="${escapeHtml(title)}">
            ${lang === 'th' ? 'ฟังตัวอย่างเสียง' : 'Play Audio Preview'}
          </button>
        </div>
      `;
    }).join('');

  const renderTimeline = () =>
    HISTORY_TIMELINE.map((ch) => {
      const years = lang === 'th' ? ch.yearRange : ch.yearRangeEn;
      const title = lang === 'th' ? ch.title : ch.titleEn;
      const subtitle = lang === 'th' ? ch.subtitle : ch.subtitleEn;
      const narrative = lang === 'th' ? ch.narrative : ch.narrativeEn;
      return `
        <div class="timeline-row">
          <div class="timeline-years">${escapeHtml(ch.index)} &middot; ${escapeHtml(years)}</div>
          <div class="timeline-content">
            <h3>${escapeHtml(title)}</h3>
            <p class="subtitle">${escapeHtml(subtitle)}</p>
            <p class="summary">${escapeHtml(narrative)}</p>
          </div>
        </div>
      `;
    }).join('');

  const renderSlots = () =>
    TOUR_SLOTS.map((slot) => {
      const label = lang === 'th' ? slot.labelTh : slot.labelEn;
      return `<li><strong>${escapeHtml(label)}</strong> &mdash; ${
        lang === 'th' ? `รองรับสูงสุด ${slot.maxCapacity} ท่าน` : `Up to ${slot.maxCapacity} guests`
      }</li>`;
    }).join('');

  const heroKey = pathToKey[HERO_IMAGE_PATH];
  const exportedDate = new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(t.brand)}</title>
  <style>
    :root {
      --bg: #F8F7F4;
      --surface: #FFFFFF;
      --surface-alt: #EFECE5;
      --ink: #141413;
      --muted: #4A4843;
      --subtle: #6B665E;
      --border: #DDD8CE;
      --navy: #1E3A8A;
      --brass: #926C2C;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Thai", "IBM Plex Sans Thai", sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.65;
    }
    .container {
      max-width: 1120px;
      margin: 0 auto;
      padding: 0 20px;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 18px 0;
      position: sticky;
      top: 0;
      z-index: 20;
    }
    .header-inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .brand {
      font-family: Georgia, "Noto Serif Thai", serif;
      font-size: 1.15rem;
      font-weight: 700;
    }
    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 0.875rem;
    }
    nav a {
      color: var(--muted);
      text-decoration: none;
    }
    nav a:hover { color: var(--navy); text-decoration: underline; }
    .hero {
      padding: 44px 0 36px;
      border-bottom: 1px solid var(--border);
    }
    .kicker {
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: var(--navy);
      margin: 0 0 8px;
    }
    h1 {
      font-family: Georgia, "Noto Serif Thai", serif;
      font-size: clamp(1.75rem, 3.2vw, 2.75rem);
      line-height: 1.2;
      margin: 0 0 14px;
    }
    h2 {
      font-family: Georgia, "Noto Serif Thai", serif;
      font-size: 1.6rem;
      margin: 0 0 10px;
    }
    h3 {
      margin: 6px 0;
      font-size: 1.05rem;
      line-height: 1.4;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
      gap: 28px;
      align-items: center;
    }
    .hero-img {
      width: 100%;
      border-radius: 12px;
      border: 1px solid var(--border);
      display: block;
      max-height: 360px;
      object-fit: cover;
    }
    section {
      padding: 44px 0;
      border-bottom: 1px solid var(--border);
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 20px 0 24px;
      align-items: center;
    }
    .search-input {
      flex: 1 1 260px;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.92rem;
      background: var(--surface);
      color: var(--ink);
    }
    .filter-btn {
      padding: 8px 13px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--muted);
      font-size: 0.82rem;
      cursor: pointer;
    }
    .filter-btn.active {
      background: var(--navy);
      color: #fff;
      border-color: var(--navy);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 20px;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card-media img {
      width: 100%;
      height: 190px;
      object-fit: cover;
      display: block;
      border-bottom: 1px solid var(--border);
    }
    .card-body {
      padding: 18px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .meta-line {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.76rem;
      color: var(--brass);
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .subtitle {
      margin: 0 0 8px;
      font-size: 0.88rem;
      color: var(--subtle);
    }
    .summary {
      margin: 0 0 12px;
      font-size: 0.9rem;
      color: var(--muted);
    }
    blockquote {
      margin: 0 0 12px;
      padding: 10px 12px;
      background: var(--bg);
      border-left: 3px solid var(--navy);
      font-family: Georgia, "Noto Serif Thai", serif;
      font-size: 0.85rem;
      color: var(--ink);
    }
    .specs {
      margin: auto 0 0;
      padding-top: 10px;
      border-top: 1px solid #ECE8E0;
      font-size: 0.78rem;
      display: grid;
      gap: 6px;
    }
    .specs dt { color: var(--subtle); font-weight: 600; }
    .specs dd { margin: 0; color: var(--ink); }
    .vinyl-list {
      display: grid;
      gap: 14px;
      margin-top: 20px;
    }
    .vinyl-item {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .vinyl-info { flex: 1 1 320px; }
    .btn-secondary {
      padding: 9px 14px;
      border-radius: 8px;
      border: 1px solid var(--navy);
      background: var(--surface);
      color: var(--navy);
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-secondary.playing {
      background: var(--navy);
      color: #fff;
    }
    .timeline-row {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 20px;
      padding: 18px 0;
      border-bottom: 1px solid var(--border);
    }
    .timeline-years {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--navy);
    }
    @media (max-width: 700px) {
      .timeline-row { grid-template-columns: 1fr; gap: 6px; }
    }
    .visit-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 22px;
    }
    footer {
      background: var(--surface-alt);
      padding: 30px 0;
      font-size: 0.85rem;
      color: var(--muted);
    }
    .btn-link {
      display: inline-block;
      margin-top: 10px;
      padding: 9px 15px;
      background: var(--navy);
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <header>
    <div class="container header-inner">
      <div class="brand">${escapeHtml(t.brand)}</div>
      <nav>
        <a href="#archives">${escapeHtml(t.nav.search)}</a>
        <a href="#vinyl">${escapeHtml(t.nav.turntable)}</a>
        <a href="#history">${escapeHtml(t.nav.history)}</a>
        <a href="#visit">${escapeHtml(t.nav.location)}</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <div class="hero">
      <div class="hero-grid">
        <div>
          <p class="kicker">${escapeHtml(t.hero.kicker)}</p>
          <h1>${escapeHtml(t.hero.title)}</h1>
          <p>${escapeHtml(t.hero.description)}</p>
          <p style="font-size:0.82rem;color:var(--subtle);">
            ${lang === 'th' ? 'ฉบับบันทึกออฟไลน์ (HTML) · สร้างเมื่อ' : 'Offline HTML Edition · Generated on'} ${escapeHtml(exportedDate)}
          </p>
        </div>
        ${heroKey ? `<img class="hero-img" data-img-key="${escapeHtml(heroKey)}" alt="${escapeHtml(t.hero.title)}" />` : ''}
      </div>
    </div>

    <section id="archives">
      <p class="kicker">${escapeHtml(t.search.kicker)}</p>
      <h2>${escapeHtml(t.search.heading)}</h2>
      <p style="color:var(--muted);">${escapeHtml(t.search.subheading)}</p>

      <div class="toolbar">
        <input id="archive-search" class="search-input" type="search" placeholder="${escapeHtml(t.search.placeholder)}" />
        <button type="button" class="filter-btn active" data-filter="ALL">${escapeHtml(t.search.allCategories)}</button>
        ${categories
          .map(
            (cat) =>
              `<button type="button" class="filter-btn" data-filter="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`
          )
          .join('')}
      </div>

      <p id="result-count" style="font-size:0.84rem;color:var(--subtle);margin-bottom:14px;"></p>

      <div class="grid" id="archive-grid">
        ${ARCHIVE_ITEMS.map(renderArchiveCard).join('')}
      </div>
    </section>

    <section id="vinyl">
      <p class="kicker">${escapeHtml(t.turntable.kicker)}</p>
      <h2>${escapeHtml(t.turntable.heading)}</h2>
      <p style="color:var(--muted);">${escapeHtml(t.turntable.subheading)}</p>
      <div class="vinyl-list">
        ${renderVinylRows()}
      </div>
    </section>

    <section id="history">
      <p class="kicker">${escapeHtml(t.timeline.kicker)}</p>
      <h2>${escapeHtml(t.timeline.heading)}</h2>
      <div>
        ${renderTimeline()}
      </div>
    </section>

    <section id="visit" style="border-bottom:none;">
      <p class="kicker">${escapeHtml(t.booking.kicker)}</p>
      <h2>${escapeHtml(t.footer.title)}</h2>
      <div class="visit-box">
        <p><strong>${lang === 'th' ? 'ที่ตั้ง:' : 'Address:'}</strong> ${escapeHtml(t.footer.address)}</p>
        <p><strong>${lang === 'th' ? 'เวลาเปิดทำการ:' : 'Opening Hours:'}</strong> ${escapeHtml(t.footer.hours)}</p>
        <p><strong>${escapeHtml(t.booking.scheduleTitle)}:</strong></p>
        <ul>${renderSlots()}</ul>
        <a class="btn-link" href="https://www.google.com/maps/search/?api=1&query=Public+Relations+Department+Soi+Ari+Samphan+Bangkok" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(t.location.openMapsBtn)}
        </a>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <p style="margin:0 0 6px;font-weight:600;color:var(--ink);">${escapeHtml(t.footer.title)}</p>
      <p style="margin:0;">${escapeHtml(t.footer.copyright)}</p>
    </div>
  </footer>

  <script>
    (function () {
      var IMAGES = ${escapeScriptJson(keyedImages)};
      document.querySelectorAll('img[data-img-key]').forEach(function (img) {
        var key = img.getAttribute('data-img-key');
        if (key && IMAGES[key]) {
          img.setAttribute('src', IMAGES[key]);
        }
      });

      var searchInput = document.getElementById('archive-search');
      var cards = Array.prototype.slice.call(document.querySelectorAll('.archive-card'));
      var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
      var countEl = document.getElementById('result-count');
      var activeCat = 'ALL';

      function updateFilter() {
        var q = (searchInput.value || '').trim().toLowerCase();
        var shown = 0;
        cards.forEach(function (card) {
          var cat = card.getAttribute('data-category');
          var hay = card.getAttribute('data-search') || '';
          var matchCat = activeCat === 'ALL' || cat === activeCat;
          var matchText = !q || hay.indexOf(q) !== -1;
          if (matchCat && matchText) {
            card.classList.remove('hidden');
            shown++;
          } else {
            card.classList.add('hidden');
          }
        });
        countEl.textContent = shown + ' / ' + cards.length;
      }

      searchInput.addEventListener('input', updateFilter);
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeCat = btn.getAttribute('data-filter') || 'ALL';
          filterBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          updateFilter();
        });
      });
      updateFilter();

      // Lightweight offline Web Audio API preview for vinyl records
      var ctx = null;
      var stopTimer = null;
      var currentOscs = [];
      var activeBtn = null;

      function stopPreview() {
        if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
        currentOscs.forEach(function (o) { try { o.stop(); } catch (e) {} });
        currentOscs = [];
        if (activeBtn) {
          activeBtn.classList.remove('playing');
          activeBtn.textContent = '${lang === 'th' ? 'ฟังตัวอย่างเสียง' : 'Play Audio Preview'}';
          activeBtn = null;
        }
      }

      var patterns = {
        hsp_radio_2482: [523.25, 659.25, 783.99, 659.25, 1046.5],
        chao_phraya_2495: [293.66, 329.63, 392.0, 440.0, 523.25],
        tv4_chime_2498: [392.0, 493.88, 587.33, 783.99],
        klui_archive_2510: [440.0, 523.25, 587.33, 659.25, 783.99],
        synth_pop_2528: [261.63, 329.63, 392.0, 493.88, 523.25, 392.0]
      };

      document.querySelectorAll('.play-preview-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (activeBtn === btn) {
            stopPreview();
            return;
          }
          stopPreview();
          var AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!ctx) ctx = new AudioCtx();
          if (ctx.state === 'suspended') ctx.resume();

          var pattern = patterns[btn.getAttribute('data-pattern')] || patterns.hsp_radio_2482;
          var now = ctx.currentTime;
          var master = ctx.createGain();
          master.gain.setValueAtTime(0.14, now);
          master.connect(ctx.destination);

          pattern.forEach(function (freq, idx) {
            var osc = ctx.createOscillator();
            var g = ctx.createGain();
            osc.type = btn.getAttribute('data-pattern') === 'synth_pop_2528' ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.36);
            g.gain.setValueAtTime(0.001, now + idx * 0.36);
            g.gain.exponentialRampToValueAtTime(0.45, now + idx * 0.36 + 0.04);
            g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.36 + 0.34);
            osc.connect(g);
            g.connect(master);
            osc.start(now + idx * 0.36);
            osc.stop(now + idx * 0.36 + 0.35);
            currentOscs.push(osc);
          });

          activeBtn = btn;
          btn.classList.add('playing');
          btn.textContent = '${lang === 'th' ? 'หยุดตัวอย่าง' : 'Stop Preview'}';
          stopTimer = setTimeout(stopPreview, pattern.length * 360 + 150);
        });
      });
    })();
  </script>
</body>
</html>`;
}

export async function downloadStandaloneHtml(lang: Language): Promise<void> {
  const uniquePaths = Array.from(
    new Set([HERO_IMAGE_PATH, ...ARCHIVE_ITEMS.map((item) => item.imagePath)])
  );

  // Compress images (max 900px width, 72% JPEG) to keep total HTML file well under 1 MB (< 10 MB limit)
  const resolvedPairs = await Promise.all(
    uniquePaths.map(async (p) => [p, await compressImageToDataUrl(p, 900, 0.72)] as const)
  );
  const imageMap: Record<string, string> = {};
  resolvedPairs.forEach(([path, dataUrl]) => {
    if (dataUrl) {
      imageMap[path] = dataUrl;
    }
  });

  let htmlContent = buildHtmlDocument(lang, imageMap);
  let blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });

  // Safety guard: if somehow still above 9.5 MB, re-compress aggressively or drop inline images
  if (blob.size > MAX_BYTES) {
    const compactPairs = await Promise.all(
      uniquePaths.map(async (p) => [p, await compressImageToDataUrl(p, 540, 0.55)] as const)
    );
    const compactMap: Record<string, string> = {};
    compactPairs.forEach(([path, dataUrl]) => {
      if (dataUrl) compactMap[path] = dataUrl;
    });
    htmlContent = buildHtmlDocument(lang, compactMap);
    blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });

    if (blob.size > MAX_BYTES) {
      htmlContent = buildHtmlDocument(lang, {});
      blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download =
    lang === 'th'
      ? 'พิพิธภัณฑ์และหอจดหมายเหตุกรมประชาสัมพันธ์.html'
      : 'prd-museum-archives.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
