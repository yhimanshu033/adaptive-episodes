import React, { useMemo } from 'react'
import DualViewSelector from '@/page-builders/plate-editor/dual-view/dual-view-selector'
import NextEpisode from '@/page-builders/plate-editor/dual-view/next-episode'
import Notes from '@/page-builders/plate-editor/dual-view/notes'
import Translation from '@/page-builders/plate-editor/dual-view/translation'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

import { cn } from '@/lib/utils/helpers'

import { EDualVIewMode, TranslationProps } from '@/types/episode-type'
import { ESidebar } from '@/types/plate-types'

const DualView = ({ translatedContent }: TranslationProps) => {
	const { store } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const showDualView = sidebar === ESidebar.DUAL_VIEW

	const modeToComponent: Record<EDualVIewMode, React.ReactNode> = useMemo(
		() => ({
			[EDualVIewMode.US_TRANSLATION]: (
				<Translation translatedContent={translatedContent} />
			),
			[EDualVIewMode.NEXT_EP]: <NextEpisode />,
			[EDualVIewMode.NOTES]: <Notes />,
		}),
		[translatedContent]
	)

	const { store: useEpisodeIdStoreContext } = useEpisodeIdStore()
	const dualViewMode = useEpisodeIdStoreContext(
		useShallow((state) => state.dualViewMode)
	)

	if (!showDualView) return null
	return (
		<div
			className={cn(
				'flex w-full transition-all duration-200',
				!showDualView ? 'max-w-0' : 'max-w-[45vw] pl-5'
			)}
		>
			<div className="flex w-full flex-col border">
				<div className="flex items-center justify-between p-4">
					<h1 className="text-2xl font-bold">Dual View</h1>
					<DualViewSelector />
				</div>
				{modeToComponent[dualViewMode]}
			</div>
		</div>
	)
}

export default DualView
