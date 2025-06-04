import React, { useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { SAVE_EPISODE_BUTTON_ID } from '@/constants/editor-constants'
import { HIDE_HEADER } from '@/constants/global-constants'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import useEditorExtendedStore from '@/store/extended-store'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, EllipsisVertical } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import SettingsButton from '@/components/settings-button'
import StoryDetails from '@/components/story-details'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { addOpenedEpisodeList } from '@/lib/utils/indexed-db'

const ProjectHeader = ({ initialSeqNumber }: { initialSeqNumber?: number }) => {
	const router = useRouter()
	const { id } = useParams()
	const queryClient = useQueryClient()
	const { store } = useEditorExtendedStore()
	const extendedEpisodeIds = store(useShallow((state) => state.extended))
	const hideHeader = useSearchParams().get(HIDE_HEADER)

	useEffect(() => {
		if (!initialSeqNumber || !id) {
			return
		}
		void addOpenedEpisodeList({
			data: {
				seqNumber: initialSeqNumber,
				page: 1,
				search: '',
			},
			project: Number(id),
		})
	}, [initialSeqNumber, id])

	const handleClick = async () => {
		extendedEpisodeIds.forEach((episodeId) => {
			const saveButtonElement = document.getElementById(
				`${SAVE_EPISODE_BUTTON_ID}-${episodeId}`
			)
			saveButtonElement?.click()
		})
		router.push(`/projects/${String(id)}`)
		await queryClient.invalidateQueries({
			queryKey: [EPISODE_LIST_QUERY_KEY, Number(id)],
		})
	}

	if (hideHeader) {
		return null
	}

	return (
		<div className="animate-fade-in-down bg-background top-0 left-0 z-50 overflow-hidden border-b">
			<header className="animate-fade-in-down container flex h-14 items-center justify-between py-1">
				<StoryDetails
					handleClick={() => void handleClick()}
					imageSize={30}
					titleClassname="text-lg"
					hideAuthor
				/>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => void handleClick()}
					>
						<ArrowLeft size={16} className="mr-2" />
						Back to Episodes
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<EllipsisVertical size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem className="p-0">
								<ThemeToggle label className="w-full" />
							</DropdownMenuItem>
							<DropdownMenuItem className="p-0">
								<SettingsButton label className="w-full justify-start" />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>
		</div>
	)
}

export default ProjectHeader
