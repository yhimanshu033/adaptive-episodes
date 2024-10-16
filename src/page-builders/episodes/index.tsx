'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

import EpisodesTable from './episodes-table'

export default function EpisodeListPage() {
	const story = decodeURIComponent(useParams()?.id as string)

	return (
		<main className="container flex-1 animate-fade-in-up px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Image
						src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/stories/${story}/image`}
						alt={`${story} thumbnail`}
						width={80}
						height={80}
						objectFit="cover"
						className="rounded-lg"
						loading="lazy"
					/>
					<h1 className="text-3xl font-bold">{story}</h1>
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
