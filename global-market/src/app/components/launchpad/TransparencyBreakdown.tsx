import type { LaunchpadCampaign } from '@/app/lib/launchpad';
import { getTransparencyBreakdown } from './launchpadPresentation';

export default function TransparencyBreakdown({ campaign, title = 'Where your support goes' }: { campaign: LaunchpadCampaign; title?: string }) {
  const rows = getTransparencyBreakdown(campaign);

  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">{title}</p>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="text-gray-300">{row.label}</span>
              <span className="font-medium text-white">{row.percent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/6">
              <div className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8941f]" style={{ width: `${row.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
