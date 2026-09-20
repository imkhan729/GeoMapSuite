import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllStates, getStateBySlug } from '@/data/states/states-registry';
import { buildCanonicalUrl, buildSeoDescription, buildSeoTitle, SITE_CONFIG } from '@/lib/seo/metadata';
import { StateCountyDirectoryView } from '../StateCountyDirectoryView';

export async function generateStaticParams() {
  return getAllStates().map((s) => ({ state: s.slug }));
}

export async function generateMetadata(props: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await props.params;
  const stateData = getStateBySlug(state);
  if (!stateData) return {};

  const title = buildSeoTitle(`${stateData.name} Counties: Map, List & FIPS`);
  const canonical = buildCanonicalUrl(`/states/${stateData.slug}/counties`);
  const description = buildSeoDescription(`Explore ${stateData.name} counties with a map, complete county list, county seats, and FIPS codes. Find population and area details for each county.`);

  return {
    title,
    description,
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
      description,
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
