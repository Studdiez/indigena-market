import { ArrowRight } from 'lucide-react';
import type { ImpactAreaMeta } from './launchpadPresentation';

export default function ImpactAreaCard({
  area,
  totalRaised,
  campaignCount,
  selected,
  onClick
}: {
  area: ImpactAreaMeta;
  totalRaised: number;
  campaignCount: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group overflow-hidden rounded-[28px] border text-left transition-all ${
        selected
          ? 'border-[#d4af37]/55 bg-[linear-gradient(180deg,rgba(212,175,55,0.12),rgba(14,14,14,0.94))] shadow-[0_20px_50px_rgba(212,175,55,0.12)]'
          : 'border-white/8 bg-[linear-gradient(180deg,rgba(20,20,20,0.95),rgba(8,8,8,0.92))] hover:border-[#d4af37]/30'
      }`}
    >
      <div className="relative h-40 overflow-hidden">
        <img src={area.image} alt={area.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37]">{area.kicker}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{area.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-7 text-gray-300">{area.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <p className="font-semibold text-[#d4af37]">${totalRaised.toLocaleString()} raised</p>
            <p className="text-gray-500">{campaignCount} live campaigns</p>
          </div>
          <span className="inline-flex items-center gap-2 text-[#f3d57c]">
            Explore
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </button>
  );
}
