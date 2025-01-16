'use client'

import React, { useState } from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import Explorer from '@/page-builders/plate-editor/sidebar-sections/story-explorer/explorer'

import { Input } from '@/components/ui/input'

const StoryExplorer = () => {
	const { data: episodeData } = useEpisodeContent()
	const [episodeRange, setEpisodeRange] = useState({
		start: episodeData?.chapter.seq_number || 1,
		end: (episodeData?.chapter.seq_number || 1) + 9,
	})

	const handleEpisodeChange = (type: 'start' | 'end', value: string) => {
		setEpisodeRange((prevRange) => ({
			...prevRange,
			[type]: parseInt(value),
		}))
	}

	return (
		<section className="mx-auto max-w-2xl p-4">
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Story Explorer</h1>
				<div className="flex items-center space-x-2">
					<span className="font-bold">Episode Range:</span>
					<Input
						type="number"
						min={1}
						max={episodeRange.end}
						value={episodeRange.start}
						onChange={(e) => handleEpisodeChange('start', e.target.value)}
						className="w-16 text-center"
					/>
					<span>-</span>
					<Input
						type="number"
						min={episodeRange.start}
						value={episodeRange.end}
						onChange={(e) => handleEpisodeChange('end', e.target.value)}
						className="w-16 text-center"
					/>
				</div>
			</div>
			<Explorer {...episodeRange} />
		</section>
	)
}

export default StoryExplorer
