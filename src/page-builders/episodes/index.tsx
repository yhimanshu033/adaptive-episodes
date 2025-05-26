'use client'

import React from 'react'
import EpisodesTable from '@/page-builders/episodes/table/episodes-table'

export default function EpisodeListPage() {
	return (
		<main className="animate-fade-in-up container flex-1 flex-col p-4">
			<EpisodesTable />
		</main>
	)
}
