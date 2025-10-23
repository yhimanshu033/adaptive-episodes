'use client'

import React from 'react'

import { EpisodeIdProvider } from '@/providers/episode-id-provider'
import useEpisodeContent, { useEpisodeContentUtil } from '@/hooks/query/use-episode-content'
import { PreviewContent, UnifiedCopilotEditorProvider } from 'unified-editor'
import { IconButton } from '@/components/aural-ui/icon-button'
import { CrossIcon } from '@/icons/cross-icon'
import { useRouter } from 'next/navigation'


const Preview = ({ episodeId }: { episodeId: number }) => {
	const { data } = useEpisodeContentUtil()
	const router = useRouter()
	const handleClick = () => {
		router.back()
	}

	return (
		<div className="bg-fm-surface-primary h-dvh overflow-hidden px-10">
			<IconButton
				icon={<CrossIcon />}
				label="Close Preview"
				className="absolute top-4 right-4 z-10"
				onClick={handleClick}
				variant="ghost"
			/>
			<UnifiedCopilotEditorProvider
				config={
					{
						auth: {
							accessToken: "",
						},
						contentConfig: {
							content: data?.text || "",
							seqNumber: data?.chapter?.seq_number,
							title: data?.chapter?.chapter_title,
						}
					}
				}>
				<PreviewContent />
			</UnifiedCopilotEditorProvider>
		</div>
	)
}

export default Preview
