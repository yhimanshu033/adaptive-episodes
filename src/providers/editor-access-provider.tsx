import React, { useEffect } from 'react'
import { HIDDEN_DATA } from '@/constants/editor-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEditAccess from '@/hooks/use-edit-access'
import usePlateStore from '@/store/plate-store'
import { Lock } from 'lucide-react'
import { usePlateState } from 'platejs/react'

import { jumbleArray, trim } from '@/lib/utils/helpers'

interface EditorAccessProviderProps {
	hideContent?: boolean
}
export default function EditorAccessProvider({
	children,
	hideContent,
}: React.PropsWithChildren & EditorAccessProviderProps) {
	const { cannotEdit } = useEditAccess()
	const { data } = useEpisodeContent()
	const [, setReadOnly] = usePlateState('readOnly')

	const { store } = usePlateStore()
	const viewMode = store((state) => state.viewMode)

	useEffect(() => {
		if (cannotEdit) {
			setTimeout(() => {
				setReadOnly(true)
			}, 0)
			return
		}
		setReadOnly(viewMode)
	}, [cannotEdit, setReadOnly, viewMode])

	if (cannotEdit && hideContent) {
		return (
			<div className="relative my-4">
				<div className="absolute top-0 right-0 bottom-0 flex w-full items-center justify-center gap-4 bg-black/10 px-4 py-12 backdrop-blur-xs">
					<Lock />
					Episode {data?.chapter.seq_number}:{' '}
					{trim(data?.chapter.chapter_title || '')} is currently being edited by
					someone else!
				</div>
				<div className="bg-fm-neutral-100 px-4 py-14">
					<div
						className="mx-auto w-[668px]"
						dangerouslySetInnerHTML={{
							__html: jumbleArray(HIDDEN_DATA).join('<br/>'),
						}}
					/>
				</div>
			</div>
		)
	}
	return <>{children}</>
}
