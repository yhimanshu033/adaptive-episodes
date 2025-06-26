'use client'

import React, { useState } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import Explorer from '@/page-builders/plate-editor/sidebar-sections/story-explorer/explorer'

import { Divider } from '@/components/aural-ui/divider'
import Input from '@/components/aural-ui/input'
import Label from '@/components/aural-ui/label'

const StoryExplorer = () => {
	const { data: episodeData } = useEpisodeContent()
	const [episodeRange, setEpisodeRange] = useState({
		start: episodeData?.chapter.seq_number || 1,
		end: (episodeData?.chapter.seq_number || 1) + 9,
	})

	const handleEpisodeChange = (type: 'start' | 'end', value: string) => {
		const parsedValue = parseInt(value)

		if (
			(value !== '' && isNaN(parsedValue)) ||
			episodeRange[type] === parsedValue
		) {
			return
		}

		const clampedValue =
			type === 'start'
				? Math.max(Math.min(parsedValue, episodeRange.end), 1)
				: Math.max(Math.min(parsedValue, Infinity), episodeRange.start)

		setEpisodeRange((prevRange) => ({
			...prevRange,
			[type]: clampedValue,
		}))
	}

	return (
		<section className="bg-fm-surface-primary relative flex h-full flex-col pt-8">
			<div className="space-y-9">
				<div className="flex flex-col gap-3 px-5">
					<Label>Episode Range</Label>
					<div className="flex items-center justify-center gap-2">
						<Input
							type="number"
							min={1}
							onBlur={(e) => {
								if (isNaN(parseInt(e.target.value))) {
									handleEpisodeChange('start', '1')
								}
							}}
							decoration="outline"
							max={episodeRange.end}
							value={String(episodeRange.start)}
							onChange={(e) => handleEpisodeChange('start', e.target.value)}
							className="w-full"
							classes={{
								input: 'border-fm-divider-tertiary bg-black',
							}}
						/>
						<span>-</span>
						<Input
							type="number"
							onBlur={(e) => {
								if (isNaN(parseInt(e.target.value))) {
									handleEpisodeChange('end', '1')
								}
							}}
							min={episodeRange.start}
							value={String(episodeRange.end)}
							onChange={(e) => handleEpisodeChange('end', e.target.value)}
							className="w-full"
							decoration="outline"
							classes={{
								input: 'border-fm-divider-tertiary bg-black',
							}}
						/>
					</div>
				</div>
				<Divider variant="secondary" />
			</div>
			<Explorer {...episodeRange} />
		</section>
	)
}

export default StoryExplorer
