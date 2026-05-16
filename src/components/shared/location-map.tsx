"use client";

const DEFAULT_BOUNDS = {
  west: 55.057,
  south: 24.89,
  east: 55.391,
  north: 25.391,
};

function buildBoundingBox(latitude: number, longitude: number) {
  const latDelta = 0.008;
  const lonDelta = 0.012;

  return [
    longitude - lonDelta,
    latitude - latDelta,
    longitude + lonDelta,
    latitude + latDelta,
  ].join(",");
}

function buildDubaiBoundingBox() {
  return [
    DEFAULT_BOUNDS.west,
    DEFAULT_BOUNDS.south,
    DEFAULT_BOUNDS.east,
    DEFAULT_BOUNDS.north,
  ].join(",");
}

export function LocationMap({
  latitude,
  longitude,
  locationLabel,
  addressLabel,
}: {
  latitude?: number | null;
  longitude?: number | null;
  locationLabel?: string;
  addressLabel?: string;
}) {
  const hasCoordinates = latitude != null && longitude != null;
  const bbox = hasCoordinates
    ? buildBoundingBox(latitude, longitude)
    : buildDubaiBoundingBox();

  const embedUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${latitude},${longitude}`)}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik`;

  const openStreetMapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(addressLabel || locationLabel || "Dubai")}`;

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border bg-muted/20">
      <iframe
        title="OpenStreetMap location map"
        src={embedUrl}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-background/90 via-background/60 to-transparent px-4 py-4">
        <p className="text-sm font-semibold text-foreground">
          {addressLabel || locationLabel || "Dubai"}
        </p>
        <p className="text-xs text-muted-foreground">
          {hasCoordinates
            ? `${latitude?.toFixed(5)}, ${longitude?.toFixed(5)}`
            : "Approximate area view powered by OpenStreetMap"}
        </p>
      </div>

      {!hasCoordinates && (
        <div className="pointer-events-none absolute bottom-4 left-4 max-w-xs rounded-lg bg-background/85 px-3 py-2 text-xs text-muted-foreground shadow-sm">
          A precise marker is unavailable for this listing, so the map is centered on Dubai.
        </div>
      )}

      <div className="absolute bottom-4 right-4">
        <a
          href={openStreetMapUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg"
        >
          Open in OpenStreetMap
        </a>
      </div>
    </div>
  );
}
