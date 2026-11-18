/// <reference types="google.maps" />
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Clock,
  Compass,
  ExternalLink,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  TrainFront,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

const GMP_ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

interface ResolvedPlaceData {
  id: string;
  displayName: string;
  formattedAddress: string;
  location: google.maps.LatLngLiteral;
  viewport?: google.maps.LatLngBounds | null;
  googleMapsURI?: string | null;
  nationalPhoneNumber?: string | null;
  weekdayDescriptions?: string[];
  primaryTypeDisplayName?: string | null;
  attributions?: Array<{ provider: string; providerURI: string | null }>;
  isPrimary?: boolean;
}

function isQuotaError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('QuotaExceededError') ||
    msg.includes('OverQuotaMapError') ||
    msg.includes('429')
  );
}

function serializePlace(
  place: google.maps.places.Place,
  isPrimary = false
): ResolvedPlaceData | null {
  if (!place.location) return null;
  const lat =
    typeof place.location.lat === 'function' ? place.location.lat() : Number(place.location.lat);
  const lng =
    typeof place.location.lng === 'function' ? place.location.lng() : Number(place.location.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    id: place.id,
    displayName: place.displayName || '',
    formattedAddress: place.formattedAddress || '',
    location: { lat, lng },
    viewport: place.viewport ?? null,
    googleMapsURI: place.googleMapsURI ?? null,
    nationalPhoneNumber: place.nationalPhoneNumber ?? null,
    weekdayDescriptions: place.regularOpeningHours?.weekdayDescriptions ?? [],
    primaryTypeDisplayName: place.primaryTypeDisplayName ?? null,
    attributions:
      place.attributions?.map((a) => ({
        provider: a.provider ?? '',
        providerURI: a.providerURI ?? null,
      })) ?? [],
    isPrimary,
  };
}

interface PlaceMarkerProps {
  place: ResolvedPlaceData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
  lang: Language;
}

const PlaceMarkerWithInfoWindow: React.FC<PlaceMarkerProps> = ({
  place,
  isSelected,
  onSelect,
  onClose,
  lang,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const t = TRANSLATIONS[lang].location;

  const directionsHref = place.id
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        place.displayName || `${place.location.lat},${place.location.lng}`
      )}&destination_place_id=${encodeURIComponent(place.id)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={place.location}
        title={place.displayName}
        zIndex={place.isPrimary ? 20 : 10}
        onClick={() => onSelect(place.id)}
      >
        {place.isPrimary ? (
          <Pin
            background="#1E3A8A"
            borderColor="#0F172A"
            glyphColor="#F8F7F4"
            glyphText="PRD"
            scale={1.2}
          />
        ) : (
          <Pin background="#926C2C" borderColor="#5C4216" glyphColor="#FFFFFF" scale={0.95} />
        )}
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow anchor={marker} maxWidth={290} onCloseClick={onClose}>
          <div className="p-1 text-[#141413]">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#1E3A8A]">
              {place.isPrimary
                ? t.primaryBadge
                : place.primaryTypeDisplayName || t.transitBadge}
            </p>
            <h4 className="mt-0.5 text-sm font-semibold leading-snug text-[#141413]">
              {place.displayName}
            </h4>
            {place.formattedAddress && (
              <p className="mt-1 text-xs leading-relaxed text-[#4A4843]">
                {place.formattedAddress}
              </p>
            )}
            <div className="mt-2.5 flex flex-wrap items-center gap-3 border-t border-[#E4E0D8] pt-2 text-xs">
              {place.googleMapsURI && (
                <a
                  href={place.googleMapsURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[#1E3A8A] hover:underline"
                >
                  <span>{t.openMapsBtn}</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#926C2C] hover:underline"
              >
                <Navigation className="h-3 w-3" aria-hidden="true" />
                <span>{t.directionsBtn}</span>
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

interface InteractiveMapCanvasProps {
  lang: Language;
  museumPlace: ResolvedPlaceData;
  transitPlaces: ResolvedPlaceData[];
  selectedPlaceId: string | null;
  onSelectPlace: (id: string | null) => void;
}

const InteractiveMapCanvas: React.FC<InteractiveMapCanvasProps> = ({
  lang,
  museumPlace,
  transitPlaces,
  selectedPlaceId,
  onSelectPlace,
}) => {
  const map = useMap();
  const coreLib = useMapsLibrary('core');
  const t = TRANSLATIONS[lang].location;

  const allPlaces = useMemo(
    () => [museumPlace, ...transitPlaces],
    [museumPlace, transitPlaces]
  );

  const handleFocusMuseum = useCallback(() => {
    if (!map) return;
    map.panTo(museumPlace.location);
    map.setZoom(16);
    onSelectPlace(museumPlace.id);
  }, [map, museumPlace, onSelectPlace]);

  const handleFitArea = useCallback(() => {
    if (!map || !coreLib) return;
    const bounds = new coreLib.LatLngBounds();
    allPlaces.forEach((p) => bounds.extend(p.location));
    map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
  }, [map, coreLib, allPlaces]);

  useEffect(() => {
    if (!map || !selectedPlaceId) return;
    const target = allPlaces.find((p) => p.id === selectedPlaceId);
    if (target) {
      map.panTo(target.location);
    }
  }, [map, selectedPlaceId, allPlaces]);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-[#DDD8CE] bg-[#E8E4DA] sm:h-[500px]">
      <GoogleMap
        defaultCenter={museumPlace.location}
        defaultZoom={16}
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={GMP_ATTRIBUTION_IDS}
        gestureHandling="cooperative"
        mapTypeControl={true}
        streetViewControl={true}
        fullscreenControl={true}
        style={{ width: '100%', height: '100%' }}
        onClick={() => onSelectPlace(null)}
      >
        {allPlaces.map((place) => (
          <PlaceMarkerWithInfoWindow
            key={place.id}
            place={place}
            isSelected={selectedPlaceId === place.id}
            onSelect={(id) => onSelectPlace(id)}
            onClose={() => onSelectPlace(null)}
            lang={lang}
          />
        ))}
      </GoogleMap>

      {/* Bottom-left Quick Camera Controls */}
      <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleFocusMuseum}
          className="pointer-events-auto inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-[#C8BFB0] bg-white/95 px-3 py-1.5 text-xs font-medium text-[#141413] shadow-sm transition-colors hover:bg-[#FAF9F6]"
        >
          <LocateFixed className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
          <span>{t.centerMuseumBtn}</span>
        </button>

        {transitPlaces.length > 0 && (
          <button
            type="button"
            onClick={handleFitArea}
            className="pointer-events-auto inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-[#C8BFB0] bg-white/95 px-3 py-1.5 text-xs font-medium text-[#141413] shadow-sm transition-colors hover:bg-[#FAF9F6]"
          >
            <Compass className="h-3.5 w-3.5 text-[#926C2C]" aria-hidden="true" />
            <span>{t.fitAreaBtn}</span>
          </button>
        )}
      </div>
    </div>
  );
};

interface GroundedMuseumExplorerProps {
  lang: Language;
}

const GroundedMuseumExplorer: React.FC<GroundedMuseumExplorerProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].location;
  const apiStatus = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');

  const [museumPlace, setMuseumPlace] = useState<ResolvedPlaceData | null>(null);
  const [transitPlaces, setTransitPlaces] = useState<ResolvedPlaceData[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [searchFailed, setSearchFailed] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);

  // Per-session in-memory language cache to avoid redundant Places queries on language toggle
  const cacheRef = useRef<
    Record<string, { museum: ResolvedPlaceData; transit: ResolvedPlaceData[] }>
  >({});

  useEffect(() => {
    if (!placesLib) return;

    const cached = cacheRef.current[lang];
    if (cached && reloadNonce === 0) {
      setMuseumPlace(cached.museum);
      setTransitPlaces(cached.transit);
      setSelectedPlaceId(cached.museum.id);
      setSearchFailed(false);
      setIsSearching(false);
      return;
    }

    let cancelled = false;

    const resolveMuseumAndTransit = async () => {
      setIsSearching(true);
      setSearchFailed(false);

      try {
        const primaryQueries =
          lang === 'th'
            ? [
                'กรมประชาสัมพันธ์ ซอยอารีย์สัมพันธ์ กรุงเทพมหานคร',
                'Public Relations Department Soi Ari Samphan Bangkok',
              ]
            : [
                'Public Relations Department Soi Ari Samphan Bangkok',
                'Public Relations Department Rama VI Road Phaya Thai Bangkok',
              ];

        let foundMuseum: ResolvedPlaceData | null = null;

        for (const textQuery of primaryQueries) {
          const response = await placesLib.Place.searchByText({
            textQuery,
            fields: [
              'id',
              'displayName',
              'formattedAddress',
              'location',
              'viewport',
              'googleMapsURI',
              'regularOpeningHours',
              'nationalPhoneNumber',
            ],
            language: lang,
            region: 'TH',
            maxResultCount: 3,
            internalUsageAttributionIds: GMP_ATTRIBUTION_IDS,
          });

          const firstValid = response.places?.find((p) => p.location != null);
          if (firstValid) {
            foundMuseum = serializePlace(firstValid, true);
            break;
          }
        }

        if (!foundMuseum) {
          if (!cancelled) {
            setSearchFailed(true);
            setIsSearching(false);
          }
          return;
        }

        let nearbyTransit: ResolvedPlaceData[] = [];
        try {
          const nearbyResp = await placesLib.Place.searchNearby({
            locationRestriction: {
              center: foundMuseum.location,
              radius: 1500,
            },
            includedPrimaryTypes: ['subway_station', 'train_station', 'transit_station'],
            maxResultCount: 5,
            rankPreference: placesLib.SearchNearbyRankPreference.DISTANCE,
            fields: [
              'id',
              'displayName',
              'formattedAddress',
              'location',
              'googleMapsURI',
              'primaryTypeDisplayName',
            ],
            language: lang,
            region: 'TH',
            internalUsageAttributionIds: GMP_ATTRIBUTION_IDS,
          });

          nearbyTransit = (nearbyResp.places ?? [])
            .map((p) => serializePlace(p, false))
            .filter((p): p is ResolvedPlaceData => p !== null && p.id !== foundMuseum!.id);
        } catch (nearbyErr) {
          if (isQuotaError(nearbyErr)) {
            window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          }
        }

        if (!cancelled) {
          cacheRef.current[lang] = { museum: foundMuseum, transit: nearbyTransit };
          setMuseumPlace(foundMuseum);
          setTransitPlaces(nearbyTransit);
          setSelectedPlaceId(foundMuseum.id);
          setIsSearching(false);
        }
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (!cancelled) {
          setSearchFailed(true);
          setIsSearching(false);
        }
      }
    };

    void resolveMuseumAndTransit();

    return () => {
      cancelled = true;
    };
  }, [placesLib, lang, reloadNonce]);

  const fallbackMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Public+Relations+Department+Soi+Ari+Samphan+Bangkok';

  const attributions = useMemo(() => {
    const collected: Array<{ provider: string; providerURI: string | null }> = [];
    const seen: Record<string, boolean> = {};
    [museumPlace, ...transitPlaces].forEach((p) => {
      p?.attributions?.forEach((attr) => {
        if (attr.provider && !seen[attr.provider]) {
          seen[attr.provider] = true;
          collected.push(attr);
        }
      });
    });
    return collected;
  }, [museumPlace, transitPlaces]);

  if (apiStatus === APILoadingStatus.FAILED || apiStatus === APILoadingStatus.AUTH_FAILURE || searchFailed) {
    return (
      <div className="rounded-xl border border-[#DDD8CE] bg-white p-8 text-center">
        <MapPin className="mx-auto h-8 w-8 text-[#926C2C]" aria-hidden="true" />
        <h3 className="mt-3 text-lg font-semibold text-[#141413]">{t.errorTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#57534E]">{t.errorDesc}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setReloadNonce((n) => n + 1)}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-[#C8BFB0] bg-white px-4 py-2 text-xs font-medium text-[#141413] hover:bg-[#FAF9F6]"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.retryBtn}</span>
          </button>
          <a
            href={fallbackMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-medium text-white hover:bg-[#1E40AF]"
          >
            <span>{t.openMapsBtn}</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }

  if (!placesLib || isSearching || !museumPlace) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex h-[420px] items-center justify-center rounded-xl border border-[#DDD8CE] bg-[#EFECE5] sm:h-[500px] lg:col-span-8">
          <div className="px-6 text-center">
            <MapPin className="mx-auto h-7 w-7 text-[#1E3A8A]" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-[#292524]">
              {!placesLib ? t.loadingMap : t.loadingPlaces}
            </p>
          </div>
        </div>
        <div className="h-[420px] rounded-xl border border-[#DDD8CE] bg-white p-6 sm:h-[500px] lg:col-span-4">
          <div className="h-4 w-36 rounded bg-[#EFECE5]" />
          <div className="mt-4 h-6 w-3/4 rounded bg-[#EFECE5]" />
          <div className="mt-3 h-16 w-full rounded bg-[#F5F3EE]" />
          <div className="mt-6 h-4 w-40 rounded bg-[#EFECE5]" />
          <div className="mt-3 space-y-2.5">
            <div className="h-12 w-full rounded bg-[#F5F3EE]" />
            <div className="h-12 w-full rounded bg-[#F5F3EE]" />
            <div className="h-12 w-full rounded bg-[#F5F3EE]" />
          </div>
        </div>
      </div>
    );
  }

  const museumDirectionsHref = museumPlace.id
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        museumPlace.displayName
      )}&destination_place_id=${encodeURIComponent(museumPlace.id)}`
    : fallbackMapsUrl;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
      {/* Left 8 Columns: Interactive Google Map */}
      <div className="flex flex-col lg:col-span-8">
        <InteractiveMapCanvas
          lang={lang}
          museumPlace={museumPlace}
          transitPlaces={transitPlaces}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={setSelectedPlaceId}
        />

        {attributions.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#6B665E]">
            <span>{t.attributionLabel}</span>
            {attributions.map((attr) =>
              attr.providerURI ? (
                <a
                  key={attr.provider}
                  href={attr.providerURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#141413]"
                >
                  {attr.provider}
                </a>
              ) : (
                <span key={attr.provider}>{attr.provider}</span>
              )
            )}
          </div>
        )}
      </div>

      {/* Right 4 Columns: Grounded Premises Dossier & Nearby Ari Transit */}
      <div className="flex flex-col gap-5 lg:col-span-4">
        <div
          className={`rounded-xl border bg-white p-5 transition-colors ${
            selectedPlaceId === museumPlace.id ? 'border-[#1E3A8A]' : 'border-[#DDD8CE]'
          }`}
        >
          <button
            type="button"
            onClick={() => setSelectedPlaceId(museumPlace.id)}
            className="w-full text-left"
          >
            <p className="text-[11px] font-medium tracking-wider text-[#1E3A8A]">
              {t.premisesTitle} · {t.primaryBadge}
            </p>
            <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-[#141413]">
              {museumPlace.displayName}
            </h3>
            <p className="mt-0.5 text-xs text-[#6B665E]">{t.premisesSubtitle}</p>
          </button>

          <dl className="mt-4 space-y-3 border-t border-[#ECE8E0] pt-4 text-xs">
            {museumPlace.formattedAddress && (
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
                <div>
                  <dt className="font-medium text-[#6B665E]">{t.addressLabel}</dt>
                  <dd className="mt-0.5 leading-relaxed text-[#141413]">
                    {museumPlace.formattedAddress}
                  </dd>
                </div>
              </div>
            )}

            {museumPlace.nationalPhoneNumber && (
              <div className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
                <div>
                  <dt className="font-medium text-[#6B665E]">{t.phoneLabel}</dt>
                  <dd className="mt-0.5 font-mono tabular-nums text-[#141413]">
                    {museumPlace.nationalPhoneNumber}
                  </dd>
                </div>
              </div>
            )}

            {museumPlace.weekdayDescriptions && museumPlace.weekdayDescriptions.length > 0 && (
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
                <div>
                  <dt className="font-medium text-[#6B665E]">{t.hoursLabel}</dt>
                  <dd className="mt-0.5 space-y-0.5 tabular-nums text-[#4A4843]">
                    {museumPlace.weekdayDescriptions.slice(0, 5).map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </dd>
                </div>
              </div>
            )}
          </dl>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-[#ECE8E0] pt-4">
            <a
              href={museumDirectionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-md bg-[#1E3A8A] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
            >
              <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.directionsBtn}</span>
            </a>
            {museumPlace.googleMapsURI && (
              <a
                href={museumPlace.googleMapsURI}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-md border border-[#C8BFB0] bg-white px-3 py-1.5 text-xs font-medium text-[#141413] transition-colors hover:bg-[#FAF9F6] whitespace-nowrap"
              >
                <span>{t.openMapsBtn}</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* Nearby Public Transit List */}
        <div className="flex-1 rounded-xl border border-[#DDD8CE] bg-white p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-[#141413]">{t.transitTitle}</h3>
              <p className="mt-0.5 text-xs text-[#57534E]">{t.transitSubtitle}</p>
            </div>
            <TrainFront className="h-4 w-4 shrink-0 text-[#926C2C]" aria-hidden="true" />
          </div>

          {transitPlaces.length === 0 ? (
            <p className="mt-4 border-t border-[#ECE8E0] pt-3 text-xs text-[#6B665E]">
              {t.transitEmpty}
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-[#ECE8E0] border-t border-[#ECE8E0]">
              {transitPlaces.map((station) => {
                const active = selectedPlaceId === station.id;
                return (
                  <li key={station.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedPlaceId(station.id)}
                      className={`flex w-full items-start justify-between gap-3 py-2.5 text-left transition-colors ${
                        active ? 'bg-[#FAF7F0] px-2 -mx-2 rounded' : 'hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-[#141413]">
                          {station.displayName}
                        </p>
                        {station.primaryTypeDisplayName && (
                          <p className="mt-0.5 text-[11px] text-[#6B665E]">
                            {station.primaryTypeDisplayName}
                          </p>
                        )}
                      </div>
                      <MapPin
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                          active ? 'text-[#926C2C]' : 'text-[#A8A29E]'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

interface MuseumLocationMapProps {
  lang: Language;
}

export const MuseumLocationMap: React.FC<MuseumLocationMapProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].location;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  return (
    <section
      id="location"
      aria-labelledby="location-heading"
      className="border-t border-[#E4E0D8] bg-[#F8F7F4] py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 border-b border-[#DCD7CD] pb-8">
          <p className="text-xs font-medium tracking-wider text-[#1E3A8A]">{t.kicker}</p>
          <h2
            id="location-heading"
            className="text-balance mt-2 text-3xl font-semibold tracking-tight text-[#141413] sm:text-4xl"
          >
            {t.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#4A4843]">
            {t.subheading}
          </p>
        </div>

        {apiKey ? (
          <APIProvider apiKey={apiKey} language={lang} region="TH" libraries={['marker', 'places']}>
            <GroundedMuseumExplorer lang={lang} />
          </APIProvider>
        ) : (
          <div className="rounded-xl border border-[#DDD8CE] bg-white p-8 text-center">
            <MapPin className="mx-auto h-8 w-8 text-[#1E3A8A]" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold text-[#141413]">{t.missingKeyTitle}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#57534E]">{t.missingKeyDesc}</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Public+Relations+Department+Soi+Ari+Samphan+Bangkok"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-medium text-white hover:bg-[#1E40AF]"
            >
              <span>{t.openMapsBtn}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
