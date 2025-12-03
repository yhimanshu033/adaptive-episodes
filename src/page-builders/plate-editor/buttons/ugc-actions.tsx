import React, { useCallback, useMemo } from 'react'
import {
	useUGCInventMutation,
	useUGCPublishMutation,
} from '@/hooks/mutation/use-ugc-action-mutations'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { UploadIcon } from '@/icons/upload-icon'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { IfElse } from '@/components/aural-ui/if-else'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { hasNWMRan } from '@/lib/utils/helpers'

export default function UGCActions() {
	const { data: episodeData } = useEpisodeContent()
	const { initialStoryData } = useEpisodeTableContext()

	if (!!episodeData?.next_parent_id || !initialStoryData?.props?.from_scratch) {
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
		toast.info('Publishing Episode...')
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
