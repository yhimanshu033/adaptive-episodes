import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SAVE_EPISODE_BUTTON_ID } from '@/constants/editor-constants'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import useEditorExtendedStore from '@/store/extended-store'
import { useQueryClient } from '@tanstack/react-query'
import { Home } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'

export default function HomeButton() {
	const { store } = useEditorExtendedStore()
	const extendedEpisodeIds = store(useShallow((state) => state.extended))
	const router = useRouter()
	const queryClient = useQueryClient()
	const { id } = useParams()

	const handleClick = async () => {
		extendedEpisodeIds.forEach((episodeId) => {
			const saveButtonElement = document.getElementById(
				`${SAVE_EPISODE_BUTTON_ID}-${episodeId}`
			)
			saveButtonElement?.click()
		})
		router.replace(`/projects/${String(id)}`)
		await queryClient.invalidateQueries({
			queryKey: [EPISODE_LIST_QUERY_KEY, Number(id)],
		})
	}

	return (
		<Button
			size="icon"
			variant="outline"
			className="rounded-full"
			onClick={() => void handleClick()}
		>
			<Home />
		</Button>
	)
}
