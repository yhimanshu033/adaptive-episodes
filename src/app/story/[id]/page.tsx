import React from 'react'
import StoryPlayerPage from '@/page-builders/story-player'

interface StoryPageProps {
	params: Promise<{ id: string }>
}

export default async function StoryPage({ params }: StoryPageProps) {
	const { id } = await params
	return <StoryPlayerPage storyId={id} />
}
