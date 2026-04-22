'use client';

import Link from 'next/link';
import { BriefcaseBusiness, HeartHandshake, ShoppingBag } from 'lucide-react';

const actions = [
  {
    title: 'Shop',
    description: 'Collect art, goods, bundles, and experiences from Indigenous creators.',
    href: '/digital-arts',
    icon: ShoppingBag
  },
  {
    title: 'Sell',
    description: 'Open your creator workspace and start listing across the marketplace.',
    href: '/creator-hub',
    icon: BriefcaseBusiness
  },
  {
    title: 'Support',
    description: 'Back community projects, Seva requests, and Launchpad campaigns.',
    href: '/launchpad',
    icon: HeartHandshake
  }
];

export default function HomeActionStrip() {
  return (
    <section className="bg-[#0d0d0d] px-6 py-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {actions.map(({ title, description, href, icon: Icon }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-2xl border border-[#d4af37]/12 bg-[#131313] px-5 py-4 transition-all hover:border-[#d4af37]/28 hover:bg-[#171717] hover:shadow-[0_14px_30px_rgba(0,0,0,0.24)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/10 text-[#d4af37] transition-all group-hover:bg-[#d4af37] group-hover:text-black">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{title}</p>
                <p className="text-sm leading-6 text-gray-400">{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
