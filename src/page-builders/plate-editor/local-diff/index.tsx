import React from 'react'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import usePlateStore from '@/store/plate-store'
import { createPlateEditor, Plate } from '@udecode/plate-common/react'
import { Check, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { editorVariants } from '@/components/plate-ui/editor-static'
import { Button } from '@/components/ui/button'
import DiffView from '@/lib/plate/plugins/diff'
import { cn } from '@/lib/utils/helpers'
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

	const value = breakDownValue(jsonify(content?.text || ''))

	const editor = createPlateEditor({
		value,
		id: 'LOCAL_DIFF_EDITOR_ID',
	})

	function handleReject() {
		setImported(true)
	}

	function handleAccept() {
		setLocalDiffValue(null)
		setSidebar(null)
	}

	return (
		<div className="border px-12 py-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Incoming Changes</h1>
				<div className="flex items-center gap-4">
					<Button tooltip="Accept Incoming Changes" onClick={handleAccept}>
						<Check />
					</Button>
					<Button tooltip="Reject Incoming Changes" onClick={handleReject}>
						<X />
					</Button>
				</div>
			</div>

			<Plate readOnly editor={editor}>
				<DiffView
					current={value}
					previous={localDiffValue}
					className={cn(
						editorVariants({
							focused: false,
						}),
						'rounded-none border-none bg-background px-0 py-5'
					)}
				/>
			</Plate>
		</div>
	)
}
