import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { Check, X } from 'lucide-react'
import { Plate } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { IconButton } from '@/components/aural-ui/icon-button'
import { editorVariants } from '@/components/plate-ui-v2/editor-static'
import DiffView from '@/lib/plate/plugins/diff'
import { cn } from '@/lib/utils/helpers'
import { removeValue } from '@/lib/utils/indexed-db'

import { EDualVIewMode } from '@/types/episode-type'

export default function LocalDiffSection() {
	const { data: content } = useEpisodeContent()
	const {
		store: useEpisodePlateStore,
		setLocalDiffValue,
		setSidebar,
	} = usePlateStore()
	const { setDualViewMode, setEpisodeImported } = useEpisodeIdStore()
	const localDiffValue = useEpisodePlateStore(
		useShallow((state) => state.localDiffValue)
	)
	const editor = useMyEditor({
		content: content?.text || '',
		id: 'local-diff',
		simplified: true,
	})

	function handleReject() {
		setLocalDiffValue(null)
		void removeValue(
			`${content?.chapter.project}_${content?.chapter?.id || content?.chapter?.parent}`
		)
		setSidebar(null)
		setDualViewMode(EDualVIewMode.US_TRANSLATION)
	}

	function handleAccept() {
		setEpisodeImported(true)
		setDualViewMode(EDualVIewMode.US_TRANSLATION)
	}

	return (
		<div className="relative h-full">
			<Plate readOnly editor={editor}>
				<DiffView
					current={localDiffValue}
					readonly
					previous={editor?.children}
					className={cn(
						editorVariants({
							focused: false,
						}),
						'bg-fm-surface-primary text-fm-tertiary rounded-none border-none px-18 py-14'
					)}
				/>
			</Plate>
			<div className="bg-background/60 sticky bottom-0 z-50 flex w-full justify-end gap-4 px-6 py-2 backdrop-blur-[1px]">
				<IconButton
					variant="ghost"
					tooltip="Import Local Changes"
					label="Import Local Changes"
					onClick={handleAccept}
					icon={<Check />}
				/>
				<IconButton
					variant="ghost"
					tooltip="Reject Local Changes"
					label="Reject Local Changes"
					onClick={handleReject}
					icon={<X />}
				/>
			</div>
		</div>
	)
}
