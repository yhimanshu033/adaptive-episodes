'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'

import { Input } from '@/components/ui/input'

import Explorer from './explorer'

const StoryExplorer = () => {
	const { episodeId } = useParams()
	const [episodeRange, setEpisodeRange] = useState({
		start: episodeId as string,
		end: episodeId as string,
	})

	const handleEpisodeChange = (type: 'start' | 'end', value: string) => {
		setEpisodeRange((prevRange) => ({
			...prevRange,
			[type]: value,
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
			<Explorer start={episodeRange.start} end={episodeRange.end} />
		</section>
	)
}

export default StoryExplorer
