import React, { useCallback, useMemo } from 'react'
import {
	useUGCInventMutation,
	useUGCPublishMutation,
} from '@/hooks/mutation/use-ugc-action-mutations'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useIsUGC from '@/hooks/ugc/use-is-ugc'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { UploadIcon } from '@/icons/upload-icon'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { IfElse } from '@/components/aural-ui/if-else'

export default function UGCActions() {
	const isUGC = useIsUGC()
	const { data: episodeData } = useEpisodeContent()

	if (!isUGC || !!episodeData?.next_parent_id) {
		return null
	}

	return (
		<IfElse
			condition={episodeData?.chapter?.props?.nwm_running === false}
			if={<UGCNextButton />}
			else={<UGCPublishButton />}
		/>
	)
}

function UGCPublishButton() {
	const { mutateAsync, isPending } = useUGCPublishMutation()
	const { data: episodeData, refetch } = useEpisodeContent()

	const handlePublish = useCallback(async () => {
		const resp = await mutateAsync()
		if (resp) {
			await refetch()
		}
	}, [mutateAsync, refetch])

	const isRunning = useMemo(() => {
		return episodeData?.chapter?.props?.nwm_running || isPending
	}, [episodeData, isPending])

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
