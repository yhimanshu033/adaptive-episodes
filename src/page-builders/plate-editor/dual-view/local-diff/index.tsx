import React from 'react'
import useEditorData from '@/hooks/plate/use-editor-data'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { TickIcon } from '@/icons/tick-icon'
import ApplyChangesAlert from '@/page-builders/episodes/dialogs/apply-changes-alert'
import DiffEditor from '@/page-builders/plate-editor/diff-editor'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { useEditorRef } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import { editorVariants } from '@/components/plate-ui-v2/editor-static'
import { cn } from '@/lib/utils/helpers'
import { removeValue } from '@/lib/utils/indexed-db'
import { getAcceptedDiffValue } from '@/lib/utils/plate'

import { EDualVIewMode } from '@/types/episode-type'

export default function LocalDiffSection() {
	const { data: content } = useEpisodeContent()
	const {
		store: useEpisodePlateStore,
		setLocalDiffValue,
		setSidebar,
	} = usePlateStore()
	const { setDualViewMode, store: useEpisodeIdContext } = useEpisodeIdStore()
	const localDiffValue = useEpisodePlateStore(
		useShallow((state) => state.localDiffValue)
	)
	const acceptedDiffValue = useEpisodeIdContext(
		useShallow((state) => state.acceptedDiffValue)
	)
	const { children } = useEditorData()
	const editor = useEditorRef()

	function handleAccept(all = false) {
		setLocalDiffValue(null)
		void removeValue(`${content?.chapter.project}_${content?.chapter?.id}`)
		setSidebar(null)
		setDualViewMode(EDualVIewMode.US_TRANSLATION)
		if (acceptedDiffValue) {
			const acceptedValue = getAcceptedDiffValue({
				value: acceptedDiffValue,
				all,
				isSfx: false,
			})
			editor.tf.setValue(acceptedValue)
		}
	}

	return (
		<div className="relative h-full">
			<DiffEditor
				current={localDiffValue}
				// readonly
				previous={children}
				className={cn(
					editorVariants({
						focused: false,
					}),
					'bg-fm-surface-primary text-fm-tertiary rounded-none border-none py-14'
				)}
			/>
			<div className="bg-background/60 sticky bottom-0 z-50 flex w-full justify-end gap-4 px-6 py-2 backdrop-blur-[1px]">
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleAccept(true)}
					innerClassName="border-fm-divider-primary/50 h-9"
				>
					<TickIcon />
					Apply all
				</Button>
				<ApplyChangesAlert onConfirm={() => handleAccept(false)}>
					<Button
						variant="outline"
						size="sm"
						innerClassName="border-fm-divider-primary/50 h-9"
					>
						Done
					</Button>
				</ApplyChangesAlert>
			</div>
		</div>
	)
}
