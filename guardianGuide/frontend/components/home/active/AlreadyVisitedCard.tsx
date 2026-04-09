"use client";

interface Props {
  places: string[];
}

export default function AlreadyVisitedCard({ places }: Props) {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      <h3 className="text-heading-3 text-text-primary font-semibold mb-3">Already Visited</h3>
      {places.length === 0 ? (
        <p className="text-body-sm text-text-muted py-4 text-center">Tick places as you visit them.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {places.map((place, i) => (
            <li key={i} className="flex items-center gap-2 text-body-sm text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-zone-green flex-shrink-0" />
              {place}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
