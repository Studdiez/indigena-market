import type { LaunchpadCampaign, LaunchpadCategory } from '@/app/lib/launchpad';

export interface ImpactAreaMeta {
  key: LaunchpadCategory;
  label: string;
  title: string;
  description: string;
  kicker: string;
  image: string;
}

export const impactAreaMeta: Record<LaunchpadCategory, ImpactAreaMeta> = {
  artist: {
    key: 'artist',
    label: 'Arts & Culture',
    title: 'Arts & Culture',
    description: 'Back exhibitions, workshops, touring programs, and creator-led public work rooted in Indigenous knowledge and creative continuity.',
    kicker: 'Creator-led cultural expression',
    image: '/launchpad/artist-tour.svg'
  },
  athlete: {
    key: 'athlete',
    label: 'Youth & Training',
    title: 'Youth & Training',
    description: 'Support athlete development, coaching access, travel, and wellness pathways for young people carrying community pride forward.',
    kicker: 'Movement, discipline, and visibility',
    image: '/launchpad/athlete-camp.svg'
  },
  scholarship: {
    key: 'scholarship',
    label: 'Education',
    title: 'Education',
    description: 'Fund scholarships, teacher training, language instruction, and learning access that strengthens long-term community capacity.',
    kicker: 'Learning that stays with the people',
    image: '/launchpad/scholarship-circle.svg'
  },
  travel: {
    key: 'travel',
    label: 'Travel & Exchange',
    title: 'Travel & Exchange',
    description: 'Help artists, students, and cultural workers reach invitations, exchanges, and teaching opportunities that cost would otherwise block.',
    kicker: 'Mobility that unlocks opportunity',
    image: '/launchpad/travel-fund.svg'
  },
  emergency: {
    key: 'emergency',
    label: 'Emergency Relief',
    title: 'Emergency Relief',
    description: 'Rapid-response support for urgent family and community needs, with culturally appropriate aid and community-led distribution.',
    kicker: 'Urgent support with dignity',
    image: '/launchpad/emergency-relief.svg'
  },
  community: {
    key: 'community',
    label: 'Community Infrastructure',
    title: 'Community Infrastructure',
    description: 'Back halls, maker spaces, teaching sites, and shared infrastructure that communities govern and use for years to come.',
    kicker: 'Shared space for collective futures',
    image: '/launchpad/community-hall.svg'
  },
  'digital-champion': {
    key: 'digital-champion',
    label: 'Community Growth',
    title: 'Community Growth',
    description: 'Support onboarding, device help, treasury literacy, and regionally rooted launch support for communities joining the platform.',
    kicker: 'Digital sovereignty in practice',
    image: '/launchpad/champion-fund.svg'
  },
  entrepreneurship: {
    key: 'entrepreneurship',
    label: 'Entrepreneurship',
    title: 'Entrepreneurship',
    description: 'Fund founder stipends, mentoring, and early-stage support for Indigenous ventures growing without losing cultural direction.',
    kicker: 'Business growth on community terms',
    image: '/launchpad/founder-lab.svg'
  },
  'business-starter': {
    key: 'business-starter',
    label: 'Small Business',
    title: 'Small Business',
    description: 'Cover permits, packaging, equipment, and first-run inventory for first-time makers building economically sustainable work.',
    kicker: 'Early funding for first real steps',
    image: '/launchpad/starter-kits.svg'
  }
};

export function getImpactAreaMeta(category: LaunchpadCategory) {
  return impactAreaMeta[category];
}

export function getFundingProgress(campaign: LaunchpadCampaign) {
  if (!campaign.goalAmount) return 0;
  return Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100));
}

export function getMomentumLabels(campaign: LaunchpadCampaign) {
  const labels: string[] = [];
  const progress = getFundingProgress(campaign);

  if (progress >= 85) labels.push('Almost funded');
  if (campaign.sponsorCount >= 50) labels.push('Trending');
  if (campaign.campaignUpdates.length > 0) labels.push(`Updated ${campaign.campaignUpdates[0].postedLabel.replace('Posted ', '')}`);
  if (campaign.closesInLabel.toLowerCase().includes('7 days') || campaign.closesInLabel.toLowerCase().includes('days left') && parseInt(campaign.closesInLabel, 10) <= 10) {
    labels.push('Closing soon');
  }
  if (campaign.category === 'community' || campaign.linkedAccountSlug) labels.push('Community priority');
  if (campaign.linkedAccountSlug) labels.push('Verified organizer');

  return labels.slice(0, 3);
}

export function getCampaignMissionLine(campaign: LaunchpadCampaign) {
  return campaign.impactPoints[0] || campaign.summary;
}

export function getTransparencyBreakdown(campaign: LaunchpadCampaign) {
  const items = campaign.useOfFunds.slice(0, 4);
  const presetWeights = items.length === 4 ? [40, 25, 20, 15] : items.length === 3 ? [60, 25, 15] : items.length === 2 ? [70, 30] : [100];
  return items.map((label, index) => ({
    label,
    percent: presetWeights[index] ?? Math.max(10, Math.round(100 / items.length))
  }));
}

export function getTrustSignals(campaign: LaunchpadCampaign) {
  return [
    {
      label: campaign.linkedAccountSlug ? 'Verified organizer' : 'Identity shown',
      detail: `${campaign.beneficiaryName} is listed publicly as the organizer or beneficiary.`
    },
    {
      label: 'Transparent use of funds',
      detail: `${campaign.useOfFunds.length} planned funding uses are shown before contribution.`
    },
    {
      label: 'Recent updates',
      detail: `${campaign.campaignUpdates.length} campaign updates visible to backers and visitors.`
    },
    {
      label: 'Direct support path',
      detail: 'Funding moves to the named campaign owner or linked community initiative.'
    }
  ];
}
