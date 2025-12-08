import React, { useMemo } from 'react'
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
	episodeId?: number
}
export default function EpisodeConfig({ episodeId }: EpisodeConfigProps) {
	const { mutate: mutateMetadataSync, isPending: isMetadataSyncPending } =
		useMetadataSyncMutation(episodeId)

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

		return configItems
	}, [mutateMetadataSync, isMetadataSyncPending])

	return (
		<ForEach data={episodeConfigurationItems}>
			{(item, idx) => (
				<ConfigurationContentItem item={item} key={`config-ep-item-${idx}`} />
			)}
		</ForEach>
	)
}
