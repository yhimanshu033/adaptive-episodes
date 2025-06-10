import React from 'react'
import { useRouter } from 'next/navigation'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { CrossIcon } from '@/icons/cross-icon'
import { Value } from '@udecode/plate'

import { IconButton } from '@/components/aural-ui/icon-button'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { getText, jsonify } from '@/lib/utils/plate'

const PreviewContent = () => {
	const router = useRouter()
	const { data } = useEpisodeContent()

	const handleClick = () => {
		router.back()
	}

	const content = getText(jsonify(data?.text || '') as Value)

	return (
		<div className="bg-fm-surface-primary h-dvh overflow-hidden px-10">
			<IconButton
				icon={<CrossIcon />}
				label="Close Preview"
				className="absolute top-4 right-4 z-10"
				onClick={handleClick}
				variant="ghost"
			/>
			<div className="border-fm-divider-tertiary mx-auto max-w-160 border-x">
				<ScrollArea className="h-dvh">
					<div className="border-fm-divider-tertiary flex flex-col-reverse gap-2 border-b px-14 py-12">
						<h1 className="text-fm-primary font-fm-text [font-size:var(--text-fm-2xl)]">
							{data?.chapter?.chapter_title || 'Episode Title'}
						</h1>
						{data?.chapter?.seq_number && (
							<p className="text-fm-tertiary font-fm-brand leading-fm-xl [font-size:var(--text-fm-xl)] uppercase">
								{`Ep${data?.chapter?.seq_number < 9 ? `0${data?.chapter.seq_number}` : data?.chapter.seq_number}`}
							</p>
						)}
					</div>
					<div className="px-14 py-12">
						<p className="text-fm-primary font-fm-text leading-fm-xl [font-size:var(--text-fm-xl)]">
							{content}
						</p>
					</div>
				</ScrollArea>
			</div>
		</div>
	)
}

export default PreviewContent
