'use client'

import React from 'react'

import { Button } from '@/components/aural-ui/button'
import DotLoader from '@/components/aural-ui/dot-loader'
import Input from '@/components/aural-ui/input'
import { Label } from '@/components/aural-ui/label'

import { EStoryExpansionTab } from '../lib/types'
import useStoryExpansion from '../provider'

export default function RangeTab() {
	const {
		range,
		setRange,
		episodeCount,
		setStoryExpansionTab,
		storyDataFetching,
	} = useStoryExpansion()

	const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10)
		if (!isNaN(value) && value >= episodeCount) {
			setRange((prev) => ({ ...prev, start: value }))
		}
	}

	const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10)
		if (!isNaN(value) && value > range.start) {
			setRange((prev) => ({ ...prev, end: value }))
		}
	}

	const isValid = range.start >= episodeCount && range.end > range.start

	const handleNext = () => {
		if (isValid) {
			setStoryExpansionTab(EStoryExpansionTab.START)
		}
	}

	if (storyDataFetching || episodeCount === undefined) {
		return (
			<div className="grid h-full items-center justify-center">
				<DotLoader />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-6 p-6">
			<div className="space-y-2">
				<h2 className="text-fm-3xl font-fm-brand text-fm-primary">
					Episode Range
				</h2>
				<p className="text-fm-md text-fm-tertiary">
					Specify the range of episodes you want to create
				</p>
			</div>

			<div className="flex flex-col gap-6">
				<div className="space-y-2">
					<Label htmlFor="start-range">Start Episode</Label>
					<Input
						id="start-range"
						type="number"
						value={range.start}
						onChange={handleStartChange}
						min={episodeCount}
						decoration="outline"
						helperText={
							range.start < episodeCount
								? `Start must be at least ${episodeCount}`
								: undefined
						}
						variant={range.start < episodeCount ? 'error' : 'default'}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="end-range">End Episode</Label>
					<Input
						id="end-range"
						type="number"
						value={range.end}
						onChange={handleEndChange}
						min={range.start + 1}
						decoration="outline"
						helperText={
							range.end <= range.start
								? 'End must be greater than start'
								: undefined
						}
						variant={range.end <= range.start ? 'error' : 'default'}
					/>
				</div>
			</div>

			<div className="flex justify-end">
				<Button
					onClick={handleNext}
					isDisabled={!isValid}
					variant="primary"
					size="md"
				>
					Next
				</Button>
			</div>
		</div>
	)
}
