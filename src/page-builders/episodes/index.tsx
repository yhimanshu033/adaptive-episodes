'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'
import AuthorTitle from '@/page-builders/episodes/author'
import EpisodesTable from '@/page-builders/episodes/episodes-table'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import useEpisodeTableContext from '@/providers/episode-table-provider'

export default function EpisodeListPage() {
	const { initialStoryData: storyData } = useEpisodeTableContext()

	return (
		<main className="container flex-1 animate-fade-in-up flex-col px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Image
						src={storyData?.image || COPILOT_LOGO_URL}
						alt={`${storyData?.project_title} thumbnail`}
						width={80}
						height={80}
						objectFit="cover"
						className="rounded-lg"
						loading="lazy"
						unoptimized
					/>
					<div>
						<h1 className="text-3xl font-bold">{storyData?.project_title}</h1>
						<AuthorTitle />
					</div>
				</div>
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
