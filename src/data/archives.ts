import { Language } from '../i18n/translations';

export type ArchiveCategory =
  | 'เอกสารจดหมายเหตุ'
  | 'สื่อวิทยุและโทรทัศน์'
  | 'ภาพถ่ายประวัติศาสตร์'
  | 'แผ่นเสียงต้นฉบับ';

export type ArchiveEra =
  | 'พ.ศ. 2476–2490'
  | 'พ.ศ. 2491–2510'
  | 'พ.ศ. 2511–2535'
  | 'พ.ศ. 2536–ปัจจุบัน';

export interface ArchiveItem {
  id: string;
  accessionNumber: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  category: ArchiveCategory;
  categoryEn: string;
  era: ArchiveEra;
  eraEn: string;
  yearBE: number;
  creator: string;
  creatorEn: string;
  medium: string;
  mediumEn: string;
  dimensions: string;
  dimensionsEn: string;
  provenance: string;
  provenanceEn: string;
  locationInMuseum: string;
  locationInMuseumEn: string;
  summary: string;
  summaryEn: string;
  transcription: string;
  transcriptionEn: string;
  imagePath: string;
  vinylTrackId?: string;
  exhibitZoneId?: string;
  keywords: string[];
}

export interface VinylRecord {
  id: string;
  catalogNo: string;
  title: string;
  titleEn: string;
  ensemble: string;
  ensembleEn: string;
  yearBE: number;
  nativeRpm: 33.33 | 45 | 78;
  durationSeconds: number;
  labelColor: string;
  labelAccent: string;
  discType: 'แผ่นครั่ง 10 นิ้ว' | 'แผ่นไวนิล LP 12 นิ้ว' | 'แผ่นซิงเกิล 7 นิ้ว';
  discTypeEn: string;
  provenance: string;
  provenanceEn: string;
  description: string;
  descriptionEn: string;
  trackNote: string;
  trackNoteEn: string;
  patternId:
    | 'hsp_radio_2482'
    | 'chao_phraya_2495'
    | 'tv4_chime_2498'
    | 'klui_archive_2510'
    | 'synth_pop_2528';
}

export interface TimelineChapter {
  index: string;
  yearRange: string;
  yearRangeEn: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  narrative: string;
  narrativeEn: string;
  milestoneArtifactId: string;
}

export const HERO_IMAGE_PATH =
  '/src/assets/images/hero_prd_archive_hall_1794931819301.jpg';

export const CATEGORY_LABELS: Record<ArchiveCategory, { th: string; en: string }> = {
  'เอกสารจดหมายเหตุ': { th: 'เอกสารจดหมายเหตุ', en: 'Archival Documents' },
  'สื่อวิทยุและโทรทัศน์': { th: 'สื่อวิทยุและโทรทัศน์', en: 'Radio & Television' },
  'ภาพถ่ายประวัติศาสตร์': { th: 'ภาพถ่ายประวัติศาสตร์', en: 'Historic Photography' },
  'แผ่นเสียงต้นฉบับ': { th: 'แผ่นเสียงต้นฉบับ', en: 'Original Vinyl & Shellac' },
};

export const ERA_LABELS: Record<ArchiveEra, { th: string; en: string }> = {
  'พ.ศ. 2476–2490': { th: 'พ.ศ. 2476–2490', en: '1933–1947 (B.E. 2476–2490)' },
  'พ.ศ. 2491–2510': { th: 'พ.ศ. 2491–2510', en: '1948–1967 (B.E. 2491–2510)' },
  'พ.ศ. 2511–2535': { th: 'พ.ศ. 2511–2535', en: '1968–1992 (B.E. 2511–2535)' },
  'พ.ศ. 2536–ปัจจุบัน': { th: 'พ.ศ. 2536–ปัจจุบัน', en: '1993–Present (B.E. 2536–Now)' },
};

export function formatYear(yearBE: number, lang: Language): string {
  return lang === 'th' ? `พ.ศ. ${yearBE}` : `${yearBE - 543} (B.E. ${yearBE})`;
}

export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: 'arc-2476-founding',
    accessionNumber: 'PRD-DOC-2476-001',
    title: 'ประกาศสำนักนายกรัฐมนตรี ว่าด้วยการตั้งสำนักงานโฆษณาการและการกระจายเสียง',
    titleEn: 'Office of the Prime Minister Proclamation Establishing the Publicity Bureau',
    subtitle: 'ปฐมบทแห่งกิจการประชาสัมพันธ์ภาครัฐและวิทยุกระจายเสียงไทย',
    subtitleEn: 'Foundational charter of Thai public communication and national radio',
    category: 'เอกสารจดหมายเหตุ',
    categoryEn: 'Archival Documents',
    era: 'พ.ศ. 2476–2490',
    eraEn: '1933–1947 (B.E. 2476–2490)',
    yearBE: 2476,
    creator: 'สำนักนายกรัฐมนตรี / กองโฆษณาการ',
    creatorEn: 'Office of the Prime Minister / Publicity Division',
    medium: 'เอกสารพิมพ์ดีดบนกระดาษสาเนื้อละเอียด ประทับตราหมึกคราม',
    mediumEn: 'Typewritten rag paper manuscript with indigo official ink seal',
    dimensions: '21.5 × 33.0 ซม.',
    dimensionsEn: '21.5 × 33.0 cm',
    provenance: 'คลังเอกสารต้นฉบับ กรมประชาสัมพันธ์ ซอยอารีย์สัมพันธ์',
    provenanceEn: 'PRD Central Manuscript Vault, Soi Ari Samphan, Bangkok',
    locationInMuseum: 'โถงจัดแสดง 1 · ตู้กระจกจดหมายเหตุชุดที่ 1',
    locationInMuseumEn: 'Gallery Hall 1 · Archival Vitrine Case 01',
    summary:
      'เอกสารราชการยุคแรกเริ่มที่วางรากฐานการจัดตั้งสำนักงานโฆษณาการเมื่อวันที่ 3 พฤษภาคม พ.ศ. 2476 เพื่อสื่อสารนโยบายรัฐ ข้อราชการ และความรู้สู่ประชาชนอย่างเป็นระบบ',
    summaryEn:
      'Original state decree issued on 3 May 1933 (B.E. 2476) establishing the Publicity Bureau—the precursor to the Public Relations Department—to systematically broadcast civic knowledge and public announcements.',
    transcription:
      '“ด้วยคณะรัฐมนตรีเห็นสมควรจัดตั้งหน่วยงานกลางสำหรับแถลงการณ์ข่าวสารราชการ และอำนวยการกระจายเสียงวิทยุแห่งรัฐ ให้ประชาชนทุกมณฑลได้รับทราบข้อเท็จจริงโดยทั่วถึงกัน...”',
    transcriptionEn:
      '“Whereas the Cabinet deems it expedient to establish a central agency for official state bulletins and national radio broadcasting so citizens across every province receive accurate civic information...”',
    imagePath: '/src/assets/images/archive_doc_proclamation_1794931819985.jpg',
    exhibitZoneId: 'vitrine',
    keywords: ['2476', '1933', 'สำนักงานโฆษณาการ', 'ประกาศ', 'วิทยุแห่งชาติ', 'proclamation', 'founding'],
  },
  {
    id: 'arc-2483-microphone',
    accessionNumber: 'PRD-OBJ-2483-014',
    title: 'ไมโครโฟนริบบอนห้องส่งพญาไทและเครื่องส่งคลื่นกลางยุคบุกเบิก',
    titleEn: 'Phaya Thai Broadcast Studio Ribbon Microphone & Medium-Wave Transmitter',
    subtitle: 'อุปกรณ์กระจายเสียงหลักของสถานีวิทยุกระจายเสียงแห่งประเทศไทย',
    subtitleEn: 'Primary studio microphone of Radio Thailand’s pioneer broadcast era',
    category: 'สื่อวิทยุและโทรทัศน์',
    categoryEn: 'Radio & Television',
    era: 'พ.ศ. 2476–2490',
    eraEn: '1933–1947 (B.E. 2476–2490)',
    yearBE: 2483,
    creator: 'กองช่างวิทยุ กรมโฆษณาการ',
    creatorEn: 'Radio Engineering Division, Department of Publicity',
    medium: 'โลหะทองเหลืองชุบโครเมียม แม่เหล็กถาวร และฐานเหล็กหล่อ',
    mediumEn: 'Chrome-plated brass housing, permanent magnet assembly, cast-iron base',
    dimensions: '18.0 × 18.0 × 44.5 ซม.',
    dimensionsEn: '18.0 × 18.0 × 44.5 cm',
    provenance: 'ห้องส่งอาคารกรมโฆษณาการ ราชดำเนินกลาง',
    provenanceEn: 'Ratchadamnoen Klang Studio, Department of Publicity',
    locationInMuseum: 'โถงกลาง · แท่นจัดแสดงวิทยุกระจายเสียงยุคแรก',
    locationInMuseumEn: 'Central Atrium · Early Radio Broadcasting Pedestal',
    summary:
      'ไมโครโฟนริบบอนความไวสูงที่ใช้บันทึกและถ่ายทอดเสียงอ่านข่าวภาคค่ำ ปาฐกถาสำคัญ และการแสดงดนตรีสดจากห้องส่งกระจายเสียงแห่งแรกของประเทศ',
    summaryEn:
      'High-sensitivity velocity ribbon microphone used in Bangkok’s earliest national broadcasting studios for evening news bulletins, royal addresses, and live orchestral performances.',
    transcription:
      'บันทึกประจำเครื่อง: ปรับจูนความถี่พาหะ 825 กิโลไซเคิล ตรวจสอบหลอดสุญญากาศภาคขยายก่อนออกอากาศเวลา 19:00 น. ทุกวัน',
    transcriptionEn:
      'Engineer Logbook: Tuned to 825 kc carrier frequency; inspect vacuum tube amplifier stage daily prior to the 19:00 national bulletin.',
    imagePath: '/src/assets/images/archive_radio_studio_1794931820853.jpg',
    exhibitZoneId: 'radio',
    keywords: ['ไมโครโฟน', 'microphone', 'วิทยุกระจายเสียง', 'radio', 'ราชดำเนิน', '2483', '1940'],
  },
  {
    id: 'arc-2482-shellac',
    accessionNumber: 'PRD-REC-2482-003',
    title: 'แผ่นเสียงครั่ง 78 รอบ: สัญญาณเทียบเวลาและบทเพลงเปิดสถานีวิทยุแห่งชาติ',
    titleEn: '78 RPM Shellac Disc: National Radio Time Pips & Station Opening Fanfare (HSP)',
    subtitle: 'ต้นฉบับเสียงบันทึกประวัติศาสตร์ พ.ศ. 2482',
    subtitleEn: 'Original 1939 broadcast interval recording',
    category: 'แผ่นเสียงต้นฉบับ',
    categoryEn: 'Original Vinyl & Shellac',
    era: 'พ.ศ. 2476–2490',
    eraEn: '1933–1947 (B.E. 2476–2490)',
    yearBE: 2482,
    creator: 'สถานีวิทยุกระจายเสียงแห่งประเทศไทย (HSP)',
    creatorEn: 'Radio Thailand (Callsign HSP)',
    medium: 'แผ่นเสียงครั่ง (Shellac Disc) ขนาด 10 นิ้ว บรรจุซองกระดาษคราฟท์',
    mediumEn: '10-inch Shellac 78 RPM disc in archival kraft paper sleeve',
    dimensions: 'เส้นผ่านศูนย์กลาง 25.4 ซม.',
    dimensionsEn: '25.4 cm diameter',
    provenance: 'คลังแผ่นเสียงห้องบันทึกเสียง ราชดำเนิน',
    provenanceEn: 'Ratchadamnoen Sound Vault',
    locationInMuseum: 'โซนเครื่องเล่นแผ่นเสียงประวัติศาสตร์ · ชั้นที่ 1',
    locationInMuseumEn: 'Historical Audio Zone · Shelf 01',
    summary:
      'แผ่นเสียงครั่ง 78 รอบต่อนาทีที่ใช้เปิดนำร่องก่อนรายการข่าวภาคเช้าและภาคค่ำ ประกอบด้วยเสียงระฆังเทียบเวลามาตรฐาน รหัสมอร์สสัญญาณเรียกขาน HSP และท่วงทำนองประจำสถานี',
    summaryEn:
      'Historic 78 RPM shellac transcription disc played before morning and evening bulletins, featuring six-pip standard time chimes, HSP Morse callsign tones, and ceremonial station fanfare.',
    transcription:
      '“ที่นี่สถานีวิทยุกระจายเสียงแห่งประเทศไทย กรุงเทพมหานคร คลื่นสั้นและคลื่นกลาง...”',
    transcriptionEn:
      '“This is Radio Thailand, Bangkok, broadcasting on shortwave and medium-wave frequencies...”',
    imagePath: '/src/assets/images/archive_vinyl_collection_1794931822067.jpg',
    vinylTrackId: 'hsp-2482',
    exhibitZoneId: 'turntable',
    keywords: ['แผ่นเสียง', 'shellac', '78 rpm', 'HSP', 'เทียบเวลา', '2482', '1939'],
  },
  {
    id: 'arc-2495-band-lp',
    accessionNumber: 'PRD-REC-2495-008',
    title: 'แผ่นเสียงไวนิล LP: ลีลาศแห่งลุ่มน้ำเจ้าพระยา — วงดนตรีกรมประชาสัมพันธ์',
    titleEn: 'Vinyl LP: Chao Phraya Ballroom Serenade — PRD Band',
    subtitle: 'ผลงานบันทึกเสียงชุดพิเศษในโอกาสเปลี่ยนนามกรมเป็นกรมประชาสัมพันธ์',
    subtitleEn: 'Commemorative LP marking the 1952 renaming to Public Relations Department',
    category: 'แผ่นเสียงต้นฉบับ',
    categoryEn: 'Original Vinyl & Shellac',
    era: 'พ.ศ. 2491–2510',
    eraEn: '1948–1967 (B.E. 2491–2510)',
    yearBE: 2495,
    creator: 'วงดนตรีกรมประชาสัมพันธ์',
    creatorEn: 'Public Relations Department Orchestra',
    medium: 'แผ่นไวนิลไมโครกรูฟ 33⅓ รอบต่อนาที',
    mediumEn: '12-inch 33⅓ RPM microgroove vinyl LP',
    dimensions: 'เส้นผ่านศูนย์กลาง 30.0 ซม.',
    dimensionsEn: '30.0 cm diameter',
    provenance: 'หอสมุดเสียงกรมประชาสัมพันธ์',
    provenanceEn: 'PRD Sound Library',
    locationInMuseum: 'โซนเครื่องเล่นแผ่นเสียงประวัติศาสตร์ · แท่นจัดแสดงกลาง',
    locationInMuseumEn: 'Historical Audio Zone · Central Plinth',
    summary:
      'บันทึกเสียงการบรรเลงดนตรีสากลผสมสำเนียงไทยโดยวงดนตรีประจำกรม เพื่อออกอากาศทางสถานีวิทยุและสร้างสุนทรียภาพทางวัฒนธรรมแก่สาธารณชนในยุค พ.ศ. 2495',
    summaryEn:
      'A quintessential mid-century Bangkok ballroom recording blending Thai melodic phrasing with warm big-band brass and strings, performed by the PRD Orchestra in 1952.',
    transcription:
      'บันทึกปกหลัง: บันทึกเสียงระบบโมโนความเที่ยงตรงสูง ณ ห้องส่ง 2 ถนนราชดำเนิน อำนวยเพลงโดยหัวหน้าวงดนตรีกรมประชาสัมพันธ์',
    transcriptionEn:
      'Sleeve Note: High-fidelity monophonic recording captured in Studio 2, Ratchadamnoen Avenue, conducted by the PRD Orchestra Maestro.',
    imagePath: '/src/assets/images/archive_vinyl_collection_1794931822067.jpg',
    vinylTrackId: 'chaophraya-2495',
    exhibitZoneId: 'turntable',
    keywords: ['แผ่นเสียง', 'LP', 'vinyl', 'วงดนตรีกรมประชาสัมพันธ์', '2495', '1952', 'ballroom'],
  },
  {
    id: 'arc-2498-tv4',
    accessionNumber: 'PRD-OBJ-2498-021',
    title: 'กล้องโทรทัศน์ขาว-ดำและมอนิเตอร์ห้องส่ง สถานีโทรทัศน์ไทยทีวี ช่อง 4 บางขุนพรหม',
    titleEn: 'Channel 4 Bang Khun Phrom Monochrome TV Camera & CRT Studio Monitor',
    subtitle: 'ปฐมฤกษ์การแพร่ภาพโทรทัศน์แห่งแรกในประเทศไทย 24 มิถุนายน 2498',
    subtitleEn: 'Inaugural television broadcast hardware in Thailand, 24 June 1955',
    category: 'สื่อวิทยุและโทรทัศน์',
    categoryEn: 'Radio & Television',
    era: 'พ.ศ. 2491–2510',
    eraEn: '1948–1967 (B.E. 2491–2510)',
    yearBE: 2498,
    creator: 'บริษัท ไทยโทรทัศน์ จำกัด (เครือข่ายกรมประชาสัมพันธ์)',
    creatorEn: 'Thai Television Co., Ltd. (PRD Network)',
    medium: 'ตัวกล้องเหล็กหล่อ เลนส์เทอร์เร็ต 3 ระยะ พร้อมจอหลอดภาพ CRT',
    mediumEn: 'Cast-aluminum Image Orthicon camera, 3-lens turret & wooden CRT monitor',
    dimensions: '85.0 × 70.0 × 155.0 ซม.',
    dimensionsEn: '85.0 × 70.0 × 155.0 cm',
    provenance: 'อาคารสถานีโทรทัศน์ช่อง 4 วังบางขุนพรหม',
    provenanceEn: 'Channel 4 Studio, Bang Khun Phrom Palace',
    locationInMuseum: 'โซนโทรทัศน์ยุคบุกเบิก · แท่นจัดแสดงด้านขวา',
    locationInMuseumEn: 'Early Television Zone · East Pedestal',
    summary:
      'กล้องส่งโทรทัศน์ระบบ 525 เส้นแบบ Image Orthicon บนแท่นล้อเลื่อน พร้อมเครื่องรับจอมอนิเตอร์ควบคุมภาพที่ใช้ในการถ่ายทอดสดข่าว ละครเวที และการแสดงนาฏศิลป์ยุคแรก',
    summaryEn:
      '525-line Image Orthicon studio camera on rolling dolly paired with its control CRT monitor, used in mainland Southeast Asia’s very first regular television broadcast in 1955.',
    transcription:
      'รายงานช่างเทคนิค 24 มิถุนายน 2498: สัญญาณภาพและเสียงช่อง 4 แพร่ภาพครอบคลุมรัศมีพระนครและธนบุรีได้อย่างคมชัด',
    transcriptionEn:
      'Technical Log, 24 June 1955: Channel 4 picture and audio carriers transmitted cleanly across Phra Nakhon and Thonburi.',
    imagePath: '/src/assets/images/archive_tv_bangkhunphrom_1794931822372.jpg',
    exhibitZoneId: 'tv4',
    keywords: ['ช่อง 4 บางขุนพรหม', 'Channel 4', 'โทรทัศน์', 'television', '2498', '1955'],
  },
  {
    id: 'arc-2498-tv4-photo',
    accessionNumber: 'PRD-PHO-2498-042',
    title: 'ภาพถ่ายประวัติศาสตร์: ห้องส่งการถ่ายทอดสดรายการข่าวค่ำ ช่อง 4 บางขุนพรหม',
    titleEn: 'Historic Photograph: Live Evening News Broadcast at Channel 4 Studio',
    subtitle: 'ฟิล์มกระจกและภาพอัดเจลาตินซิลเวอร์ต้นฉบับ',
    subtitleEn: 'Original silver-gelatin archival print from Bang Khun Phrom',
    category: 'ภาพถ่ายประวัติศาสตร์',
    categoryEn: 'Historic Photography',
    era: 'พ.ศ. 2491–2510',
    eraEn: '1948–1967 (B.E. 2491–2510)',
    yearBE: 2498,
    creator: 'แผนกภาพข่าว กรมประชาสัมพันธ์',
    creatorEn: 'PRD Photojournalism Division',
    medium: 'ภาพถ่ายอัดขยายบนกระดาษเจลาตินซิลเวอร์ ผนึกบนกระดาษไร้กรด',
    mediumEn: 'Silver-gelatin print mounted on acid-free archival rag board',
    dimensions: '25.0 × 20.0 ซม.',
    dimensionsEn: '25.0 × 20.0 cm',
    provenance: 'คลังภาพข่าว วังบางขุนพรหม',
    provenanceEn: 'Bang Khun Phrom Newsroom Photo Archive',
    locationInMuseum: 'ระเบียงภาพถ่ายประวัติศาสตร์ · ผนังทิศเหนือ',
    locationInMuseumEn: 'Photography Gallery · North Wall',
    summary:
      'ภาพบันทึกบรรยากาศการทำงานจริงของคณะผู้ประกาศข่าว ช่างภาพ และผู้กำกับเวทีภายใต้แสงสปอตไลท์กำลังสูงในห้องส่งโทรทัศน์แห่งแรกของเอเชียแผ่นดินใหญ่',
    summaryEn:
      'Documentary photograph capturing news anchors, camera operators, and floor directors working under hot tungsten studio floodlights during Thailand’s inaugural television era.',
    transcription:
      'คำบรรยายหลังภาพ: คณะผู้ประกาศข่าวและทีมเทคนิค ช่อง 4 บางขุนพรหม ขณะทดลองออกอากาศรายการข่าวภาคค่ำ พ.ศ. 2498',
    transcriptionEn:
      'Verso Caption: Channel 4 Bang Khun Phrom anchors and technical crew during evening news rehearsal, 1955.',
    imagePath: '/src/assets/images/archive_tv_bangkhunphrom_1794931822372.jpg',
    exhibitZoneId: 'tv4',
    keywords: ['ภาพถ่าย', 'photograph', 'บางขุนพรหม', 'Channel 4', 'newsroom', '2498'],
  },
  {
    id: 'arc-2498-tv4-vinyl',
    accessionNumber: 'PRD-REC-2498-011',
    title: 'แผ่นเสียง 45 รอบ: สัญญาณเปิดสถานีและท่วงทำนองมโหรีไทยทีวี ช่อง 4',
    titleEn: '45 RPM Single: Channel 4 Test-Pattern Tone & Mahori Opening Chime',
    subtitle: 'เสียงดนตรีไทยประกอบภาพแผนทดสอบโทรทัศน์ยุคขาว-ดำ',
    subtitleEn: 'Traditional Thai xylophone ensemble paired with 1955 TV test card tones',
    category: 'แผ่นเสียงต้นฉบับ',
    categoryEn: 'Original Vinyl & Shellac',
    era: 'พ.ศ. 2491–2510',
    eraEn: '1948–1967 (B.E. 2491–2510)',
    yearBE: 2498,
    creator: 'กองสังคีต กรมประชาสัมพันธ์',
    creatorEn: 'PRD Traditional Music Section',
    medium: 'แผ่นเสียงไวนิล 45 รอบต่อนาที',
    mediumEn: '7-inch 45 RPM vinyl single',
    dimensions: 'เส้นผ่านศูนย์กลาง 17.8 ซม.',
    dimensionsEn: '17.8 cm diameter',
    provenance: 'ห้องควบคุมเสียง สถานีโทรทัศน์ช่อง 4 บางขุนพรหม',
    provenanceEn: 'Audio Control Booth, Channel 4 Bang Khun Phrom',
    locationInMuseum: 'โซนเครื่องเล่นแผ่นเสียงประวัติศาสตร์ · แผงที่ 3',
    locationInMuseumEn: 'Historical Audio Zone · Shelf 03',
    summary:
      'แผ่นเสียงประกอบภาพ Test Pattern ก่อนเริ่มรายการโทรทัศน์ภาคค่ำ ผสานเสียงสัญญาณความถี่ทดสอบ 1 กิโลเฮิรตซ์เข้ากับทำนองระนาดเอกและฆ้องวงอันเป็นเอกลักษณ์',
    summaryEn:
      'Iconic evening sign-on disc combining broadcast test-card reference tones with classic Thai Ranat-Ek wooden xylophone and Khong Wong melodies.',
    transcription:
      'บันทึกการใช้งาน: ใช้เปิดทุกวันจันทร์–อาทิตย์ เวลา 18:15 น. ก่อนเข้าสู่รายการข่าวในพระราชสำนักและข่าวสารบ้านเมือง',
    transcriptionEn:
      'Broadcast Cue Sheet: Played daily at 18:15 ahead of the Royal News and National Evening Bulletin.',
    imagePath: '/src/assets/images/archive_vinyl_collection_1794931822067.jpg',
    vinylTrackId: 'tv4-2498',
    exhibitZoneId: 'turntable',
    keywords: ['ช่อง 4', 'Channel 4', '45 rpm', 'Test Card', 'ดนตรีไทย', '2498'],
  },
  {
    id: 'arc-2510-asean-doc',
    accessionNumber: 'PRD-REC-2510-019',
    title: 'แผ่นมาสเตอร์สารคดีเสียง: ย้อนรอยคลื่นสยามสู่อาเซียน (พ.ศ. 2510)',
    titleEn: 'Archival Master LP: Echoes of Siam to ASEAN (1967 / B.E. 2510)',
    subtitle: 'การกระจายเสียงภาคภาษาต่างประเทศและข่าวความร่วมมือภูมิภาค',
    subtitleEn: 'Radio Thailand World Service documentary score',
    category: 'แผ่นเสียงต้นฉบับ',
    categoryEn: 'Original Vinyl & Shellac',
    era: 'พ.ศ. 2491–2510',
    eraEn: '1948–1967 (B.E. 2491–2510)',
    yearBE: 2510,
    creator: 'สถานีวิทยุกระจายเสียงภาคภาษาต่างประเทศ (Radio Thailand World Service)',
    creatorEn: 'Radio Thailand World Service',
    medium: 'แผ่นไวนิลมาสเตอร์ 33⅓ รอบต่อนาที',
    mediumEn: '12-inch 33⅓ RPM archival master vinyl',
    dimensions: 'เส้นผ่านศูนย์กลาง 30.0 ซม.',
    dimensionsEn: '30.0 cm diameter',
    provenance: 'คลังสารคดีเสียง อาคารปฏิบัติการวิทยุ',
    provenanceEn: 'World Service Sound Documentary Archive',
    locationInMuseum: 'โซนเครื่องเล่นแผ่นเสียงประวัติศาสตร์ · แผงที่ 4',
    locationInMuseumEn: 'Historical Audio Zone · Shelf 04',
    summary:
      'เสียงดนตรีประกอบสารคดีประวัติศาสตร์ในโอกาสก่อตั้งสมาคมประชาชาติแห่งเอเชียตะวันออกเฉียงใต้ (อาเซียน) ปี 2510 ที่กรุงเทพมหานคร ถ่ายทอดด้วยขลุ่ยเพียงออและเครื่องสายร่วมสมัย',
    summaryEn:
      'Original incidental score composed for the 1967 ASEAN Bangkok Declaration radio documentary, featuring serene Thai bamboo flute (Klui) over warm analog string pads.',
    transcription:
      '“เสียงจากกรุงเทพมหานคร รายงานความร่วมมือเพื่อสันติภาพและความเข้าใจอันดีในภูมิภาคเอเชียตะวันออกเฉียงใต้...”',
    transcriptionEn:
      '“Voice of Bangkok reporting on regional cooperation for peace and mutual understanding across Southeast Asia...”',
    imagePath: '/src/assets/images/archive_vinyl_collection_1794931822067.jpg',
    vinylTrackId: 'klui-2510',
    exhibitZoneId: 'turntable',
    keywords: ['อาเซียน', 'ASEAN', '2510', '1967', 'สารคดีเสียง', 'ขลุ่ย', 'klui'],
  },
  {
    id: 'arc-2516-radio-bulletin',
    accessionNumber: 'PRD-PHO-2516-055',
    title: 'ภาพถ่ายห้องส่งข่าวและระบบเทปแม่เหล็กเรียวทูเรียว พ.ศ. 2516–2525',
    titleEn: 'Regional News Studio & Reel-to-Reel Magnetic Tape Era (1973–1982)',
    subtitle: 'ยุคเปลี่ยนผ่านสู่ระบบกระจายเสียงสเตอริโอและเครือข่ายภูมิภาค',
    subtitleEn: 'Transition to FM stereo and nationwide regional radio relays',
    category: 'ภาพถ่ายประวัติศาสตร์',
    categoryEn: 'Historic Photography',
    era: 'พ.ศ. 2511–2535',
    eraEn: '1968–1992 (B.E. 2511–2535)',
    yearBE: 2520,
    creator: 'กองข่าวและภาพ กรมประชาสัมพันธ์',
    creatorEn: 'PRD News & Photo Bureau',
    medium: 'ภาพถ่ายฟิล์มสไลด์สีบูรณะดิจิทัลความละเอียดสูง',
    mediumEn: 'Digitally restored 35mm reversal color slide print',
    dimensions: '30.0 × 22.5 ซม.',
    dimensionsEn: '30.0 × 22.5 cm',
    provenance: 'สำนักข่าวกรมประชาสัมพันธ์',
    provenanceEn: 'National News Bureau of Thailand (NNT)',
    locationInMuseum: 'โถงจัดแสดง 2 · พัฒนาการสื่อสารมวลชนยุคกลาง',
    locationInMuseumEn: 'Gallery Hall 2 · Mid-Century Expansion Wing',
    summary:
      'บันทึกการทำงานในห้องส่งระบบเทปแม่เหล็ก Reel-to-Reel และเครื่องควบคุมเสียงหลอด-ทรานซิสเตอร์ที่ขยายสัญญาณเครือข่ายสถานีวิทยุกระจายเสียงแห่งประเทศไทยครบทุกภูมิภาค',
    summaryEn:
      'Archival slide illustrating master control operations linking 42 provincial Radio Thailand stations across the country via reel-to-reel tape automation and microwave relays.',
    transcription:
      'บันทึกห้องส่ง: เชื่อมต่อสัญญาณถ่ายทอดสดภาคข่าว 07:00 น. ไปยังสถานีวิทยุภูมิภาค 42 แห่งทั่วประเทศ',
    transcriptionEn:
      'Control Room Log: Synchronizing 07:00 national news relay feed across 42 regional Radio Thailand affiliates.',
    imagePath: '/src/assets/images/archive_radio_studio_1794931820853.jpg',
    exhibitZoneId: 'radio',
    keywords: ['2520', '1977', 'เทปแม่เหล็ก', 'ภูมิภาค', 'สวท', 'ข่าว', 'radio'],
  },
  {
    id: 'arc-2528-fm80s',
    accessionNumber: 'PRD-REC-2528-044',
    title: 'แผ่นเสียงยุค 80: คืนฟ้าใส สเตอริโอเอฟเอ็ม — ซาวด์ซินธ์ป๊อปร่วมสมัย พ.ศ. 2528',
    titleEn: '1980s Vinyl LP: Starlit Bangkok FM Stereo — 1985 Synth-Pop Broadcast Edition',
    subtitle: 'คลื่นวิทยุเอฟเอ็มสเตอริโอและดนตรีอิเล็กทรอนิกส์ยุคแรกในไทย',
    subtitleEn: 'Pioneering FM stereo broadcast music and 1980s analog synthesizer pop',
    category: 'แผ่นเสียงต้นฉบับ',
    categoryEn: 'Original Vinyl & Shellac',
    era: 'พ.ศ. 2511–2535',
    eraEn: '1968–1992 (B.E. 2511–2535)',
    yearBE: 2528,
    creator: 'วงดนตรีร่วมสมัย สวท. เอฟเอ็ม สเตอริโอ',
    creatorEn: 'Radio Thailand FM Stereo Contemporary Ensemble',
    medium: 'แผ่นเสียงไวนิล LP สเตอริโอ 33⅓ รอบต่อนาที',
    mediumEn: '12-inch 33⅓ RPM stereo vinyl LP',
    dimensions: 'เส้นผ่านศูนย์กลาง 30.0 ซม.',
    dimensionsEn: '30.0 cm diameter',
    provenance: 'คลังแผ่นเสียงรายการภาคค่ำ สถานีวิทยุ สวท. เอฟเอ็ม',
    provenanceEn: 'Radio Thailand FM Evening Program Disc Library',
    locationInMuseum: 'โซนเครื่องเล่นแผ่นเสียงประวัติศาสตร์ · แผงที่ 5 (ยุค 80)',
    locationInMuseumEn: 'Historical Audio Zone · Shelf 05 (1980s Era)',
    summary:
      'แผ่นเสียงตัวอย่างเพลงบรรเลงซินธ์ป๊อปยุค 80 (พ.ศ. 2528) ที่ใช้เปิดคั่นรายการวิทยุเอฟเอ็มสเตอริโอภาคค่ำ โดดเด่นด้วยเสียงเบสสังเคราะห์ เปียโนไฟฟ้า FM และจังหวะกลองอิเล็กทรอนิกส์สไตล์เรโทร',
    summaryEn:
      'An iconic 1985 FM Stereo evening broadcast vinyl track showcasing 1980s analog synth-bass grooves, shimmering FM electric piano arpeggios, gated electronic drums, and nostalgic poly-synth hooks.',
    transcription:
      'บันทึกปกแผ่นเสียง (พ.ศ. 2528): ออกอากาศระบบ FM Stereo Multiplex เพื่อความบันเทิงภาคค่ำทางสถานีวิทยุกระจายเสียงแห่งประเทศไทย',
    transcriptionEn:
      'Jacket Note (1985): Mastered for FM Stereo Multiplex evening transmission across Radio Thailand FM networks.',
    imagePath: '/src/assets/images/archive_vinyl_collection_1794931822067.jpg',
    vinylTrackId: 'fm-stereo-2528',
    exhibitZoneId: 'turntable',
    keywords: ['ยุค 80', '80s', 'synth-pop', '2528', '1985', 'แผ่นเสียง', 'FM', 'สเตอริโอ'],
  },
  {
    id: 'arc-2540-digital-archive',
    accessionNumber: 'PRD-DOC-2545-102',
    title: 'เอกสารโครงการอนุรักษ์มรดกโสตทัศน์สู่คลังจดหมายเหตุดิจิทัลแห่งชาติ',
    titleEn: 'Audiovisual Heritage Digitization & National Digital Archive Charter',
    subtitle: 'มาตรฐานการจัดทำเมทาดาทาและการแปลงสัญญาณอนาล็อกสู่ดิจิทัล',
    subtitleEn: 'Metadata standards and analog-to-digital preservation protocol',
    category: 'เอกสารจดหมายเหตุ',
    categoryEn: 'Archival Documents',
    era: 'พ.ศ. 2536–ปัจจุบัน',
    eraEn: '1993–Present (B.E. 2536–Now)',
    yearBE: 2545,
    creator: 'ศูนย์ข้อมูลข่าวสารและหอจดหมายเหตุ กรมประชาสัมพันธ์',
    creatorEn: 'PRD Information Center & Digital Archives Division',
    medium: 'แฟ้มเอกสารวิชาการและสื่อบันทึกข้อมูลดิจิทัล',
    mediumEn: 'Archival policy folio and lossless digital preservation masters',
    dimensions: '21.0 × 29.7 ซม.',
    dimensionsEn: '21.0 × 29.7 cm',
    provenance: 'อาคารหอจดหมายเหตุและพิพิธภัณฑ์ กรมประชาสัมพันธ์',
    provenanceEn: 'PRD Museum & Archives Building, Ari Samphan',
    locationInMuseum: 'โถงจัดแสดง 3 · ยุคสื่อดิจิทัลและปัญญาประดิษฐ์',
    locationInMuseumEn: 'Gallery Hall 3 · Digital Preservation Wing',
    summary:
      'รายงานโครงสร้างการอนุรักษ์แผ่นเสียงครั่ง แถบบันทึกเสียง ฟิล์มภาพยนตร์ 16 มม. และต้นฉบับเอกสารราชการกว่าแสนรายการ ให้เป็นฐานข้อมูลดิจิทัลที่ประชาชนสืบค้นได้เสรี',
    summaryEn:
      'Comprehensive preservation blueprint transferring fragile shellac discs, 16mm reels, and historical state papers into an open public-access digital archive.',
    transcription:
      '“การอนุรักษ์ความทรงจำของชาติมิใช่เพียงการเก็บรักษาในห้องควบคุมอุณหภูมิ หากแต่เป็นการเปิดโอกาสให้คนรุ่นใหม่เข้าถึง สดับฟัง และเรียนรู้ได้ทุกที่ทุกเวลา”',
    transcriptionEn:
      '“Preserving national memory is not merely climate-controlled storage—it is opening the doors so future generations may inspect, listen, and learn from anywhere.”',
    imagePath: '/src/assets/images/hero_prd_archive_hall_1794931819301.jpg',
    exhibitZoneId: 'vitrine',
    keywords: ['ดิจิทัล', 'digital', 'อนุรักษ์', 'เมทาดาทา', '2545', '2002', 'archive'],
  },
];

export const VINYL_RECORDS: VinylRecord[] = [
  {
    id: 'hsp-2482',
    catalogNo: 'PRD-REC-2482-003',
    title: 'สัญญาณเทียบเวลาและบทเพลงเปิดสถานีวิทยุแห่งชาติ (HSP)',
    titleEn: 'National Radio Time Pips & Opening Fanfare (Callsign HSP)',
    ensemble: 'สถานีวิทยุกระจายเสียงแห่งประเทศไทย',
    ensembleEn: 'Radio Thailand (Bangkok)',
    yearBE: 2482,
    nativeRpm: 78,
    durationSeconds: 72,
    labelColor: '#7F1D1D',
    labelAccent: '#F3D28B',
    discType: 'แผ่นครั่ง 10 นิ้ว',
    discTypeEn: '10" Shellac Disc',
    provenance: 'คลังแผ่นเสียงห้องส่ง ราชดำเนินกลาง',
    provenanceEn: 'Ratchadamnoen Studio Disc Vault',
    description:
      'บันทึกสัญญาณเทียบเวลา 6 จังหวะ รหัสมอร์ส HSP และทำนองประโคมเปิดสถานีวิทยุกระจายเสียงแห่งประเทศไทยในยุคแรกเริ่ม',
    descriptionEn:
      'Features the historic six-pip broadcast time signal, HSP Morse code callsign pulses, and ceremonial pentatonic brass fanfare used at station sign-on.',
    trackNote: 'แนะนำตั้งความเร็วที่ 78 RPM เพื่อความถูกต้องของจังหวะและระดับเสียงต้นฉบับ',
    trackNoteEn: 'Recommended native speed: 78 RPM for authentic tempo and pitch.',
    patternId: 'hsp_radio_2482',
  },
  {
    id: 'chaophraya-2495',
    catalogNo: 'PRD-REC-2495-008',
    title: 'ลีลาศแห่งลุ่มน้ำเจ้าพระยา (บันทึกเสียงระบบหลอดสุญญากาศ)',
    titleEn: 'Chao Phraya Ballroom Serenade (Vacuum Tube Recording)',
    ensemble: 'วงดนตรีกรมประชาสัมพันธ์',
    ensembleEn: 'PRD Orchestra',
    yearBE: 2495,
    nativeRpm: 33.33,
    durationSeconds: 88,
    labelColor: '#1E3A8A',
    labelAccent: '#E5D3A3',
    discType: 'แผ่นไวนิล LP 12 นิ้ว',
    discTypeEn: '12" Vinyl LP',
    provenance: 'หอสมุดเสียง กรมประชาสัมพันธ์',
    provenanceEn: 'PRD Sound Library',
    description:
      'บทเพลงบรรเลงจังหวะลีลาศสุนทรียะร่วมสมัย ผสมผสานทำนองไทยสากล เครื่องเป่าทองเหลือง และจังหวะกลองชุดอันนุ่มนวล',
    descriptionEn:
      'Warm mid-century Bangkok ballroom ensemble combining muted brass, upright bass, brushed percussion, and Thai-inspired lyrical melody.',
    trackNote: 'แนะนำตั้งความเร็วที่ 33⅓ RPM · สามารถทดลองปรับเป็น 45 หรือ 78 RPM เพื่อฟังความแตกต่างทางกลไกได้',
    trackNoteEn: 'Native speed: 33⅓ RPM · Switch to 45 or 78 RPM to hear genuine analog pitch/tempo shift.',
    patternId: 'chao_phraya_2495',
  },
  {
    id: 'tv4-2498',
    catalogNo: 'PRD-REC-2498-011',
    title: 'สัญญาณเปิดสถานีไทยทีวี ช่อง 4 บางขุนพรหม',
    titleEn: 'Thai TV Channel 4 Bang Khun Phrom Sign-On & Mahori',
    ensemble: 'กองสังคีต กรมประชาสัมพันธ์',
    ensembleEn: 'PRD Traditional Music Ensemble',
    yearBE: 2498,
    nativeRpm: 45,
    durationSeconds: 68,
    labelColor: '#292524',
    labelAccent: '#D4AF37',
    discType: 'แผ่นซิงเกิล 7 นิ้ว',
    discTypeEn: '7" Vinyl Single',
    provenance: 'ห้องควบคุมเสียง วังบางขุนพรหม',
    provenanceEn: 'Bang Khun Phrom Audio Control Booth',
    description:
      'เสียงคลื่นสัญญาณทดสอบภาพ Test Pattern ตามด้วยท่วงทำนองเครื่องดนตรีไทยประยุกต์สำหรับเปิดรายการโทรทัศน์ภาคค่ำ',
    descriptionEn:
      'Opens with 1955 television test-card reference tones transitioning into traditional Ranat-Ek wooden xylophone and Khong Wong ceremonial motifs.',
    trackNote: 'แนะนำตั้งความเร็วที่ 45 RPM',
    trackNoteEn: 'Recommended native speed: 45 RPM.',
    patternId: 'tv4_chime_2498',
  },
  {
    id: 'klui-2510',
    catalogNo: 'PRD-REC-2510-019',
    title: 'ย้อนรอยคลื่นสยามสู่อาเซียน (ดนตรีประกอบสารคดีเสียง)',
    titleEn: 'Echoes of Siam to ASEAN (Documentary Score)',
    ensemble: 'สถานีวิทยุภาคภาษาต่างประเทศ',
    ensembleEn: 'Radio Thailand World Service',
    yearBE: 2510,
    nativeRpm: 33.33,
    durationSeconds: 84,
    labelColor: '#14532D',
    labelAccent: '#E7E0CE',
    discType: 'แผ่นไวนิล LP 12 นิ้ว',
    discTypeEn: '12" Vinyl LP',
    provenance: 'คลังสารคดีเสียง อาคารปฏิบัติการวิทยุ',
    provenanceEn: 'World Service Sound Archive',
    description:
      'ท่วงทำนองขลุ่ยเพียงออและคลื่นซาวด์สเคปประกอบรายการสารคดีประวัติศาสตร์การทูตและการสื่อสารระหว่างประเทศ',
    descriptionEn:
      'Reflective Thai bamboo flute (Klui) and warm analog tape harmonies originally broadcast across international shortwave relays in 1967.',
    trackNote: 'แนะนำตั้งความเร็วที่ 33⅓ RPM',
    trackNoteEn: 'Recommended native speed: 33⅓ RPM.',
    patternId: 'klui_archive_2510',
  },
  {
    id: 'fm-stereo-2528',
    catalogNo: 'PRD-REC-2528-044',
    title: 'คืนฟ้าใส สเตอริโอเอฟเอ็ม (เพลงซินธ์ป๊อปยุค 80)',
    titleEn: 'Starlit Bangkok FM Stereo (1980s Synth-Pop)',
    ensemble: 'วงดนตรีร่วมสมัย สวท. เอฟเอ็ม (พ.ศ. 2528)',
    ensembleEn: 'Radio Thailand FM Ensemble (1985)',
    yearBE: 2528,
    nativeRpm: 33.33,
    durationSeconds: 92,
    labelColor: '#312E81',
    labelAccent: '#E2E8F0',
    discType: 'แผ่นไวนิล LP 12 นิ้ว',
    discTypeEn: '12" Stereo Vinyl LP',
    provenance: 'คลังแผ่นเสียงรายการภาคค่ำ สวท. เอฟเอ็ม',
    provenanceEn: 'Radio Thailand FM Evening Program Library',
    description:
      'บทเพลงซินธ์ป๊อปสไตล์ยุค 80 เต็มรูปแบบ ประกอบด้วยจังหวะกลองอิเล็กทรอนิกส์ เบสสังเคราะห์ คอร์ดเปียโนไฟฟ้า FM และทำนองซินธ์ลีดชวนหวนรำลึกยุคสเตอริโอ',
    descriptionEn:
      'Authentic 1980s synth-pop instrumental featuring electronic kick/snare groove, octave synth-bass, shimmering FM electric piano arpeggios, and bright analog lead melody.',
    trackNote: 'แนะนำตั้งความเร็วที่ 33⅓ RPM (ลองปรับเป็น 45 RPM เพื่อฟังสไตล์รีมิกซ์จังหวะเร็ว)',
    trackNoteEn: 'Native speed: 33⅓ RPM (try 45 RPM for an upbeat disco-tempo twist).',
    patternId: 'synth_pop_2528',
  },
];

export const HISTORY_TIMELINE: TimelineChapter[] = [
  {
    index: '01',
    yearRange: 'พ.ศ. 2476',
    yearRangeEn: '1933 (B.E. 2476)',
    title: 'กำเนิดสำนักงานโฆษณาการ',
    titleEn: 'Founding of the Publicity Bureau',
    subtitle: 'รากฐานการสื่อสารสาธารณะสมัยใหม่ของไทย',
    subtitleEn: 'Laying the cornerstone of modern Thai public communication',
    narrative:
      'จัดตั้งขึ้นเมื่อวันที่ 3 พฤษภาคม พ.ศ. 2476 เพื่อเป็นศูนย์กลางเผยแพร่ข่าวสารราชการ ความรู้ และการชี้แจงนโยบายรัฐแก่ประชาชนอย่างเป็นระบบเป็นครั้งแรก',
    narrativeEn:
      'Established on 3 May 1933 as Thailand’s central institution for disseminating state news, civic education, and public policy announcements nationwide.',
    milestoneArtifactId: 'arc-2476-founding',
  },
  {
    index: '02',
    yearRange: 'พ.ศ. 2482–2494',
    yearRangeEn: '1939–1951',
    title: 'ยุคทองวิทยุกระจายเสียงและแผ่นครั่ง',
    titleEn: 'Golden Era of National Radio & Shellac Discs',
    subtitle: 'เสียงจากราชดำเนินสู่ทุกภูมิภาค',
    subtitleEn: 'Broadcasting from Ratchadamnoen to every province',
    narrative:
      'ขยายการกระจายเสียงผ่านสถานีวิทยุกระจายเสียงแห่งประเทศไทย บันทึกรายการสำคัญและบทเพลงประจำชาติลงบนแผ่นเสียงครั่ง 78 รอบเพื่อเก็บรักษาและออกอากาศซ้ำ',
    narrativeEn:
      'Expanded Radio Thailand’s national reach while preserving historic speeches, time chimes, and orchestral recordings on 78 RPM shellac transcription discs.',
    milestoneArtifactId: 'arc-2482-shellac',
  },
  {
    index: '03',
    yearRange: 'พ.ศ. 2495–2498',
    yearRangeEn: '1952–1955',
    title: 'สถาปนากรมประชาสัมพันธ์ และช่อง 4 บางขุนพรหม',
    titleEn: 'Establishment of PRD & Channel 4 Bang Khun Phrom',
    subtitle: 'ก้าวแรกแห่งโทรทัศน์ไทยและเอเชียแผ่นดินใหญ่',
    subtitleEn: 'Southeast Asia’s first regular television station',
    narrative:
      'เปลี่ยนชื่อเป็น “กรมประชาสัมพันธ์” ในปี พ.ศ. 2495 และร่วมริเริ่มการแพร่ภาพโทรทัศน์แห่งแรกของประเทศที่สถานีโทรทัศน์ไทยทีวี ช่อง 4 บางขุนพรหม ในปี พ.ศ. 2498',
    narrativeEn:
      'Renamed the Public Relations Department in 1952 and pioneered television broadcasting across mainland Southeast Asia via Thai TV Channel 4 in June 1955.',
    milestoneArtifactId: 'arc-2498-tv4',
  },
  {
    index: '04',
    yearRange: 'พ.ศ. 2510–2535',
    yearRangeEn: '1967–1992',
    title: 'เครือข่ายข่าวสารภูมิภาคและวิเทศสัมพันธ์',
    titleEn: 'Regional Networks & International Broadcasting',
    subtitle: 'เชื่อมคลื่นเสียงไทยสู่ประชาคมโลก',
    subtitleEn: 'Connecting Thailand’s voice to ASEAN and the world',
    narrative:
      'พัฒนาสถานีวิทยุและโทรทัศน์แห่งประเทศไทย (สวท. และ สทท. ช่อง 11 / NBT) พร้อมสถานีวิทยุภาคภาษาต่างประเทศ รายงานเหตุการณ์สำคัญทางประวัติศาสตร์ตลอดครึ่งศตวรรษ',
    narrativeEn:
      'Built nationwide regional radio networks, NBT television, and multilingual Radio Thailand World Service transmissions documenting pivotal regional milestones.',
    milestoneArtifactId: 'arc-2510-asean-doc',
  },
  {
    index: '05',
    yearRange: 'พ.ศ. 2536–ปัจจุบัน',
    yearRangeEn: '1993–Present',
    title: 'หอจดหมายเหตุดิจิทัลและพิพิธภัณฑ์เสมือนจริง',
    titleEn: 'Digital Archives & Virtual Museum Experience',
    subtitle: 'อนุรักษ์มรดกสื่อสารของชาติเพื่อการเข้าถึงอย่างยั่งยืน',
    subtitleEn: 'Preserving national media heritage for universal access',
    narrative:
      'เปลี่ยนผ่านสู่การแปลงเอกสารหายาก ภาพถ่ายฟิล์ม และแผ่นเสียงต้นฉบับให้เป็นข้อมูลดิจิทัลมาตรฐานสากล พร้อมเปิดห้องจัดแสดงเสมือนจริง 3 มิติสำหรับนักวิจัยและประชาชนทุกคน',
    narrativeEn:
      'Transitioning rare documents, photographic negatives, and analog audio into international digital standards alongside an interactive 3D museum for researchers and citizens worldwide.',
    milestoneArtifactId: 'arc-2540-digital-archive',
  },
];
