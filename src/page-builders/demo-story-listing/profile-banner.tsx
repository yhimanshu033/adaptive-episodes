'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Sparkles, TrendingUp } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import { Typography } from '@/components/aural-ui/typography'

import {
	BucketResult,
	ListeningProfile,
	PROFILE_INFO,
} from './preferences/constants'

interface ProfileBannerProps {
	bucketResult?: BucketResult | null
	onChangePreferences: () => void
	profile: ListeningProfile
}

export default function ProfileBanner({
	profile,
	onChangePreferences,
	bucketResult,
}: ProfileBannerProps) {
	const profileInfo = PROFILE_INFO[profile]
	const confidencePercent = bucketResult
		? Math.round(bucketResult.confidence * 100)
		: null

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="mx-6 mb-4"
		>
			<div className="bg-fm-surface-secondary/50 border-fm-divider-secondary flex items-center justify-between gap-4 rounded-xl border p-4 backdrop-blur-sm">
				<div className="flex items-center gap-4">
					{/* Profile emoji */}
					<div className="bg-fm-surface-primary flex size-12 shrink-0 items-center justify-center rounded-full text-2xl shadow-sm">
						{profileInfo.emoji}
					</div>

					{/* Profile info */}
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<Typography variant="label-medium" as="span">
								{profileInfo.title}
							</Typography>
							<div className="bg-fm-secondary-600/10 text-fm-secondary-600 flex items-center gap-1 rounded-full px-2 py-0.5">
								<Sparkles className="size-3" />
								<Typography variant="caption-small">Active</Typography>
							</div>
							{confidencePercent !== null && (
								<div className="text-fm-positive bg-fm-positive/10 flex items-center gap-1 rounded-full px-2 py-0.5">
									<TrendingUp className="size-3" />
									<Typography variant="caption-small">
										{confidencePercent}% match
									</Typography>
								</div>
							)}
						</div>
						<Typography
							variant="body-small"
							color="tertiary"
							className="mt-0.5"
						>
							{profileInfo.description}
						</Typography>
					</div>
				</div>

				{/* Change preferences button */}
				<Button
					variant="outline"
					size="sm"
					leftIcon={<RefreshCw className="size-4" />}
					onClick={onChangePreferences}
					innerClassName="translate-y-0"
				>
					Change
				</Button>
			</div>
		</motion.div>
	)
}
