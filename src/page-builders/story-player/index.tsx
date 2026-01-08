'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAudioPlayerStore } from '@/store/audio-player-store'
import { useDemoAuthStore } from '@/store/demo-auth-store'

import AppSidebar from '@/components/layout/app-sidebar'
import { SIGNIN_ROUTE } from '@/lib/demo-auth'

import AudioPlayer from './audio-player'
import { getStoryById } from './data'
import EpisodesSidebar from './episodes-sidebar'

interface StoryPlayerPageProps {
	storyId: string
}

export default function StoryPlayerPage({ storyId }: StoryPlayerPageProps) {
	const router = useRouter()
	const { isAuthenticated } = useDemoAuthStore()
	const { setCurrentStory } = useAudioPlayerStore()

	const story = getStoryById(storyId)

	// Redirect if not authenticated
	useEffect(() => {
		if (!isAuthenticated) {
			router.replace(SIGNIN_ROUTE)
		}
	}, [isAuthenticated, router])

	// Set current story in store
	useEffect(() => {
		if (story) {
			setCurrentStory(story)
		}
	}, [story, setCurrentStory])

	if (!isAuthenticated) {
		return null
	}

	if (!story) {
		return (
			<div className="bg-fm-surface-primary flex min-h-screen items-center justify-center">
				<p className="text-fm-tertiary">Story not found</p>
			</div>
		)
	}

	return (
		<div className="bg-fm-surface-primary flex min-h-screen">
			{/* Left navigation sidebar */}
			<AppSidebar />

			{/* Main content area with audio player */}
			<main className="ml-[72px] flex flex-1">
				<AudioPlayer story={story} />
			</main>

			{/* Right episodes sidebar */}
			<EpisodesSidebar story={story} />
		</div>
	)
}
