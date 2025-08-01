'use client'

import React, { useState } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useDebounce } from '@/hooks/use-debounce'
import Explorer from '@/page-builders/plate-editor/sidebar-sections/story-explorer/explorer'
import { toast } from 'sonner'

import { Divider } from '@/components/aural-ui/divider'
import Input from '@/components/aural-ui/input'
import Label from '@/components/aural-ui/label'

const StoryExplorer = () => {
	const { data: episodeData } = useEpisodeContent()
	const [episodeRange, setEpisodeRange] = useState({
		start: episodeData?.chapter.seq_number || 1,
		end: (episodeData?.chapter.seq_number || 1) + 9,
	})
	const debouncedEpisodeRange = useDebounce(episodeRange, 500)

	const handleEpisodeChange = (type: 'start' | 'end', value: string) => {
		const parsedValue = parseInt(value)
		if (episodeRange[type] === parsedValue) {
			return
		}
		if (isNaN(parsedValue)) {
			toast.error('Enter a valid value!')
			return
		}

		const clampedValue =
			type === 'start'
				? Math.max(Math.min(parsedValue, episodeRange.end), 1)
				: Math.max(parsedValue, episodeRange.start)

		if (clampedValue !== parsedValue) {
			toast.info(
				`The ${type} value '${parsedValue}' is invalid, considering '${clampedValue}'`
			)
		}

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
							onBlur={(e) => {
								if (isNaN(parseInt(e.target.value))) {
									handleEpisodeChange('start', '1')
								}
							}}
							decoration="outline"
							defaultValue={String(episodeRange.start)}
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
							defaultValue={String(episodeRange.end)}
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
			<Explorer {...debouncedEpisodeRange} />
		</section>
	)
}

export default StoryExplorer
