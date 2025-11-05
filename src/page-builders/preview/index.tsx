'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useEpisodeContentUtil } from '@/hooks/query/use-episode-content'
import { CrossIcon } from '@/icons/cross-icon'
import { PreviewContent, UnifiedCopilotEditorProvider } from 'unified-editor'

import { IconButton } from '@/components/aural-ui/icon-button'

const Preview = () => {
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
				config={{
					auth: {
						accessToken: '',
					},
					contentConfig: {
						content: data?.text || '',
						seqNumber: data?.chapter?.seq_number,
						title: data?.chapter?.chapter_title,
					},
				}}
			>
				<PreviewContent />
			</UnifiedCopilotEditorProvider>
		</div>
	)
}

export default Preview
