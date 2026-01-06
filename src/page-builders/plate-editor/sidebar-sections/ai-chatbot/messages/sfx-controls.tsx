import React, { useCallback } from 'react'
import ChevronDownIcon from '@/icons/chevron-down-icon'
import ChevronUpIcon from '@/icons/chevron-up-icon'
import { TickIcon } from '@/icons/tick-icon'
import ApplyChangesAlert from '@/page-builders/episodes/dialogs/apply-changes-alert'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Typography } from '@/components/aural-ui/typography'
import { scrollToDivWithId } from '@/lib/utils/client-helpers'
import { getDiffLeafID } from '@/lib/utils/plate'

const SFXControls = ({
	index,
	handleAccept,
	sfxIndex,
	diffIdList,
	setActiveDiffId,
}: {
	diffIdList: string[]
	handleAccept: (index: number, accept: boolean, isChanges: boolean) => void
	index: number
	setActiveDiffId: (id: string) => void
	sfxIndex: number
}) => {
	const handleNavigation = useCallback(
		(direction: number = 1) => {
			const idx = (sfxIndex + direction) % diffIdList.length
			const diffId = diffIdList[idx]
			if (!diffId) {
				return
			}
			setActiveDiffId(diffId)
			scrollToDivWithId(getDiffLeafID(diffId))
		},
		[sfxIndex, diffIdList, setActiveDiffId]
	)
	return (
		<div className="flex w-full items-center gap-1">
			<Button
				variant="outline"
				size="sm"
				onClick={() => handleAccept(index, true, true)}
				innerClassName="border-fm-divider-primary/50 h-9"
			>
				<TickIcon />
				Apply all
			</Button>
			<ApplyChangesAlert onConfirm={() => handleAccept(index, false, true)}>
				<Button
					variant="outline"
					size="sm"
					innerClassName="border-fm-divider-primary/50 h-9"
				>
					Done
				</Button>
			</ApplyChangesAlert>
			<div className="flex flex-1 items-center justify-end gap-1">
				<IconButton
					size="small"
					label="Previous sfx"
					variant="ghost"
					disabled={sfxIndex <= 0}
					onClick={() => handleNavigation(-1)}
					className="text-fm-secondary-800"
					icon={<ChevronUpIcon className="h-5 w-5" />}
				/>
				<Typography
					as="p"
					variant="display-small"
					className="text-fm-secondary-800 !text-fm-sm"
				>
					{sfxIndex + 1}/{diffIdList.length}
				</Typography>
				<IconButton
					size="small"
					label="Next sfx"
					variant="ghost"
					disabled={sfxIndex >= diffIdList.length - 1}
					onClick={() => handleNavigation(1)}
					className="text-fm-icon-brand-secondary"
					icon={<ChevronDownIcon className="h-5 w-5" />}
				/>
			</div>
		</div>
	)
}

export default SFXControls
