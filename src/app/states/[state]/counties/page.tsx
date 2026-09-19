import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllStates, getStateBySlug } from '@/data/states/states-registry';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';
import { StateCountyDirectoryView } from '../StateCountyDirectoryView';

export async function generateStaticParams() {
  return getAllStates().map((s) => ({ state: s.slug }));
}

export async function generateMetadata(props: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await props.params;
  const stateData = getStateBySlug(state);
  if (!stateData) return {};

  const title = `${stateData.name} Counties - Map, List & FIPS Directory | ${SITE_CONFIG.name}`;
  const canonical = buildCanonicalUrl(`/states/${stateData.slug}/counties`);

  return {
    title,
    description: `Complete guide to all ${stateData.countyCount} counties in ${stateData.name} (${stateData.postalCode}). View interactive county maps, population census benchmarks, county seats, FIPS codes, and area statistics.`,
    keywords: [
      `${stateData.name.toLowerCase()} counties`,
      `${stateData.name.toLowerCase()} county map`,
      `${stateData.name.toLowerCase()} counties list`,
      `${stateData.name.toLowerCase()} county seats`,
      `${stateData.name.toLowerCase()} fips codes`,
      `${stateData.postalCode.toLowerCase()} county population`,
      'geomapsuite',
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description: `Complete list and interactive map of all ${stateData.countyCount} counties in ${stateData.name}. Population data, county seats, and FIPS codes.`,
      url: canonical,
      siteName: SITE_CONFIG.name,
      type: 'website',
    },
  };
}

export default async function StateCountiesPage(props: { params: Promise<{ state: string }> }) {
  const { state } = await props.params;
  const stateData = getStateBySlug(state);

  if (!stateData) {
    notFound();
  }

  return <StateCountyDirectoryView stateData={stateData} isCountiesSubroute={true} />;
}
