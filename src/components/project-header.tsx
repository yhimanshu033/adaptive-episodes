import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SAVE_EPISODE_BUTTON_ID } from '@/constants/editor-constants'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import { usePageState } from '@/hooks/use-page-state'
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
import { buildQueryString } from '@/lib/utils/helpers'

const ProjectHeader = ({ initialSeqNumber }: { initialSeqNumber?: number }) => {
	const router = useRouter()
	const { id } = useParams()
	const { limit, userDefaultLimit } = usePageState()
	const queryClient = useQueryClient()
	const { store } = useEditorExtendedStore()
	const extendedEpisodeIds = store(useShallow((state) => state.extended))

	const handleClick = async () => {
		extendedEpisodeIds.forEach((episodeId) => {
			const saveButtonElement = document.getElementById(
				`${SAVE_EPISODE_BUTTON_ID}-${episodeId}`
			)
			saveButtonElement?.click()
		})
		const page = Math.ceil((initialSeqNumber || 1) / limit)
		const queryParams = {
			page: page === 1 ? undefined : page,
			limit: limit === userDefaultLimit ? undefined : limit,
		}
		const queryString = buildQueryString(queryParams)
		router.push(`/projects/${String(id)}${queryString}`)
		await queryClient.refetchQueries({
			queryKey: [EPISODE_LIST_QUERY_KEY],
		})
	}
	return (
		<div className="left-0 top-0 z-50 animate-fade-in-down overflow-hidden border-b bg-background">
			<header className="container flex h-14 animate-fade-in-down items-center justify-between py-1">
				<StoryDetails imageSize={30} titleClassname="text-lg" hideAuthor />
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
						<DropdownMenuContent>
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
