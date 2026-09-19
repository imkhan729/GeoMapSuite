import { notFound, permanentRedirect } from 'next/navigation';
import { getAllBlankMaps, getBlankMapBySlug } from '@/data/maps/blank-maps-registry';

export async function generateStaticParams() {
  return getAllBlankMaps().map((m) => ({ slug: m.slug }));
}

interface MapsSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MapsSlugPage(props: MapsSlugPageProps) {
  const { slug } = await props.params;
  const mapItem = getBlankMapBySlug(slug);

  if (!mapItem) {
    notFound();
  }

  permanentRedirect(`/maps/blank/${mapItem.slug}/`);
}
