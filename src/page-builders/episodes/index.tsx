'use client'

import React from 'react'
import EpisodesTable from '@/page-builders/episodes/table/episodes-table'

export default function EpisodeListPage() {
	return (
		<main className="container flex-1 animate-fade-in-up flex-col p-4">
			<EpisodesTable />
		</main>
	)
}
