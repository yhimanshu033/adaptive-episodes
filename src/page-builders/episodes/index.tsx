'use client'

import React from 'react'
import Link from 'next/link'
import EpisodesTable from '@/page-builders/episodes/episodes-table'
import { ArrowLeft } from 'lucide-react'

import StoryDetails from '@/components/story-details'
import { Button } from '@/components/ui/button'

export default function EpisodeListPage() {
	return (
		<main className="container flex-1 animate-fade-in-up flex-col px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<StoryDetails />
				<Button variant="outline" size="sm" asChild>
					<Link href="/projects">
						<ArrowLeft className="mr-2 size-4" />
						Back to Stories
					</Link>
				</Button>
			</div>
			<EpisodesTable />
		</main>
	)
}
