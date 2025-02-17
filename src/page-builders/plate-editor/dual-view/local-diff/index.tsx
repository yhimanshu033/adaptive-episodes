import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { Plate } from '@udecode/plate-common/react'
import { Check, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { editorVariants } from '@/components/plate-ui/editor-static'
import { Button } from '@/components/ui/button'
import DiffView from '@/lib/plate/plugins/diff'
import { cn } from '@/lib/utils/helpers'
import { removeValue } from '@/lib/utils/indexed-db'

import { EDualVIewMode } from '@/types/episode-type'

export default function LocalDiffSection() {
	const { data: content, setImported } = useEpisodeContent()
	const {
		store: useEpisodePlateStore,
		setLocalDiffValue,
		setSidebar,
	} = usePlateStore()
	const { setDualViewMode } = useEpisodeIdStore()
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
		void removeValue(`${content?.chapter.project}_${content?.chapter?.parent}`)
		setSidebar(null)
		setDualViewMode(EDualVIewMode.US_TRANSLATION)
	}

	function handleAccept() {
		setImported(true)
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
						'rounded-none border-none bg-background px-6 py-5'
					)}
				/>
			</Plate>
			<div className="sticky bottom-0 z-50 flex w-full justify-end gap-4 bg-background/60 px-6 py-2 backdrop-blur-[1px]">
				<Button tooltip="Import Local Changes" onClick={handleAccept}>
					<Check />
				</Button>
				<Button tooltip="Reject Local Changes" onClick={handleReject}>
					<X />
				</Button>
			</div>
		</div>
	)
}
