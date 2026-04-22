import type { LaunchpadCampaign } from '@/app/lib/launchpad';
import { getFundingProgress } from './launchpadPresentation';

export default function CampaignProgress({ campaign, compact = false }: { campaign: LaunchpadCampaign; compact?: boolean }) {
  const progress = getFundingProgress(campaign);

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <div className={`overflow-hidden rounded-full ${compact ? 'h-2 bg-black/35' : 'h-2.5 bg-[#0a0a0a]'}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3deb1] to-[#DC143C]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div>
          <span className="font-semibold text-white">${campaign.raisedAmount.toLocaleString()}</span>
          <span className="text-gray-400"> raised of ${campaign.goalAmount.toLocaleString()}</span>
        </div>
        <span className="text-[#d4af37]">{progress}% funded</span>
      </div>
    </div>
  );
}
