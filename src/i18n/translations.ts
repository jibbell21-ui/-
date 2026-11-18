export type Language = 'th' | 'en';

export interface Translations {
  brand: string;
  nav: {
    search: string;
    museum3d: string;
    turntable: string;
    history: string;
    booking: string;
    location: string;
    ctaBooking: string;
  };
  hero: {
    kicker: string;
    title: string;
    description: string;
    ctaSearch: string;
    cta3d: string;
    ctaTurntable: string;
    ctaBooking: string;
    figureCaption: string;
    langLabel: string;
  };
  utilityStrip: {
    hoursLabel: string;
    hoursValue: string;
    hoursSub: string;
    archiveLabel: string;
    archiveValue: (count: number) => string;
    archiveSub: string;
    virtualLabel: string;
    virtualValue: string;
    virtualSub: string;
    vinylLabel: string;
    vinylValue: (count: number) => string;
    vinylSub: string;
  };
  search: {
    kicker: string;
    heading: string;
    subheading: string;
    countPrefix: string;
    countMid: string;
    countSuffix: string;
    placeholder: string;
    clearLabel: string;
    eraLabel: string;
    allEras: string;
    allCategories: string;
    quickSuggest: string;
    quickTags: string[];
    emptyTitle: string;
    emptyDesc: string;
    resetBtn: string;
    openDoc: string;
    playVinyl: string;
    view3d: string;
    yearPrefix: string;
  };
  modal: {
    closeLabel: string;
    zoomIn: string;
    zoomOut: string;
    transcriptionTitle: string;
    category: string;
    creator: string;
    medium: string;
    dimensions: string;
    provenance: string;
    playOnTurntable: string;
    viewIn3d: string;
  };
  museum3d: {
    kicker: string;
    heading: string;
    instructions: string;
    fallbackTitle: string;
    fallbackDesc: string;
    hoverPrefix: string;
    hideDock: string;
    showDock: string;
    resetCamera: string;
    playVinyl: string;
    openRecord: string;
  };
  turntable: {
    kicker: string;
    heading: string;
    subheading: string;
    platterLabel: string;
    regLabel: string;
    spinning: string;
    stopped: string;
    needleDown: string;
    needleUp: string;
    sliderAria: string;
    seekAria: string;
    realSpeed: string;
    nativeSpeed: string;
    stopBtn: string;
    playBtn: string;
    liftNeedle: string;
    dropNeedle: string;
    restartBtn: string;
    speedLabel: string;
    volumeLabel: string;
    crackleLabel: string;
    shelfTitle: (count: number) => string;
    shelfSubtitle: string;
    playingNow: string;
    playThis: string;
    placeAndPlay: string;
    notesKicker: string;
    provenanceLabel: string;
    standardRpmLabel: string;
    curatorNoteLabel: string;
  };
  timeline: {
    kicker: string;
    heading: string;
    subheading: string;
    viewArtifact: string;
  };
  booking: {
    kicker: string;
    heading: string;
    subheading: string;
    tabForm: string;
    tabList: (count: number) => string;
    scheduleTitle: string;
    scheduleSubtitle: string;
    selectedDateLabel: string;
    remainingSeats: (seats: number, max: number) => string;
    slotFull: string;
    guidelinesTitle: string;
    guidelines: string[];
    orgLabel: string;
    orgPlaceholder: string;
    contactLabel: string;
    contactPlaceholder: string;
    emailLabel: string;
    phoneLabel: string;
    groupTypeLabel: string;
    groupTypes: { value: string; label: string }[];
    dateLabel: string;
    dateHint: string;
    slotLabel: string;
    visitorsLabel: string;
    visitorsUnit: string;
    guideLangLabel: string;
    guideLangs: { value: string; label: string }[];
    notesLabel: string;
    notesPlaceholder: string;
    submitBtn: string;
    errRequired: string;
    errWeekend: string;
    errCapacity: string;
    confirmBadge: string;
    confirmTitle: string;
    confirmRef: string;
    confirmSummaryDate: string;
    confirmSummarySlot: string;
    confirmSummaryGroup: string;
    confirmSummaryCount: string;
    confirmSummaryGuide: string;
    bookAnother: string;
    printSlip: string;
    emptyBookings: string;
    cancelBooking: string;
    statusConfirmed: string;
  };
  location: {
    kicker: string;
    heading: string;
    subheading: string;
    premisesTitle: string;
    premisesSubtitle: string;
    transitTitle: string;
    transitSubtitle: string;
    loadingMap: string;
    loadingPlaces: string;
    errorTitle: string;
    errorDesc: string;
    missingKeyTitle: string;
    missingKeyDesc: string;
    centerMuseumBtn: string;
    fitAreaBtn: string;
    openMapsBtn: string;
    directionsBtn: string;
    addressLabel: string;
    phoneLabel: string;
    hoursLabel: string;
    transitEmpty: string;
    attributionLabel: string;
    primaryBadge: string;
    transitBadge: string;
    retryBtn: string;
  };
  footer: {
    title: string;
    address: string;
    hours: string;
    copyright: string;
    shareBtn: string;
    copiedBtn: string;
    exportHtmlBtn: string;
    exportingHtmlBtn: string;
    exportedHtmlBtn: string;
  };
  miniBar: {
    regionLabel: string;
    jumpTitle: string;
    pauseLabel: string;
    playLabel: string;
    closeLabel: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  th: {
    brand: 'พิพิธภัณฑ์และหอจดหมายเหตุกรมประชาสัมพันธ์',
    nav: {
      search: 'สืบค้นเอกสาร',
      museum3d: 'ห้องแสดง 3 มิติ',
      turntable: 'เครื่องเล่นแผ่นเสียง',
      history: 'ประวัติศาสตร์',
      booking: 'จองคิวเข้าชม',
      location: 'แผนที่เดินทาง',
      ctaBooking: 'จองคิวหมู่คณะ',
    },
    hero: {
      kicker: 'คลังประวัติศาสตร์ดิจิทัล · ก่อตั้ง พ.ศ. 2476',
      title: 'พิพิธภัณฑ์และหอจดหมายเหตุกรมประชาสัมพันธ์',
      description:
        'ศูนย์รวมมรดกทางประวัติศาสตร์การสื่อสารมวลชนของชาติ รวบรวมเอกสารต้นฉบับ ภาพถ่าย อุปกรณ์วิทยุกระจายเสียง โทรทัศน์ยุคบุกเบิก พร้อมเปิดให้เข้าชมในรูปแบบ 3 มิติ และทดลองฟังเสียงจริงจากเครื่องเล่นแผ่นเสียงอนาล็อก',
      ctaSearch: 'เริ่มสืบค้นเอกสาร',
      cta3d: 'ชมห้องแสดง 3 มิติ',
      ctaTurntable: 'ฟังแผ่นเสียงจริง',
      ctaBooking: 'จองคิวเข้าชมหมู่คณะ',
      figureCaption:
        'ภาพที่ 1 — โถงจัดแสดงตู้กระจกจดหมายเหตุและไมโครโฟนห้องส่งกระจายเสียงยุคแรก',
      langLabel: 'เลือกภาษา',
    },
    utilityStrip: {
      hoursLabel: 'เวลาเข้าชมพิพิธภัณฑ์',
      hoursValue: 'จันทร์–ศุกร์ 09:00–16:30 น.',
      hoursSub: 'เปิดให้เข้าชมและจองคิวหมู่คณะฟรี',
      archiveLabel: 'ฐานข้อมูลเอกสารดิจิทัล',
      archiveValue: (c) => `${c} ชุดหลัก · 2476–ปัจจุบัน`,
      archiveSub: 'ประกาศ ภาพถ่าย และวัตถุจัดแสดง',
      virtualLabel: 'นิทรรศการเสมือนจริง 3D',
      virtualValue: '4 โซนประวัติศาสตร์',
      virtualSub: 'รองรับคอมพิวเตอร์ แท็บเล็ต และมือถือ',
      vinylLabel: 'คลังแผ่นเสียงต้นฉบับ',
      vinylValue: (c) => `${c} แผ่น · 33⅓ / 45 / 78 RPM`,
      vinylSub: 'เล่นเสียงและวางเข็มบนร่องแผ่นได้จริง',
    },
    search: {
      kicker: 'คลังเอกสารจดหมายเหตุและวัตถุจัดแสดงดิจิทัล',
      heading: 'ระบบสืบค้นเอกสารสำคัญและมรดกสื่อสารมวลชน',
      subheading:
        'ค้นหาเอกสารต้นฉบับ ภาพถ่ายประวัติศาสตร์ อุปกรณ์กระจายเสียง และแผ่นเสียงเก่าแก่ ด้วยคำสำคัญ เลขทะเบียน หรือช่วงปีพุทธศักราช',
      countPrefix: 'แสดงผล',
      countMid: 'จาก',
      countSuffix: 'รายการ',
      placeholder: 'พิมพ์คำค้นหา เช่น พ.ศ. 2476, ช่อง 4 บางขุนพรหม, เลขทะเบียน PRD-...',
      clearLabel: 'ล้างคำค้นหา',
      eraLabel: 'ยุคสมัย:',
      allEras: 'ทุกยุคสมัย',
      allCategories: 'ทั้งหมด',
      quickSuggest: 'คำค้นแนะนำ:',
      quickTags: ['2476', 'ช่อง 4 บางขุนพรหม', 'แผ่นเสียง', 'ไมโครโฟน', 'อาเซียน'],
      emptyTitle: 'ไม่พบรายการที่ตรงกับคำค้นหาของคุณ',
      emptyDesc: 'ลองเปลี่ยนคำสำคัญ หรือล้างตัวกรองเพื่อดูเอกสารจดหมายเหตุทั้งหมดในคลัง',
      resetBtn: 'แสดงรายการทั้งหมด',
      openDoc: 'เปิดดูเอกสาร',
      playVinyl: 'เล่นแผ่นเสียง',
      view3d: 'ดูใน 3 มิติ',
      yearPrefix: 'พ.ศ.',
    },
    modal: {
      closeLabel: 'ปิดหน้าต่างรายละเอียด',
      zoomIn: 'ขยายดูรายละเอียด',
      zoomOut: 'ย่อภาพ',
      transcriptionTitle: 'ถอดความ / บันทึกประวัติศาสตร์',
      category: 'หมวดหมู่',
      creator: 'ผู้สร้าง / หน่วยงาน',
      medium: 'วัสดุและเทคนิค',
      dimensions: 'ขนาด',
      provenance: 'ที่มาของเอกสาร',
      playOnTurntable: 'วางแผ่นเสียงลงบนเครื่องเล่นจริง',
      viewIn3d: 'ชมตำแหน่งจัดแสดงในห้อง 3 มิติ',
    },
    museum3d: {
      kicker: 'นิทรรศการเสมือนจริงแบบ 3 มิติ',
      heading: 'ห้องจัดแสดงประวัติศาสตร์ 3 มิติ กรมประชาสัมพันธ์',
      instructions: 'ลากเพื่อหมุนมุมมอง · ซูมเข้า-ออก · แตะที่แท่นจัดแสดงเพื่อเข้าชม',
      fallbackTitle: 'อุปกรณ์นี้ไม่รองรับการเร่งความเร็วกราฟิก 3 มิติในขณะนี้',
      fallbackDesc: 'คุณยังสามารถสืบค้นเอกสารจดหมายเหตุและทดลองเล่นแผ่นเสียงต้นฉบับได้ตามปกติ',
      hoverPrefix: 'ชี้ตำแหน่ง:',
      hideDock: 'ซ่อนแถบควบคุม (โหมดชมเต็มจอ)',
      showDock: 'แสดงแถบนำทาง 3 มิติ',
      resetCamera: 'รีเซ็ตมุมกล้อง',
      playVinyl: 'เปิดฟังแผ่นเสียงจริง',
      openRecord: 'อ่านบันทึกจดหมายเหตุ',
    },
    turntable: {
      kicker: 'ห้องโสตทัศน์และเครื่องเล่นแผ่นเสียงประวัติศาสตร์',
      heading: 'สดับฟังเสียงจริงจากเครื่องเล่นแผ่นเสียงอนาล็อก',
      subheading:
        'เลือกแผ่นเสียงครั่งหรือไวนิลต้นฉบับจากคลังกรมประชาสัมพันธ์ วางลงบนจานหมุน ปรับความเร็วรอบ และแตะหรือลากบนร่องแผ่นเสียงเพื่อวางหัวเข็มเล่นได้จริง',
      platterLabel: 'จานหมุน:',
      regLabel: 'ทะเบียน:',
      spinning: 'กำลังหมุน',
      stopped: 'หยุดนิ่ง',
      needleDown: 'เข็มแตะร่อง',
      needleUp: 'ยกหัวเข็ม',
      sliderAria: 'ตำแหน่งหัวเข็มบนร่องแผ่นเสียง (คลิกหรือลากเพื่อเปลี่ยนตำแหน่งเล่น)',
      seekAria: 'เลื่อนตำแหน่งหัวเข็มตามความยาวแผ่นเสียง',
      realSpeed: 'อัตราเร็วเล่นจริง:',
      nativeSpeed: 'ต้นฉบับ',
      stopBtn: 'หยุดเล่น',
      playBtn: 'เปิดเครื่องเล่น',
      liftNeedle: 'ยกหัวเข็ม',
      dropNeedle: 'วางหัวเข็ม',
      restartBtn: 'เริ่มใหม่',
      speedLabel: 'ความเร็วรอบ',
      volumeLabel: 'ระดับเสียง',
      crackleLabel: 'เสียงซ่าเข็ม',
      shelfTitle: (c) => `คลังแผ่นเสียงต้นฉบับ (${c} รายการ)`,
      shelfSubtitle: 'เลือกแผ่นเสียงที่ต้องการวางบนเครื่องเล่น เพื่อรับฟังเสียงบันทึกจากยุคประวัติศาสตร์',
      playingNow: 'กำลังเล่น',
      playThis: 'เล่นแผ่นนี้',
      placeAndPlay: 'วางและเล่น',
      notesKicker: 'บันทึกข้อมูลแผ่นเสียงที่กำลังเลือก',
      provenanceLabel: 'แหล่งที่มา',
      standardRpmLabel: 'ความเร็วรอบมาตรฐาน',
      curatorNoteLabel: 'หมายเหตุภัณฑารักษ์',
    },
    timeline: {
      kicker: 'ลำดับเหตุการณ์ประวัติศาสตร์ดิจิทัล',
      heading: 'กว่าเก้าทศวรรษแห่งการสื่อสารภาครัฐไทย',
      subheading:
        'บันทึกพัฒนาการจากสำนักงานโฆษณาการ พ.ศ. 2476 สู่วิทยุกระจายเสียงแห่งประเทศไทย สถานีโทรทัศน์ช่อง 4 บางขุนพรหม และคลังหอจดหมายเหตุดิจิทัลยุคปัจจุบัน',
      viewArtifact: 'ดูเอกสารประจำยุค',
    },
    booking: {
      kicker: 'ระบบบริหารจัดการผู้เข้าชมและจองคิวหมู่คณะล่วงหน้า',
      heading: 'จองคิวเข้าชมพิพิธภัณฑ์ล่วงหน้าสำหรับหมู่คณะ',
      subheading:
        'สถานศึกษา หน่วยงานราชการ และองค์กรต่างๆ สามารถตรวจสอบความจุแต่ละรอบและลงทะเบียนจองคิวเข้าชมพร้อมวิทยากรนำชมได้ล่วงหน้า',
      tabForm: 'แบบฟอร์มจองคิวเข้าชม',
      tabList: (c) => `รายการจองคิว (${c})`,
      scheduleTitle: 'ตารางรอบเข้าชมประจำวัน',
      scheduleSubtitle: 'รองรับหมู่คณะได้สูงสุดรอบละ 40 ท่าน เพื่อคุณภาพการนำชมและดูแลวัตถุจัดแสดง',
      selectedDateLabel: 'วันที่เลือก:',
      remainingSeats: (s, m) => `ว่าง ${s} / ${m} ที่นั่ง`,
      slotFull: 'รอบนี้เต็มแล้ว',
      guidelinesTitle: 'ข้อแนะนำสำหรับการเข้าชมแบบหมู่คณะ',
      guidelines: [
        'กรุณาจองล่วงหน้าอย่างน้อย 1 วันทำการ (เปิดบริการวันจันทร์–ศุกร์ เว้นวันหยุดราชการ)',
        'คณะผู้เข้าชมควรเดินทางมาถึงโถงต้อนรับก่อนเวลารอบเข้าชม 15 นาที',
        'มีวิทยากรนำชมทั้งภาษาไทยและภาษาอังกฤษ รวมถึงทางลาดสำหรับรถเข็นทุกชั้น',
      ],
      orgLabel: 'ชื่อสถานศึกษา / หน่วยงาน / คณะผู้เข้าชม *',
      orgPlaceholder: 'เช่น คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย หรือ โรงเรียนสาธิต...',
      contactLabel: 'ชื่อผู้ประสานงาน *',
      contactPlaceholder: 'ชื่อ-นามสกุล ผู้ติดต่อหลัก',
      emailLabel: 'อีเมลติดต่อ *',
      phoneLabel: 'เบอร์โทรศัพท์ *',
      groupTypeLabel: 'ประเภทหมู่คณะ',
      groupTypes: [
        { value: 'school', label: 'สถานศึกษา / นักเรียน-นักศึกษา' },
        { value: 'government', label: 'หน่วยงานภาครัฐ / รัฐวิสาหกิจ' },
        { value: 'media', label: 'สื่อมวลชน / องค์กรเอกชน' },
        { value: 'research', label: 'คณะนักวิจัย / บุคคลทั่วไป (5 ท่านขึ้นไป)' },
      ],
      dateLabel: 'วันที่ต้องการเข้าชม (จันทร์–ศุกร์) *',
      dateHint: 'พิพิธภัณฑ์ปิดให้บริการวันเสาร์–อาทิตย์',
      slotLabel: 'รอบเวลาเข้าชม *',
      visitorsLabel: 'จำนวนผู้เข้าชม (5–40 ท่าน) *',
      visitorsUnit: 'ท่าน',
      guideLangLabel: 'ภาษาวิทยากรนำชม',
      guideLangs: [
        { value: 'th', label: 'วิทยากรภาษาไทย' },
        { value: 'en', label: 'วิทยากรภาษาอังกฤษ (English Docent)' },
        { value: 'self', label: 'เข้าชมอิสระ (Self-Guided Tour)' },
      ],
      notesLabel: 'โซนที่สนใจเป็นพิเศษ หรือความต้องการเพิ่มเติม',
      notesPlaceholder: 'ระบุความสนใจ เช่น ห้องเครื่องเล่นแผ่นเสียง, การบรรยายประวัติวิทยุ, ทางลาดรถเข็น...',
      submitBtn: 'ยืนยันการจองคิวเข้าชม',
      errRequired: 'กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน',
      errWeekend: 'กรุณาเลือกวันทำการ (วันจันทร์–วันศุกร์)',
      errCapacity: 'จำนวนผู้เข้าชมเกินที่นั่งว่างในรอบที่เลือก กรุณาเลือกรอบเวลาอื่น',
      confirmBadge: 'บันทึกการจองคิวสำเร็จ',
      confirmTitle: 'ใบยืนยันการจองคิวเข้าชมพิพิธภัณฑ์ล่วงหน้า',
      confirmRef: 'รหัสอ้างอิงการจอง',
      confirmSummaryDate: 'วันที่เข้าชม',
      confirmSummarySlot: 'รอบเวลา',
      confirmSummaryGroup: 'หน่วยงาน / คณะ',
      confirmSummaryCount: 'จำนวนผู้เข้าชม',
      confirmSummaryGuide: 'รูปแบบการนำชม',
      bookAnother: 'จองคิวเพิ่มเติม',
      printSlip: 'พิมพ์ใบยืนยัน',
      emptyBookings: 'ยังไม่มีรายการจองคิวในระบบ กรอกแบบฟอร์มเพื่อสร้างการจองใหม่',
      cancelBooking: 'ยกเลิกการจอง',
      statusConfirmed: 'ยืนยันสิทธิ์แล้ว',
    },
    location: {
      kicker: 'แผนที่ตั้งพิพิธภัณฑ์และหอจดหมายเหตุ · ย่านอารีย์สัมพันธ์',
      heading: 'การเดินทางสู่พิพิธภัณฑ์กรมประชาสัมพันธ์ (ซอยอารีย์สัมพันธ์)',
      subheading:
        'ตรวจสอบตำแหน่งที่ตั้งจริงของอาคารกรมประชาสัมพันธ์ ซอยอารีย์สัมพันธ์ ถนนพระรามที่ 6 พร้อมสถานีรถไฟฟ้าและจุดเชื่อมต่อการเดินทางใกล้เคียงบนแผนที่แบบโต้ตอบ',
      premisesTitle: 'ตำแหน่งที่ตั้งพิพิธภัณฑ์',
      premisesSubtitle: 'ข้อมูลพิกัดและเวลาทำการจาก Google Maps Platform',
      transitTitle: 'สถานีขนส่งสาธารณะใกล้เคียง',
      transitSubtitle: 'แตะเพื่อเลื่อนแผนที่ไปยังสถานีรถไฟฟ้าและจุดเชื่อมต่อในย่านอารีย์',
      loadingMap: 'กำลังเชื่อมต่อแผนที่ Google Maps...',
      loadingPlaces: 'กำลังค้นหาตำแหน่งอาคารกรมประชาสัมพันธ์และจุดขนส่งใกล้เคียง...',
      errorTitle: 'ไม่สามารถโหลดข้อมูลแผนที่แบบโต้ตอบได้ในขณะนี้',
      errorDesc: 'คุณยังสามารถเปิดดูเส้นทางมายังซอยอารีย์สัมพันธ์บน Google Maps ได้โดยตรง',
      missingKeyTitle: 'ยังไม่ได้ตั้งค่าคีย์แผนที่ (VITE_GOOGLE_MAPS_API_KEY)',
      missingKeyDesc: 'เปิดดูเส้นทางมายังกรมประชาสัมพันธ์ ซอยอารีย์สัมพันธ์ บน Google Maps ได้โดยตรง',
      centerMuseumBtn: 'โฟกัสที่พิพิธภัณฑ์',
      fitAreaBtn: 'ภาพรวมย่านอารีย์สัมพันธ์',
      openMapsBtn: 'เปิดใน Google Maps',
      directionsBtn: 'ขอเส้นทางเดินทาง',
      addressLabel: 'ที่อยู่ตามทะเบียน Google Maps',
      phoneLabel: 'โทรศัพท์',
      hoursLabel: 'เวลาทำการ',
      transitEmpty: 'ไม่พบข้อมูลสถานีใกล้เคียงในรัศมีที่กำหนด',
      attributionLabel: 'ที่มาข้อมูล:',
      primaryBadge: 'พิพิธภัณฑ์',
      transitBadge: 'ขนส่งมวลชน',
      retryBtn: 'โหลดแผนที่อีกครั้ง',
    },
    footer: {
      title: 'พิพิธภัณฑ์และหอจดหมายเหตุกรมประชาสัมพันธ์',
      address: 'เลขที่ 9 ซอยอารีย์สัมพันธ์ ถนนพระรามที่ 6 แขวงพญาไท เขตพญาไท กรุงเทพมหานคร 10400',
      hours: 'เปิดบริการสืบค้นจดหมายเหตุและเข้าชมนิทรรศการวันจันทร์–ศุกร์ เวลา 09:00–16:30 น.',
      copyright: '© พิพิธภัณฑ์และหอจดหมายเหตุกรมประชาสัมพันธ์ · คลังประวัติศาสตร์ดิจิทัลแห่งชาติ',
      shareBtn: 'แชร์เว็บไซต์นี้',
      copiedBtn: 'คัดลอกลิงก์แชร์แล้ว',
      exportHtmlBtn: 'ดาวน์โหลดไฟล์ HTML',
      exportingHtmlBtn: 'กำลังสร้างไฟล์ HTML...',
      exportedHtmlBtn: 'ดาวน์โหลดไฟล์ .html แล้ว',
    },
    miniBar: {
      regionLabel: 'ตัวควบคุมเครื่องเล่นแผ่นเสียงแบบย่อ',
      jumpTitle: 'ไปยังเครื่องเล่นแผ่นเสียง',
      pauseLabel: 'หยุดเล่นแผ่นเสียง',
      playLabel: 'เล่นแผ่นเสียงต่อ',
      closeLabel: 'ปิดแถบเครื่องเล่น',
    },
  },
  en: {
    brand: 'PRD Museum & Archives',
    nav: {
      search: 'Archives',
      museum3d: '3D Gallery',
      turntable: 'Turntable',
      history: 'Timeline',
      booking: 'Group Visit',
      location: 'Location Map',
      ctaBooking: 'Book Group Visit',
    },
    hero: {
      kicker: 'Digital History & National Broadcasting Archive · Est. 1933 (B.E. 2476)',
      title: 'Public Relations Department Museum & Archives',
      description:
        'Preserving nine decades of Thailand’s public communication heritage. Search primary archival manuscripts, historic studio photography, early radio and television hardware, tour the 3D virtual gallery, and play real synthesized audio from historical vinyl and shellac discs.',
      ctaSearch: 'Search Archives',
      cta3d: 'Explore 3D Hall',
      ctaTurntable: 'Play Vinyl Records',
      ctaBooking: 'Book Group Visit',
      figureCaption:
        'Fig. 1 — Main exhibition gallery housing archival vitrines and pioneer broadcasting microphones.',
      langLabel: 'Language',
    },
    utilityStrip: {
      hoursLabel: 'Museum Visiting Hours',
      hoursValue: 'Mon–Fri · 09:00–16:30',
      hoursSub: 'Free admission & advance group tours',
      archiveLabel: 'Digitized Collection',
      archiveValue: (c) => `${c} Core Records · 1933–Present`,
      archiveSub: 'Proclamations, photographs & artifacts',
      virtualLabel: '3D Virtual Exhibition',
      virtualValue: '4 Curated Hall Zones',
      virtualSub: 'Responsive on desktop, tablet & mobile',
      vinylLabel: 'Historical Disc Library',
      vinylValue: (c) => `${c} Discs · 33⅓ / 45 / 78 RPM`,
      vinylSub: 'Interactive tonearm & live playback',
    },
    search: {
      kicker: 'Digitized Manuscripts, Photography & Broadcast Artifacts',
      heading: 'Archival Search & Institutional Catalog',
      subheading:
        'Search original proclamations, historical studio photographs, broadcasting hardware, and phonograph discs by keyword, accession number, or era.',
      countPrefix: 'Showing',
      countMid: 'of',
      countSuffix: 'items',
      placeholder: 'Search keywords e.g. 2476, Channel 4, Vinyl, Microphone, PRD-...',
      clearLabel: 'Clear search',
      eraLabel: 'Era:',
      allEras: 'All Eras',
      allCategories: 'All',
      quickSuggest: 'Suggested:',
      quickTags: ['2476', 'Channel 4', 'Shellac', 'Microphone', 'ASEAN'],
      emptyTitle: 'No archival records matched your query',
      emptyDesc: 'Try a different keyword or reset the filters to view the complete collection.',
      resetBtn: 'Show All Records',
      openDoc: 'Inspect Record',
      playVinyl: 'Play Vinyl',
      view3d: 'View in 3D',
      yearPrefix: 'B.E.',
    },
    modal: {
      closeLabel: 'Close accession detail view',
      zoomIn: 'Zoom Specimen',
      zoomOut: 'Reset Zoom',
      transcriptionTitle: 'Archival Excerpt & Curatorial Note',
      category: 'Category',
      creator: 'Creator / Division',
      medium: 'Medium & Technique',
      dimensions: 'Dimensions',
      provenance: 'Provenance',
      playOnTurntable: 'Load & Play on Analog Turntable',
      viewIn3d: 'Locate Exhibit in 3D Gallery',
    },
    museum3d: {
      kicker: 'Interactive 3D Virtual Exhibition',
      heading: '3D Virtual Broadcasting & Archive Hall',
      instructions: 'Drag to orbit · Scroll or pinch to zoom · Click any pedestal to inspect',
      fallbackTitle: '3D hardware acceleration is unavailable on this browser',
      fallbackDesc: 'You can still search all archival documents and play the vinyl turntable below.',
      hoverPrefix: 'Exhibit:',
      hideDock: 'Hide Controls (Zen Mode)',
      showDock: 'Show 3D Controls',
      resetCamera: 'Reset Camera',
      playVinyl: 'Play Record Audio',
      openRecord: 'Read Archival Dossier',
    },
    turntable: {
      kicker: 'Historical Audio Studio & Analog Phonograph',
      heading: 'Listen on the Interactive Analog Turntable',
      subheading:
        'Select an archival shellac or vinyl LP from the PRD collection, drop the tonearm onto the platter, switch RPM speeds, and drag directly across the record grooves to cue any section.',
      platterLabel: 'Platter:',
      regLabel: 'Catalog:',
      spinning: 'SPINNING',
      stopped: 'STOPPED',
      needleDown: 'STYLUS DOWN',
      needleUp: 'CUED UP',
      sliderAria: 'Tonearm groove position across the record',
      seekAria: 'Seek record playback progress',
      realSpeed: 'Playback Ratio:',
      nativeSpeed: 'Native',
      stopBtn: 'Stop Platter',
      playBtn: 'Start Platter',
      liftNeedle: 'Lift Tonearm',
      dropNeedle: 'Drop Needle',
      restartBtn: 'Restart',
      speedLabel: 'RPM Speed',
      volumeLabel: 'Volume',
      crackleLabel: 'Vinyl Warmth',
      shelfTitle: (c) => `Archival Record Shelf (${c} Discs)`,
      shelfSubtitle: 'Choose a historical disc to place onto the turntable platter.',
      playingNow: 'Playing',
      playThis: 'Play Disc',
      placeAndPlay: 'Load & Play',
      notesKicker: 'Selected Disc Liner Notes',
      provenanceLabel: 'Provenance',
      standardRpmLabel: 'Native Speed',
      curatorNoteLabel: 'Curator Note',
    },
    timeline: {
      kicker: 'Chronological Digital History',
      heading: 'Nine Decades of Public Communication in Thailand',
      subheading:
        'Tracing the evolution from the 1933 Publicity Bureau to National Radio Broadcasting, Channel 4 Bang Khun Phrom Television, and today’s open digital archive.',
      viewArtifact: 'Inspect Milestone',
    },
    booking: {
      kicker: 'Visitor Management & Advance Scheduling',
      heading: 'Advance Group Visit Reservation',
      subheading:
        'Schools, universities, government agencies, and media delegations can check real-time slot availability and reserve guided museum visits in advance.',
      tabForm: 'Reservation Form',
      tabList: (c) => `My Reservations (${c})`,
      scheduleTitle: 'Daily Guided Tour Schedule',
      scheduleSubtitle: 'Each session accommodates up to 40 visitors to preserve gallery comfort and archival care.',
      selectedDateLabel: 'Selected Date:',
      remainingSeats: (s, m) => `${s} / ${m} seats available`,
      slotFull: 'Session Full',
      guidelinesTitle: 'Group Visiting Guidelines',
      guidelines: [
        'Please book at least 1 business day in advance (open Monday–Friday, excluding public holidays).',
        'Delegations are kindly asked to arrive at the main reception hall 15 minutes prior to their slot.',
        'Thai and English docent-led tours as well as step-free wheelchair access are available.',
      ],
      orgLabel: 'School / Organization / Group Name *',
      orgPlaceholder: 'e.g., Faculty of Communication Arts, Chulalongkorn University...',
      contactLabel: 'Coordinator Name *',
      contactPlaceholder: 'Full name of primary contact',
      emailLabel: 'Contact Email *',
      phoneLabel: 'Phone Number *',
      groupTypeLabel: 'Visitor Category',
      groupTypes: [
        { value: 'school', label: 'Educational Institution / Students' },
        { value: 'government', label: 'Government Agency / Public Sector' },
        { value: 'media', label: 'Media Organization / Private Delegation' },
        { value: 'research', label: 'Researchers / General Group (5+ guests)' },
      ],
      dateLabel: 'Preferred Visit Date (Mon–Fri) *',
      dateHint: 'Closed on Saturdays & Sundays',
      slotLabel: 'Preferred Time Slot *',
      visitorsLabel: 'Number of Visitors (5–40 guests) *',
      visitorsUnit: 'guests',
      guideLangLabel: 'Tour Guidance Preference',
      guideLangs: [
        { value: 'th', label: 'Thai Docent Guided Tour' },
        { value: 'en', label: 'English Docent Guided Tour' },
        { value: 'self', label: 'Self-Guided Museum Visit' },
      ],
      notesLabel: 'Special Focus Zones or Accessibility Requests',
      notesPlaceholder: 'e.g., Phonograph studio demonstration, Channel 4 history briefing, wheelchair access...',
      submitBtn: 'Confirm Group Reservation',
      errRequired: 'Please complete all required fields marked with *.',
      errWeekend: 'Please select a weekday (Monday–Friday).',
      errCapacity: 'Requested group size exceeds remaining seats for this slot. Please select another round.',
      confirmBadge: 'Reservation Confirmed',
      confirmTitle: 'Official Group Visit Confirmation Slip',
      confirmRef: 'Booking Reference',
      confirmSummaryDate: 'Visit Date',
      confirmSummarySlot: 'Time Slot',
      confirmSummaryGroup: 'Organization',
      confirmSummaryCount: 'Group Size',
      confirmSummaryGuide: 'Tour Format',
      bookAnother: 'Make Another Booking',
      printSlip: 'Print Confirmation',
      emptyBookings: 'No reservations recorded yet. Submit the form to reserve a group tour.',
      cancelBooking: 'Cancel Booking',
      statusConfirmed: 'Confirmed',
    },
    location: {
      kicker: 'Museum Premises & Transit Guide · Ari Samphan',
      heading: 'Locate the PRD Museum in the Ari Samphan Area',
      subheading:
        'Explore the physical museum grounds at the Public Relations Department on Soi Ari Samphan, Rama VI Road, along with nearby BTS and transit connections on an interactive map.',
      premisesTitle: 'Museum Grounds',
      premisesSubtitle: 'Live place details grounded via Google Maps Platform',
      transitTitle: 'Nearby Public Transit',
      transitSubtitle: 'Select a station to inspect its position relative to Ari Samphan',
      loadingMap: 'Loading interactive Google Map...',
      loadingPlaces: 'Locating PRD Ari Samphan premises and nearby transit stations...',
      errorTitle: 'Interactive map is currently unavailable',
      errorDesc: 'You can still open turn-by-turn directions to Soi Ari Samphan directly in Google Maps.',
      missingKeyTitle: 'Google Maps API key is not configured',
      missingKeyDesc: 'Open directions to the Public Relations Department in Soi Ari Samphan directly on Google Maps.',
      centerMuseumBtn: 'Focus Museum',
      fitAreaBtn: 'View Ari Area',
      openMapsBtn: 'Open in Google Maps',
      directionsBtn: 'Get Directions',
      addressLabel: 'Verified Address',
      phoneLabel: 'Telephone',
      hoursLabel: 'Opening Hours',
      transitEmpty: 'No transit stations returned within the search radius.',
      attributionLabel: 'Attribution:',
      primaryBadge: 'Museum',
      transitBadge: 'Transit',
      retryBtn: 'Retry Map',
    },
    footer: {
      title: 'Public Relations Department Museum & Archives',
      address: '9 Soi Ari Samphan, Rama VI Road, Phaya Thai, Bangkok 10400, Thailand',
      hours: 'Open Monday–Friday, 09:00–16:30 (Admission Free)',
      copyright: '© PRD Museum & Archives · National Digital Broadcasting Heritage',
      shareBtn: 'Share Website',
      copiedBtn: 'Link Copied',
      exportHtmlBtn: 'Download HTML File',
      exportingHtmlBtn: 'Generating HTML...',
      exportedHtmlBtn: 'HTML Downloaded',
    },
    miniBar: {
      regionLabel: 'Compact turntable player control',
      jumpTitle: 'Jump to turntable',
      pauseLabel: 'Pause vinyl playback',
      playLabel: 'Resume vinyl playback',
      closeLabel: 'Dismiss mini player',
    },
  },
};
