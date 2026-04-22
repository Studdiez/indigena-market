'use client';

import { useRouter } from 'next/navigation';
import { 
  Palette, 
  ShoppingBag, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  Plane, 
  Languages, 
  Sprout, 
  Scale, 
  Hammer 
} from 'lucide-react';

interface Pillar {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const pillars: Pillar[] = [
  { 
    id: 'digital-arts', 
    name: 'Digital Arts', 
    shortName: 'Arts',
    icon: <Palette size={24} />, 
    color: '#d4af37',
    description: 'NFTs & Digital Creations'
  },
  { 
    id: 'physical-items', 
    name: 'Physical Items', 
    shortName: 'Items',
    icon: <ShoppingBag size={24} />, 
    color: '#d4af37',
    description: 'Handcrafted Goods'
  },
  { 
    id: 'courses', 
    name: 'Courses', 
    shortName: 'Learn',
    icon: <GraduationCap size={24} />, 
    color: '#d4af37',
    description: 'Learn & Teach'
  },
  { 
    id: 'freelancing', 
    name: 'Freelancing', 
    shortName: 'Work',
    icon: <Briefcase size={24} />, 
    color: '#d4af37',
    description: 'Services & Skills'
  },
  { 
    id: 'seva', 
    name: 'Seva', 
    shortName: 'Give',
    icon: <Heart size={24} />, 
    color: '#d4af37',
    description: 'Giving & Community'
  },
  { 
    id: 'cultural-tourism', 
    name: 'Cultural Tourism', 
    shortName: 'Travel',
    icon: <Plane size={24} />, 
    color: '#d4af37',
    description: 'Experiences & Tours'
  },
  { 
    id: 'language-heritage', 
    name: 'Language & Heritage', 
    shortName: 'Culture',
    icon: <Languages size={24} />, 
    color: '#d4af37',
    description: 'Preserve & Learn'
  },
  { 
    id: 'land-food', 
    name: 'Land & Food', 
    shortName: 'Earth',
    icon: <Sprout size={24} />, 
    color: '#d4af37',
    description: 'Sustainable Living'
  },
  { 
    id: 'advocacy-legal', 
    name: 'Advocacy & Legal', 
    shortName: 'Justice',
    icon: <Scale size={24} />, 
    color: '#d4af37',
    description: 'Rights & Support'
  },
  { 
    id: 'materials-tools', 
    name: 'Materials & Tools', 
    shortName: 'Tools',
    icon: <Hammer size={24} />, 
    color: '#d4af37',
    description: 'Supplies & Equipment'
  },
];

interface PillarQuickActionsProps {
  onPillarClick: (pillarId: string) => void;
}

export default function PillarQuickActions({ onPillarClick }: PillarQuickActionsProps) {
  const router = useRouter();

  const handlePillarClick = (pillarId: string) => {
    if (pillarId === 'seva') {
      router.push('/seva');
    } else if (pillarId === 'cultural-tourism') {
      router.push('/cultural-tourism');
    } else if (pillarId === 'language-heritage') {
      router.push('/language-heritage');
    } else if (pillarId === 'land-food') {
      router.push('/land-food');
    } else if (pillarId === 'advocacy-legal') {
      router.push('/advocacy-legal');
    } else if (pillarId === 'materials-tools') {
      router.push('/materials-tools');
    } else {
      onPillarClick(pillarId);
    }
  };

  return (
    <section className="py-12 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              Enter through the <span className="secondary-gradient">10 Sacred Pillars</span>
            </h2>
            <p className="text-gray-400">
              Shop, learn, book, fund, and support through the part of the ecosystem that fits what you came for.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handlePillarClick('digital-arts')}
              className="rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#f4e4a6]"
            >
              Shop marketplace
            </button>
            <button
              type="button"
              onClick={() => router.push('/creator-hub')}
              className="rounded-full border border-[#d4af37]/30 px-5 py-2.5 text-sm font-semibold text-[#d4af37] transition hover:bg-[#d4af37]/10"
            >
              Become a creator
            </button>
            <button
              type="button"
              onClick={() => router.push('/launchpad')}
              className="rounded-full border border-[#DC143C]/30 px-5 py-2.5 text-sm font-semibold text-[#ff6a84] transition hover:bg-[#DC143C]/10"
            >
              Support projects
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {pillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => handlePillarClick(pillar.id)}
              className="group flex flex-col items-center p-4 rounded-xl bg-[#141414] border border-[#d4af37]/10 hover:border-[#d4af37]/50 hover:bg-[#1a1a1a] transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/10"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                style={{ 
                  background: `linear-gradient(135deg, ${pillar.color}20, ${pillar.color}40)`,
                  border: `1px solid ${pillar.color}60`
                }}
              >
                <span style={{ color: pillar.color }}>{pillar.icon}</span>
              </div>
              <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                {pillar.shortName}
              </span>
            </button>
          ))}
        </div>

        {/* Full names row */}
        <div className="hidden md:grid grid-cols-10 gap-3 mt-2 text-center">
          {pillars.map((pillar) => (
            <p key={pillar.id} className="text-[10px] text-gray-500 truncate px-1">
              {pillar.name}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
