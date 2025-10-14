import React, { useMemo } from 'react'
import { useEpisodeRegenerate } from '@/hooks/mutation/use-episode-regenerate'
import useMetadataSyncMutation from '@/hooks/mutation/use-metadata-sync'
import { SpinnerSolidIcon } from '@/icons/spinner-solid-icon'
import { ConfigurationContentItem } from '@/page-builders/plate-editor/configuration-dialog/items'

import { Button } from '@/components/aural-ui/button'
import ForEach from '@/components/ui/for-each'

import {
	EConfigurationContentItemDataType,
	TConfigurationContentItem,
} from '@/types/editor-types'

export interface EpisodeConfigProps {
	allowNWM?: boolean
	episodeId?: number
}
export default function EpisodeConfig({
	episodeId,
	allowNWM,
}: EpisodeConfigProps) {
	const { mutate: mutateMetadataSync, isPending: isMetadataSyncPending } =
		useMetadataSyncMutation(episodeId)
	const { mutate: mutateNwm, isPending: isNwmPending } = useEpisodeRegenerate()

	const episodeConfigurationItems = useMemo(() => {
		const configItems: TConfigurationContentItem[] = [
			{
				title: 'Sync AI Metadata',
				description:
					'Refresh your AI context to improve response accuracy and relevance',
				data: {
					type: EConfigurationContentItemDataType.CUSTOM,
					customHandler: (
						<Button
							variant="outline"
							size="sm"
							rightIcon={
								isMetadataSyncPending && (
									<SpinnerSolidIcon className="animate-spin" />
								)
							}
							onClick={() => mutateMetadataSync()}
							disabled={isMetadataSyncPending}
							isDisabled={isMetadataSyncPending}
						>
							AI Sync
						</Button>
					),
				},
			},
		]
		if (allowNWM && episodeId) {
			configItems.push({
				title: 'Enable NWM (Beatsheet Editor)',
				description:
					'Start the NWM process to activate the Beatsheet Editor features.',
				data: {
					type: EConfigurationContentItemDataType.CUSTOM,
					customHandler: (
						<Button
							variant="outline"
							size="sm"
							rightIcon={
								isNwmPending && <SpinnerSolidIcon className="animate-spin" />
							}
							onClick={() => mutateNwm({ episodeId })}
							disabled={isNwmPending}
							isDisabled={isNwmPending}
						>
							Run NWM
						</Button>
					),
				},
			})
		}

		return configItems
	}, [
		allowNWM,
		episodeId,
		mutateNwm,
		isNwmPending,
		mutateMetadataSync,
		isMetadataSyncPending,
	])

	return (
		<ForEach data={episodeConfigurationItems}>
			{(item, idx) => (
				<ConfigurationContentItem item={item} key={`config-ep-item-${idx}`} />
			)}
		</ForEach>
	)
}
