'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDemoAuthStore } from '@/store/demo-auth-store'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/aural-ui/card'
import { Typography } from '@/components/aural-ui/typography'
import { SIGNIN_ROUTE, STORIES_ROUTE } from '@/lib/demo-auth'

export default function DemoStoriesPage() {
	const router = useRouter()
	const { isAuthenticated, user, signOut } = useDemoAuthStore()

	useEffect(() => {
		// Client-side safety net; middleware should already protect /stories.
		if (!isAuthenticated) {
			router.replace(SIGNIN_ROUTE)
		}
	}, [isAuthenticated, router])

	return (
		<div className="mx-auto flex min-h-[calc(100vh-0px)] w-full max-w-5xl items-center justify-center px-6 py-14">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle>
						<Typography variant="title-small" as="h1">
							Stories (demo)
						</Typography>
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<Typography variant="body-small" color="tertiary">
						This is a placeholder route so your `/signin` redirect has somewhere
						to go. We’ll add real story routes later.
					</Typography>

					<div className="rounded-fm-s border-fm-divider-secondary bg-fm-surface-secondary border p-4">
						<Typography variant="label-small" as="div" className="mb-2">
							Current user
						</Typography>
						<Typography variant="body-small" color="tertiary">
							{user
								? `${user.fullName} (${user.email}) — DOB: ${user.dob}`
								: 'Not available'}
						</Typography>
					</div>

					<div className="flex flex-wrap gap-3 pt-2">
						<Button
							variant="secondary"
							innerClassName="translate-y-0"
							onClick={() => router.replace(STORIES_ROUTE)}
						>
							Refresh
						</Button>
						<Button
							variant="outline"
							innerClassName="translate-y-0"
							onClick={() => {
								signOut()
								toast.success('Signed out.')
								router.replace(SIGNIN_ROUTE)
							}}
						>
							Log out
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
