import { BadgeCheck, Clock3, Flame, Radio, TrendingUp } from 'lucide-react';

const badgeMap: Record<string, { icon: typeof Flame; tone: string }> = {
  'Almost funded': { icon: TrendingUp, tone: 'border-[#d4af37]/30 bg-[#d4af37]/10 text-[#f3d57c]' },
  'Trending': { icon: Flame, tone: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' },
  'Closing soon': { icon: Clock3, tone: 'border-[#DC143C]/30 bg-[#DC143C]/10 text-rose-200' },
  'Community priority': { icon: Radio, tone: 'border-violet-400/25 bg-violet-400/10 text-violet-200' },
  'Verified organizer': { icon: BadgeCheck, tone: 'border-sky-400/25 bg-sky-400/10 text-sky-200' }
};

export default function MomentumBadge({ label }: { label: string }) {
  const match = Object.entries(badgeMap).find(([key]) => label.startsWith(key));
  const Icon = match?.[1].icon ?? Radio;
  const tone = match?.[1].tone ?? 'border-white/10 bg-white/5 text-gray-300';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}
