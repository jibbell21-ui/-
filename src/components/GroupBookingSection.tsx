import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Printer,
  Trash2,
  Users,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

export interface TimeSlotOption {
  id: 'morning' | 'afternoon1' | 'afternoon2';
  timeRange: string;
  labelTh: string;
  labelEn: string;
  maxCapacity: number;
}

export const TOUR_SLOTS: TimeSlotOption[] = [
  {
    id: 'morning',
    timeRange: '09:30–11:00',
    labelTh: 'รอบเช้า (09:30–11:00 น.)',
    labelEn: 'Morning Session (09:30–11:00)',
    maxCapacity: 40,
  },
  {
    id: 'afternoon1',
    timeRange: '13:00–14:30',
    labelTh: 'รอบบ่าย 1 (13:00–14:30 น.)',
    labelEn: 'Afternoon Session I (13:00–14:30)',
    maxCapacity: 40,
  },
  {
    id: 'afternoon2',
    timeRange: '14:45–16:15',
    labelTh: 'รอบบ่าย 2 (14:45–16:15 น.)',
    labelEn: 'Afternoon Session II (14:45–16:15)',
    maxCapacity: 40,
  },
];

export interface GroupReservation {
  id: string;
  referenceCode: string;
  organization: string;
  contactName: string;
  email: string;
  phone: string;
  groupType: string;
  visitDate: string;
  slotId: TimeSlotOption['id'];
  visitorCount: number;
  guideLang: string;
  notes: string;
  createdAt: string;
}

const STORAGE_KEY = 'prd_museum_group_bookings_v1';

function getNextWeekdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function isWeekend(isoDate: string): boolean {
  if (!isoDate) return false;
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const day = dt.getDay();
  return day === 0 || day === 6;
}

interface GroupBookingSectionProps {
  lang: Language;
}

export const GroupBookingSection: React.FC<GroupBookingSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].booking;

  const [reservations, setReservations] = useState<GroupReservation[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as GroupReservation[]) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [confirmedSlip, setConfirmedSlip] = useState<GroupReservation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Controlled Form State
  const [organization, setOrganization] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [groupType, setGroupType] = useState('school');
  const [visitDate, setVisitDate] = useState(getNextWeekdayISO);
  const [slotId, setSlotId] = useState<TimeSlotOption['id']>('morning');
  const [visitorCount, setVisitorCount] = useState(20);
  const [guideLang, setGuideLang] = useState<string>(lang);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch {
      // ignore storage quota errors
    }
  }, [reservations]);

  const slotAvailability = useMemo(() => {
    const map: Record<TimeSlotOption['id'], number> = {
      morning: 40,
      afternoon1: 40,
      afternoon2: 40,
    };
    reservations.forEach((r) => {
      if (r.visitDate === visitDate) {
        map[r.slotId] = Math.max(0, map[r.slotId] - r.visitorCount);
      }
    });
    return map;
  }, [reservations, visitDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!organization.trim() || !contactName.trim() || !email.trim() || !phone.trim() || !visitDate) {
      setErrorMsg(t.errRequired);
      return;
    }

    if (isWeekend(visitDate)) {
      setErrorMsg(t.errWeekend);
      return;
    }

    const remaining = slotAvailability[slotId];
    if (visitorCount > remaining) {
      setErrorMsg(t.errCapacity);
      return;
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newBooking: GroupReservation = {
      id: `${Date.now()}-${randomCode}`,
      referenceCode: `PRD-GRP-${visitDate.replaceAll('-', '').slice(2)}-${randomCode}`,
      organization: organization.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      groupType,
      visitDate,
      slotId,
      visitorCount,
      guideLang,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    setReservations((prev) => [newBooking, ...prev]);
    setConfirmedSlip(newBooking);
    setOrganization('');
    setContactName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  const handleCancelReservation = (id: string) => {
    setReservations((prev) => prev.filter((item) => item.id !== id));
    if (confirmedSlip?.id === id) {
      setConfirmedSlip(null);
    }
  };

  const getSlotLabel = (id: TimeSlotOption['id']) => {
    const found = TOUR_SLOTS.find((s) => s.id === id);
    if (!found) return id;
    return lang === 'th' ? found.labelTh : found.labelEn;
  };

  const getGuideLabel = (val: string) => {
    const found = t.guideLangs.find((g) => g.value === val);
    return found ? found.label : val;
  };

  const getGroupTypeLabel = (val: string) => {
    const found = t.groupTypes.find((g) => g.value === val);
    return found ? found.label : val;
  };

  const todayMin = new Date().toISOString().split('T')[0];

  return (
    <section
      id="booking"
      aria-labelledby="booking-heading"
      className="border-t border-[#E4E0D8] bg-[#F3F1EC] py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-4 border-b border-[#DCD7CD] pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-[#1E3A8A]">{t.kicker}</p>
            <h2
              id="booking-heading"
              className="text-balance mt-2 text-3xl font-semibold tracking-tight text-[#141413] sm:text-4xl"
            >
              {t.heading}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#4A4843]">{t.subheading}</p>
          </div>

          {/* Segmented Mode Switch: Reservation Form | My Reservations */}
          <div
            className="inline-flex self-start rounded-lg bg-[#E4E0D8] p-1 md:self-auto"
            role="tablist"
            aria-label={t.heading}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'form'}
              onClick={() => setActiveTab('form')}
              className={`min-h-[40px] rounded-md px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'form'
                  ? 'bg-white text-[#141413] shadow-sm'
                  : 'text-[#57534E] hover:text-[#141413]'
              }`}
            >
              {t.tabForm}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'list'}
              onClick={() => setActiveTab('list')}
              className={`min-h-[40px] rounded-md px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                activeTab === 'list'
                  ? 'bg-white text-[#141413] shadow-sm'
                  : 'text-[#57534E] hover:text-[#141413]'
              }`}
            >
              {t.tabList(reservations.length)}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left 5 cols: Live Daily Schedule & Visiting Guidelines */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-xl border border-[#DDD8CE] bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#141413]">{t.scheduleTitle}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#57534E]">
                    {t.scheduleSubtitle}
                  </p>
                </div>
                <CalendarDays className="h-5 w-5 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
              </div>

              <div className="mt-4 flex items-center justify-between border-y border-[#ECE8E0] py-2.5 text-xs">
                <span className="text-[#6B665E]">{t.selectedDateLabel}</span>
                <span className="font-mono font-medium tabular-nums text-[#141413]">
                  {visitDate}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {TOUR_SLOTS.map((slot) => {
                  const seatsLeft = slotAvailability[slot.id];
                  const isSelected = slotId === slot.id;
                  const isFull = seatsLeft === 0;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isFull}
                      onClick={() => {
                        setSlotId(slot.id);
                        setActiveTab('form');
                      }}
                      className={`w-full rounded-lg border p-3.5 text-left transition-colors ${
                        isFull
                          ? 'cursor-not-allowed border-[#E4E0D8] bg-[#FAF9F6] opacity-60'
                          : isSelected
                          ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
                          : 'border-[#E4E0D8] bg-white hover:border-[#C8BFB0]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-sm font-semibold text-[#141413]">
                          <Clock className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                          <span>{lang === 'th' ? slot.labelTh : slot.labelEn}</span>
                        </span>
                        <span
                          className={`font-mono text-xs tabular-nums ${
                            isFull ? 'font-semibold text-[#B91C1C]' : 'text-[#14532D]'
                          }`}
                        >
                          {isFull
                            ? t.slotFull
                            : t.remainingSeats(seatsLeft, slot.maxCapacity)}
                        </span>
                      </div>
                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#ECE8E0]">
                        <div
                          className="h-full bg-[#1E3A8A] transition-all duration-200"
                          style={{
                            width: `${((slot.maxCapacity - seatsLeft) / slot.maxCapacity) * 100}%`,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-[#DDD8CE] bg-white p-5 sm:p-6">
              <h3 className="text-base font-semibold text-[#141413]">{t.guidelinesTitle}</h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#4A4843]">
                {t.guidelines.map((line, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1 font-mono text-xs font-semibold text-[#926C2C]">
                      0{i + 1}.
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-[#ECE8E0] pt-3">
                <a
                  href="#location"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E3A8A] hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{TRANSLATIONS[lang].nav.location} · Ari Samphan</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right 7 cols: Reservation Form / Confirmation Slip / Saved List */}
          <div className="lg:col-span-7">
            {activeTab === 'list' ? (
              <div className="rounded-xl border border-[#DDD8CE] bg-white p-5 sm:p-7">
                {reservations.length === 0 ? (
                  <div className="py-12 text-center">
                    <Users className="mx-auto h-8 w-8 text-[#A8A29E]" aria-hidden="true" />
                    <p className="mt-3 text-sm text-[#57534E]">{t.emptyBookings}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('form')}
                      className="mt-5 inline-flex min-h-[42px] items-center rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-medium text-white hover:bg-[#1E40AF]"
                    >
                      {t.tabForm}
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#ECE8E0]">
                    {reservations.map((item) => (
                      <div key={item.id} className="py-5 first:pt-0 last:pb-0">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#57534E]">
                              <span className="font-mono font-semibold text-[#1E3A8A]">
                                {item.referenceCode}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-medium text-[#14532D]">
                                {t.statusConfirmed}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{getGroupTypeLabel(item.groupType)}</span>
                            </div>

                            <h4 className="mt-1.5 text-base font-semibold text-[#141413]">
                              {item.organization}
                            </h4>
                            <p className="mt-1 text-xs text-[#4A4843]">
                              {item.contactName} · {item.phone} · {item.email}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#141413]">
                              <span className="font-mono tabular-nums">{item.visitDate}</span>
                              <span aria-hidden="true">/</span>
                              <span>{getSlotLabel(item.slotId)}</span>
                              <span aria-hidden="true">/</span>
                              <span className="font-semibold tabular-nums">
                                {item.visitorCount} {t.visitorsUnit}
                              </span>
                              <span aria-hidden="true">/</span>
                              <span>{getGuideLabel(item.guideLang)}</span>
                            </div>
                            {item.notes && (
                              <p className="mt-1.5 text-xs italic text-[#57534E]">{item.notes}</p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCancelReservation(item.id)}
                            className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-md border border-[#E4E0D8] px-3 py-1.5 text-xs font-medium text-[#991B1B] hover:bg-[#FEF2F2] whitespace-nowrap"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{t.cancelBooking}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : confirmedSlip ? (
              <div className="rounded-xl border border-[#C8BFB0] bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#14532D]">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  <span>{t.confirmBadge}</span>
                </div>

                <h3 className="mt-2 text-2xl font-semibold text-[#141413]">
                  {t.confirmTitle}
                </h3>

                <div className="mt-5 rounded-lg border border-[#E4E0D8] bg-[#FAF9F6] p-4">
                  <p className="text-xs text-[#6B665E]">{t.confirmRef}</p>
                  <p className="mt-1 font-mono text-xl font-semibold tracking-wider text-[#1E3A8A] tabular-nums">
                    {confirmedSlip.referenceCode}
                  </p>
                </div>

                <dl className="mt-5 divide-y divide-[#ECE8E0] text-sm">
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-[#6B665E]">{t.confirmSummaryGroup}</dt>
                    <dd className="text-right font-semibold text-[#141413]">
                      {confirmedSlip.organization}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-[#6B665E]">{t.confirmSummaryDate}</dt>
                    <dd className="font-mono tabular-nums text-[#141413]">
                      {confirmedSlip.visitDate}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-[#6B665E]">{t.confirmSummarySlot}</dt>
                    <dd className="text-right font-medium text-[#141413]">
                      {getSlotLabel(confirmedSlip.slotId)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-[#6B665E]">{t.confirmSummaryCount}</dt>
                    <dd className="font-mono font-semibold tabular-nums text-[#141413]">
                      {confirmedSlip.visitorCount} {t.visitorsUnit}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <dt className="text-[#6B665E]">{t.confirmSummaryGuide}</dt>
                    <dd className="text-right text-[#141413]">
                      {getGuideLabel(confirmedSlip.guideLang)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#C8BFB0] bg-white px-4 py-2 text-sm font-medium text-[#141413] hover:bg-[#F4F1EA]"
                  >
                    <Printer className="h-4 w-4" aria-hidden="true" />
                    <span>{t.printSlip}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmedSlip(null)}
                    className="inline-flex min-h-[44px] items-center rounded-md bg-[#1E3A8A] px-5 py-2 text-sm font-medium text-white hover:bg-[#1E40AF]"
                  >
                    {t.bookAnother}
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-xl border border-[#DDD8CE] bg-white p-5 sm:p-7"
              >
                {errorMsg && (
                  <div
                    role="alert"
                    className="mb-5 flex items-start gap-2.5 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-3.5 text-sm text-[#991B1B]"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="booking-org"
                      className="block text-xs font-medium text-[#141413]"
                    >
                      {t.orgLabel}
                    </label>
                    <input
                      id="booking-org"
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={t.orgPlaceholder}
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3.5 py-2 text-sm text-[#141413] placeholder:text-[#78716C] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-contact"
                      className="block text-xs font-medium text-[#141413]"
                    >
                      {t.contactLabel}
                    </label>
                    <input
                      id="booking-contact"
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={t.contactPlaceholder}
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3.5 py-2 text-sm text-[#141413] placeholder:text-[#78716C] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-type"
                      className="block text-xs font-medium text-[#141413]"
                    >
                      {t.groupTypeLabel}
                    </label>
                    <select
                      id="booking-type"
                      value={groupType}
                      onChange={(e) => setGroupType(e.target.value)}
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#141413] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    >
                      {t.groupTypes.map((gt) => (
                        <option key={gt.value} value={gt.value}>
                          {gt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-email"
                      className="block text-xs font-medium text-[#141413]"
                    >
                      {t.emailLabel}
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.ac.th"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3.5 py-2 text-sm text-[#141413] placeholder:text-[#78716C] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-phone"
                      className="block text-xs font-medium text-[#141413]"
                    >
                      {t.phoneLabel}
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="02-618-2323"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3.5 py-2 text-sm text-[#141413] placeholder:text-[#78716C] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-date"
                      className="block text-xs font-medium text-[#141413]"
                    >
                      {t.dateLabel}
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      required
                      min={todayMin}
                      value={visitDate}
                      onChange={(e) => {
                        setVisitDate(e.target.value);
                        if (isWeekend(e.target.value)) {
                          setErrorMsg(t.errWeekend);
                        } else {
                          setErrorMsg(null);
                        }
                      }}
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3.5 py-2 font-mono text-sm tabular-nums text-[#141413] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-[#6B665E]">{t.dateHint}</p>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-slot"
                      className="block text-xs font-medium text-[#141413]"
                    >
                      {t.slotLabel}
                    </label>
                    <select
                      id="booking-slot"
                      value={slotId}
                      onChange={(e) => setSlotId(e.target.value as TimeSlotOption['id'])}
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#141413] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    >
                      {TOUR_SLOTS.map((s) => (
                        <option key={s.id} value={s.id} disabled={slotAvailability[s.id] === 0}>
                          {lang === 'th' ? s.labelTh : s.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-visitors"
                      className="block text-xs font-medium text-[#141413]"
                    >
                      {t.visitorsLabel}
                    </label>
                    <input
                      id="booking-visitors"
                      type="number"
                      min={5}
                      max={40}
                      required
                      value={visitorCount}
                      onChange={(e) =>
                        setVisitorCount(Math.max(1, Math.min(40, Number(e.target.value) || 5)))
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3.5 py-2 font-mono text-sm tabular-nums text-[#141413] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-guide"
                      className="block text-xs font-medium text-[#141413]"
                    >
                      {t.guideLangLabel}
                    </label>
                    <select
                      id="booking-guide"
                      value={guideLang}
                      onChange={(e) => setGuideLang(e.target.value)}
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#141413] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    >
                      {t.guideLangs.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="booking-notes"
                      className="block text-xs font-medium text-[#141413]"
                    >
                      {t.notesLabel}
                    </label>
                    <textarea
                      id="booking-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t.notesPlaceholder}
                      className="mt-1.5 w-full rounded-lg border border-[#D6D0C4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#141413] placeholder:text-[#78716C] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end border-t border-[#ECE8E0] pt-5">
                  <button
                    type="submit"
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#1E3A8A] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
                  >
                    <span>{t.submitBtn}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
