import React, { useMemo } from 'react'
import { statuses, titleToStatus } from '@/constants/episodes-constants'
import useAccessChecks from '@/hooks/use-access-checks'
import useEditAccess from '@/hooks/use-edit-access'
import useLanguage from '@/hooks/use-language'
import useVersions from '@/hooks/use-versions'
import CommonApplyChangesAlert from '@/page-builders/episodes/dialogs/common-apply-changes-alert'
import { Eye } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import CircularLoader from '@/components/aural-ui/circular-loader'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/aural-ui/select'
import { useEpisodeContext } from '@/providers/episode-id-provider'

import { BASE_STATUS, EStatus } from '@/types/common'

const Versions = ({
	isChildEpisode,
	latestStatus,
}: {
	isChildEpisode: boolean
	latestStatus: EStatus | typeof BASE_STATUS
}) => {
	const { useEpisodeIdStoreContext } = useEpisodeContext()
	const selectedStatus = useEpisodeIdStoreContext(
		useShallow((s) => s.selectedStatus)
	)
	const {
		handleConfirm,
		handleSelect,
		isDialogOpen,
		latestIndex,
		setIsDialogOpen,
		currentSelection,
		statusUpdateMutation,
	} = useVersions({
		isChildEpisode,
		latestStatus,
	})

	const currentLanguage = useLanguage()

	const { isGerman, isOriginal, isOriginalEp } = useAccessChecks()
	const { noAccess } = useEditAccess()

	const statusesEnabled = useMemo(() => {
		if (isGerman) {
			return true
		}
		return isOriginalEp(currentLanguage) && isOriginal
	}, [isGerman, isOriginalEp, currentLanguage, isOriginal])

	if (!statusesEnabled) {
		return null
	}

	if (statusUpdateMutation.isPending) {
		return <CircularLoader className="size-4" />
	}

	return (
		<>
			<Select
				value={selectedStatus || statuses[latestIndex]}
				disabled={noAccess}
				onValueChange={handleSelect}
			>
				<SelectTrigger
					disabled={noAccess}
					decoration="outline"
					classes={{
						root: 'border-fm-divider-secondary font-fm-brand h-auto rounded-full text-nowrap [&_>span]:text-left',
						icon: 'size-4',
					}}
				>
					<SelectValue placeholder="Version" />
				</SelectTrigger>
				<SelectContent
					align="end"
					classes={{
						scrollButton: {
							icon: 'size-4',
						},
					}}
				>
					{statuses.map((status, index) => (
						<div key={index}>
							<SelectItem
								disabled={index > latestIndex + Number(!isChildEpisode)}
								value={status}
								className="cursor-pointer"
								classes={{
									root: '[font-size:var(--text-fm-sm)]',
									icon: 'size-4',
								}}
							>
								{titleToStatus[status]}
								{index < latestIndex + Number(isChildEpisode) && (
									<Eye className="ml-2 inline" size={16} />
								)}
							</SelectItem>
							{index < statuses.length - 1 && <SelectSeparator />}
						</div>
					))}
				</SelectContent>
			</Select>
			<CommonApplyChangesAlert
				props={{
					open: isDialogOpen,
					onOpenChange: setIsDialogOpen,
				}}
				title="Confirm Selection"
				description={`Are you sure you want to switch to ${titleToStatus[currentSelection as EStatus] || currentSelection}?`}
				onConfirm={() => void handleConfirm()}
			/>
		</>
	)
}

export default Versions
