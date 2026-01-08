'use client'

import React from 'react'
import {
	Book,
	Headphones,
	RefreshCw,
	Search,
	Settings,
	Zap,
} from 'lucide-react'

import { IconButton } from '@/components/aural-ui/icon-button'
import { Tag } from '@/components/aural-ui/tag'
import { Typography } from '@/components/aural-ui/typography'

import { ListeningProfile, PROFILE_INFO } from './preferences/constants'

interface StoryTopbarProps {
	name: string
	onOpenPreferences: () => void
	onQueryChange: (q: string) => void
	profile: ListeningProfile | null
	query: string
}

const profileIcons: Record<ListeningProfile, React.ReactNode> = {
	speed: <Zap className="size-3.5" />,
	immersive: <Headphones className="size-3.5" />,
	distracted: <RefreshCw className="size-3.5" />,
	original: <Book className="size-3.5" />,
}

export default function StoryTopbar({
	name,
	query,
	onQueryChange,
	onOpenPreferences,
	profile,
}: StoryTopbarProps) {
	return (
		<header className="bg-fm-surface-primary/80 sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-4 backdrop-blur-md">
			{/* Left: Greeting */}
			<div className="shrink-0">
				<Typography
					variant="caption-small"
					color="tertiary"
					className="tracking-wider uppercase"
				>
					Hello
				</Typography>
				<Typography variant="label-medium" as="div">
					{name || 'Guest'}
				</Typography>
			</div>

			{/* Center: Search */}
			<div className="relative mx-4 w-full max-w-xl">
				<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
					<Search className="text-fm-tertiary size-5" />
				</div>
				<input
					type="text"
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					placeholder="Search for audio series, artists"
					className="bg-fm-surface-secondary text-fm-primary placeholder:text-fm-tertiary focus:ring-fm-divider-contrast h-11 w-full rounded-full border-none py-2 pr-4 pl-12 text-sm transition-shadow focus:ring-2 focus:outline-none"
				/>
			</div>

			{/* Right: Profile badge + Preferences */}
			<div className="flex shrink-0 items-center gap-3">
				{profile && (
					<button
						onClick={onOpenPreferences}
						className="hover:bg-fm-surface-secondary hidden items-center gap-2 rounded-full px-3 py-1.5 transition-colors sm:flex"
					>
						<Tag
							variant="promotional"
							color={
								profile === 'speed'
									? 'hotpink'
									: profile === 'immersive'
										? 'emerald'
										: 'electricblue'
							}
							emphasis="secondary"
							size="xs"
							leftIcon={profileIcons[profile]}
							className="rounded-full"
						>
							{PROFILE_INFO[profile].title}
						</Tag>
					</button>
				)}
				<IconButton
					icon={<Settings className="size-5" />}
					size="medium"
					variant="ghost"
					label="Preferences"
					onClick={onOpenPreferences}
				/>
			</div>
		</header>
	)
}
