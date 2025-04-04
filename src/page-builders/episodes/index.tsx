'use client'

import React from 'react'
import Link from 'next/link'
import EpisodesTable from '@/page-builders/episodes/episodes-table'
import { ArrowLeft } from 'lucide-react'

import AuthWrapper from '@/components/auth-wrapper'
import StoryDetails from '@/components/story-details'
import { Button } from '@/components/ui/button'

import { ERole } from '@/types/admin-types'

import AdminManageProject from './admin-manage-project'

export default function EpisodeListPage() {
	return (
		<main className="container flex-1 animate-fade-in-up flex-col p-4">
			<div className="mb-4 flex items-center justify-between">
				<StoryDetails titleClassname="text-xl" imageSize={60} />
				<div className="flex gap-2">
					<AuthWrapper role={ERole.ADMIN}>
						<AdminManageProject />
					</AuthWrapper>
					<Button variant="outline" size="sm" asChild>
						<Link href="/projects">
							<ArrowLeft className="mr-2 size-4" />
							Back to Stories
						</Link>
					</Button>
				</div>
			</div>
			<EpisodesTable />
		</main>
	)
}
