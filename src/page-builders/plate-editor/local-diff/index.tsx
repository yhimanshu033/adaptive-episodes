import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useToast } from '@/hooks/use-toast'
import usePlateStore from '@/store/plate-store'
import { createPlateEditor, Plate } from '@udecode/plate-common/react'
import { Check, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { editorVariants } from '@/components/plate-ui/editor-static'
import { Button } from '@/components/ui/button'
import DiffView from '@/lib/plate/plugins/diff'
import { cn } from '@/lib/utils/helpers'
import { removeValue } from '@/lib/utils/indexed-db'
import { breakDownValue, jsonify } from '@/lib/utils/plate'

export default function LocalDiffSection() {
	const { data: content, setImported } = useEpisodeContent()
	const {
		store: useEpisodePlateStore,
		setLocalDiffValue,
		setSidebar,
	} = usePlateStore()
	const localDiffValue = useEpisodePlateStore(
		useShallow((state) => state.localDiffValue)
	)
	const { dismiss } = useToast()

	const value = breakDownValue(jsonify(content?.text || ''))

	const editor = createPlateEditor({
		value,
		id: 'LOCAL_DIFF_EDITOR_ID',
	})

	function handleReject() {
		setLocalDiffValue(null)
		void removeValue(`${content?.chapter.project}_${content?.chapter?.parent}`)
		setSidebar(null)
		dismiss()
	}

	function handleAccept() {
		setImported(true)
		dismiss()
	}

	return (
		<div className="relative grid grid-cols-2 grid-rows-[auto_1fr] border px-12 py-6">
			<h1 className="text-2xl font-semibold">Local Changes</h1>
			<div className="sticky right-12 top-16 z-30 flex w-fit gap-4 justify-self-end">
				<Button tooltip="Import Local Changes" onClick={handleAccept}>
					<Check />
				</Button>
				<Button tooltip="Reject Local Changes" onClick={handleReject}>
					<X />
				</Button>
			</div>
			<div className="col-span-full">
				<Plate readOnly editor={editor}>
					<DiffView
						current={localDiffValue}
						readonly
						previous={value}
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
