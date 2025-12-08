'use client'

import React from 'react'
import Link from 'next/link'
import useUserAccess from '@/hooks/query/use-user-access'

import { Button } from '@/components/aural-ui/button'
import DotLoader from '@/components/aural-ui/dot-loader'

export default function OnboardingAccessControl({
	children,
}: React.PropsWithChildren) {
	const { data: accessData, isLoading: isAccessDataLoading } = useUserAccess()

	if (isAccessDataLoading) {
		return (
			<div className="flex min-h-[80dvh] items-center justify-center">
				<DotLoader />
			</div>
		)
	}

	if (!accessData?.survey_onboarding) {
		return (
			<div className="animate-fade-in-up flex min-h-[80dvh] flex-col items-center justify-center px-6 py-20 text-center">
				<div className="bg-fm-secondary-1000 border-fm-secondary-900 text-fm-secondary-600 max-w-lg rounded-lg border px-6 py-4 shadow-sm">
					<h2 className="font-fm-brand text-fm-secondary-400 mb-4 text-2xl font-semibold">
						Access Restricted!
					</h2>
					<p className="mb-1 text-sm">
						{"You currently don't have permission to access "}
						<strong>Survey Onboarding</strong>.
					</p>
					<p className="mb-6 text-sm">
						Please contact an internal admin or your project owner
						<br /> if you believe this is a mistake.
					</p>
					<Link href="/projects">
						<Button>Go to Home</Button>
					</Link>
				</div>
			</div>
		)
	}

	return children
}
