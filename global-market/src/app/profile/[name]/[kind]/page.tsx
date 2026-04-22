import { notFound } from 'next/navigation';
import PublicProfilePillarClient from '@/app/profile/components/PublicProfilePillarClient';
import ProfileConnectionsClient from '@/app/profile/components/ProfileConnectionsClient';
import ProfileWorkspaceShell from '@/app/profile/components/ProfileWorkspaceShell';
import { getProfileConnectionsBySlug, type ProfilePillarId } from '@/app/profile/data/profileShowcase';
import { loadProfileForInitialRender } from '@/app/profile/lib/profileServer';

const PILLAR_ROUTE_SET = new Set<Exclude<ProfilePillarId, 'seva'>>([
  'digital-arts',
  'physical-items',
  'courses',
  'freelancing',
  'cultural-tourism',
  'language-heritage',
  'land-food',
  'advocacy-legal',
  'materials-tools'
]);

export default async function ProfileKindPage({
  params
}: {
  params: Promise<{ name: string; kind: string }>;
}) {
  const { name, kind } = await params;

  if (kind === 'followers' || kind === 'following') {
    const initialConnections = getProfileConnectionsBySlug(name, kind);
    return (
      <ProfileWorkspaceShell>
        <ProfileConnectionsClient slug={name} kind={kind} initialConnections={initialConnections} />
      </ProfileWorkspaceShell>
    );
  }

  if (!PILLAR_ROUTE_SET.has(kind as Exclude<ProfilePillarId, 'seva'>)) {
    notFound();
  }

  const profile = await loadProfileForInitialRender(name);

  return (
    <ProfileWorkspaceShell>
      <PublicProfilePillarClient
        profile={profile}
        slug={name}
        pillar={kind as Exclude<ProfilePillarId, 'seva'>}
      />
    </ProfileWorkspaceShell>
  );
}
