import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useMyEditor from '@/hooks/use-my-editor'
import { useToast } from '@/hooks/use-toast'
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
	const { dismiss } = useToast()

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
		dismiss()
	}

	function handleAccept() {
		setImported(true)
		setDualViewMode(EDualVIewMode.US_TRANSLATION)
		dismiss()
	}

	return (
		<div className="relative h-full">
			<div className="px-6">
				<div className="sticky top-24 flex w-fit gap-4 justify-self-end">
					<Button tooltip="Import Local Changes" onClick={handleAccept}>
						<Check />
					</Button>
					<Button tooltip="Reject Local Changes" onClick={handleReject}>
						<X />
					</Button>
				</div>
				<Plate readOnly editor={editor}>
					<DiffView
						current={localDiffValue}
						readonly
						previous={editor?.children}
						className={cn(
							editorVariants({
								focused: false,
							}),
							'rounded-none border-none bg-background px-0 py-5'
						)}
					/>
				</Plate>
			</div>
		</div>
	)
}
