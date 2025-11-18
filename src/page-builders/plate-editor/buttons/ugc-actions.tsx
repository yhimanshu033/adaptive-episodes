import React, { useCallback, useMemo } from 'react'
import {
	useUGCInventMutation,
	useUGCPublishMutation,
} from '@/hooks/mutation/use-ugc-action-mutations'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useIsUGC from '@/hooks/ugc/use-is-ugc'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { UploadIcon } from '@/icons/upload-icon'
import {
	GLOBAL_USERS,
	OUTLINER_ENABLED_PROJECTS,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/constants'
import { useGlobalStore } from '@/store/global-store'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { IfElse } from '@/components/aural-ui/if-else'
import { hasNWMRan } from '@/lib/utils/helpers'

export default function UGCActions() {
	const isUGC = useIsUGC()
	const { data: episodeData } = useEpisodeContent()
	const userData = useGlobalStore(useShallow((state) => state.userData))

	if (
		!(
			isUGC || GLOBAL_USERS.has(userData?.user?.email?.toLowerCase?.() || '')
		) ||
		!!episodeData?.next_parent_id ||
		!OUTLINER_ENABLED_PROJECTS.has(episodeData?.chapter.project ?? 0)
	) {
		return null
	}

	return (
		<IfElse
			condition={hasNWMRan(episodeData?.chapter)}
			if={<UGCNextButton />}
			else={<UGCPublishButton />}
		/>
	)
}

function UGCPublishButton() {
	const { mutateAsync, isPending } = useUGCPublishMutation()

	const handlePublish = useCallback(async () => {
		const resp = await mutateAsync()
		if (resp) {
			window.location.reload()
		}
	}, [mutateAsync])

	const isRunning = useMemo(() => {
		return isPending
	}, [isPending])

	return (
		<Button
			size="sm"
			tooltip="Publish Chapter"
			onClick={() => void handlePublish()}
			disabled={isRunning}
			isDisabled={isRunning}
			rightIcon={isRunning ? <CircularLoader /> : <UploadIcon />}
		>
			Publish
		</Button>
	)
}

function UGCNextButton() {
	const { mutate, isPending } = useUGCInventMutation()

	return (
		<Button
			size="sm"
			tooltip="Create Next Chapter"
			onClick={() => mutate()}
			disabled={isPending}
			isDisabled={isPending}
			rightIcon={
				isPending ? <CircularLoader /> : <ArrowRightIcon className="size-3" />
			}
		>
			Next
		</Button>
	)
}
