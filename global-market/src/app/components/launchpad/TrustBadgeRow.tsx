import { BadgeCheck, HeartHandshake, ScrollText, ShieldCheck } from 'lucide-react';

const iconMap = [BadgeCheck, HeartHandshake, ScrollText, ShieldCheck];

export interface TrustBadgeItem {
  label: string;
  detail: string;
}

export default function TrustBadgeRow({ items }: { items: TrustBadgeItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = iconMap[index % iconMap.length];
        return (
          <div key={item.label} className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,20,0.94),rgba(8,8,8,0.86))] p-4">
            <div className="inline-flex items-center gap-2 text-[#d4af37]">
              <Icon size={14} />
              <span className="text-xs uppercase tracking-[0.18em]">{item.label}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-300">{item.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
