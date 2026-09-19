import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllStates, getStateBySlug } from '@/data/states/states-registry';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';
import { StateCountyDirectoryView } from './StateCountyDirectoryView';

export async function generateStaticParams() {
  return getAllStates().map((s) => ({ state: s.slug }));
}

export async function generateMetadata(props: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await props.params;
  const stateData = getStateBySlug(state);
  if (!stateData) return {};

  const title = `${stateData.name} Counties, Map & Demographics | ${SITE_CONFIG.name}`;
  const canonical = buildCanonicalUrl(`/states/${stateData.slug}`);

  return {
    title,
    description: `Complete list of all ${stateData.countyCount} counties in ${stateData.name} with population data, county seats, FIPS codes, and interactive county map.`,
    keywords: [
      `${stateData.name.toLowerCase()} counties`,
      `${stateData.name.toLowerCase()} demographics`,
      `${stateData.name.toLowerCase()} county map`,
      `${stateData.name.toLowerCase()} capital`,
      `${stateData.name.toLowerCase()} fips code`,
      'geomapsuite',
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description: `Complete guide to ${stateData.name} counties, population benchmarks, and interactive maps.`,
      url: canonical,
      siteName: SITE_CONFIG.name,
      type: 'website',
    },
  };
}

export default async function StateDetailPage(props: { params: Promise<{ state: string }> }) {
  const { state } = await props.params;
  const stateData = getStateBySlug(state);

  if (!stateData) {
    notFound();
  }

  return <StateCountyDirectoryView stateData={stateData} isCountiesSubroute={false} />;
}
