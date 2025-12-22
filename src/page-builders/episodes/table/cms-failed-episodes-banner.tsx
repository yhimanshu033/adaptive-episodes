import React, { useEffect, useState } from 'react'
import useCMSFailedEpisodes from '@/hooks/query/use-cms-failed-episodes'
import { usePageState } from '@/hooks/use-page-state'
import { AlertIcon } from '@/icons/alert-icon'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import ChevronUpIcon from '@/icons/chevron-up-icon'
import { useEpisodeStore } from '@/store/episode-store'

import { IconButton, IconButtonProps } from '@/components/aural-ui/icon-button'
import { Typography } from '@/components/aural-ui/typography'

const CMSFailedEpisodesBanner = () => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const { data } = useCMSFailedEpisodes()

	const { setFailedSeqNumber, useEpisodeTableStore } = useEpisodeStore()
	const failedSeqNumber = useEpisodeTableStore((state) => state.failedSeqNumber)
	const { limit, setCurrentPage } = usePageState()
	const failedEpisodesCount = data?.total_failed_chapters || 0

	const handlePreviousEpisode = async () => {
		if (currentIndex == 0) {
			return
		}
		const previousEpisodeSeqNumber =
			data?.failed_chapters?.[currentIndex - 1]?.seq_number || null
		setCurrentIndex(currentIndex - 1)
		setFailedSeqNumber(previousEpisodeSeqNumber)
		await setCurrentPage(Math.ceil(previousEpisodeSeqNumber! / limit) || 1)
	}

	const handleNextEpisode = async () => {
		if (currentIndex >= failedEpisodesCount - 1) {
			return
		}
		const nextEpisodeSeqNumber =
			data?.failed_chapters?.[currentIndex + 1]?.seq_number || null
		setCurrentIndex(currentIndex + 1)
		setFailedSeqNumber(nextEpisodeSeqNumber)
		await setCurrentPage(Math.ceil(nextEpisodeSeqNumber! / limit) || 1)
	}

	const handleClose = () => {
		setFailedSeqNumber(-1)
		setCurrentIndex(0)
	}

	useEffect(() => {
		if (
			!failedSeqNumber &&
			data?.failed_chapters?.length &&
			data.failed_chapters.length > 0
		) {
			setFailedSeqNumber(data.failed_chapters[0].seq_number)
			setCurrentIndex(0)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const actionButtons: IconButtonProps[] = [
		{
			icon: <ChevronUpIcon />,
			label: 'Previous Episode',
			onClick: () => void handlePreviousEpisode(),
			disabled: currentIndex === 0,
		},
		{
			icon: <ChevronDownIcon />,
			label: 'Next Episode',
			onClick: () => void handleNextEpisode(),
			disabled: currentIndex === failedEpisodesCount - 1,
		},
		{
			icon: (
				<Typography variant="label-medium" className="text-fm-md">
					CLOSE
				</Typography>
			),
			label: 'Close',
			onClick: handleClose,
			className: 'w-auto px-2',
		},
	]

	return (
		<div className="bg-failed-banner mb-4 flex items-center justify-between p-4">
			<div className="flex items-center gap-2">
				<AlertIcon variant="outline" stroke="#FF8A8A" className="size-4" />
				<Typography variant="label-medium" className="text-fm-md uppercase">
					{failedEpisodesCount} episodes missing
				</Typography>
			</div>
			<div className="flex items-center gap-2">
				{actionButtons.map((button) => (
					<IconButton
						key={button.label}
						variant="outlined"
						size="small"
						shape="square"
						{...button}
					/>
				))}
			</div>
		</div>
	)
}

export default CMSFailedEpisodesBanner
