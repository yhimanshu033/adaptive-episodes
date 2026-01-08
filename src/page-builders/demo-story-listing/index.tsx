'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDemoAuthStore } from '@/store/demo-auth-store'
import { useUserPreferencesStore } from '@/store/user-preferences-store'

import AppSidebar from '@/components/layout/app-sidebar'
import { SIGNIN_ROUTE } from '@/lib/demo-auth'

import { demoStories, DemoStory } from './data'
import PreferenceDialog from './preferences/preference-dialog'
import ProfileBanner from './profile-banner'
import StoryGrid from './story-grid'
import StoryTopbar from './topbar'

export default function DemoStoryListingPage() {
	const router = useRouter()
	const { isAuthenticated, user } = useDemoAuthStore()
	const { hasCompletedOnboarding, loadFromStorage, profile, bucketResult } =
		useUserPreferencesStore()

	const [query, setQuery] = useState('')
	const [showPreferences, setShowPreferences] = useState(false)

	// Load preferences from localStorage on mount
	useEffect(() => {
		loadFromStorage()
	}, [loadFromStorage])

	// Show preference dialog if user hasn't completed onboarding
	useEffect(() => {
		if (isAuthenticated && !hasCompletedOnboarding) {
			// Small delay to let the page render first
			const timeout = setTimeout(() => {
				setShowPreferences(true)
			}, 500)
			return () => clearTimeout(timeout)
		}
	}, [isAuthenticated, hasCompletedOnboarding])

	const greeting = useMemo(() => {
		if (!user?.fullName) {
			return 'Guest'
		}
		return user.fullName
	}, [user?.fullName])

	useEffect(() => {
		// Client-side safety net: after logout, immediately send to /signin
		if (!isAuthenticated) {
			router.replace(SIGNIN_ROUTE)
		}
	}, [isAuthenticated, router])

	const filteredStories = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) {
			return demoStories
		}
		return demoStories.filter((s) => {
			const hay = `${s.title} ${s.genre}`.toLowerCase()
			return hay.includes(q)
		})
	}, [query])

	const handleOpenPreferences = () => setShowPreferences(true)

	const handlePlayStory = (story: DemoStory) => {
		// Navigate to story player page
		router.push(`/story/${story.id}`)
	}

	return (
		<div className="bg-fm-surface-primary min-h-screen">
			{/* Shared app sidebar */}
			<AppSidebar />

			{/* Main content area offset by sidebar width */}
			<div className="min-h-screen pl-[72px]">
				<StoryTopbar
					name={greeting}
					query={query}
					onQueryChange={setQuery}
					onOpenPreferences={handleOpenPreferences}
					profile={profile}
				/>

				{/* Profile banner - shown when user has completed onboarding */}
				{hasCompletedOnboarding && profile && (
					<ProfileBanner
						profile={profile}
						onChangePreferences={handleOpenPreferences}
						bucketResult={bucketResult}
					/>
				)}

				<StoryGrid
					title={
						query ? `Results (${filteredStories.length})` : 'Top Picks for You'
					}
					stories={filteredStories}
					onPlay={handlePlayStory}
				/>
			</div>

			{/* Preference onboarding dialog */}
			<PreferenceDialog
				open={showPreferences}
				onClose={() => setShowPreferences(false)}
			/>
		</div>
	)
}
