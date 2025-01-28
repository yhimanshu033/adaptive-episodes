import React, { useMemo } from 'react'
import { TRANSITION_DURATION } from '@/constants/editor-constants'
import DualViewSelector from '@/page-builders/plate-editor/dual-view/dual-view-selector'
import NextEpisode from '@/page-builders/plate-editor/dual-view/next-episode'
import Notes from '@/page-builders/plate-editor/dual-view/notes'
import Translation from '@/page-builders/plate-editor/dual-view/translation'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { useDebounceValue } from 'usehooks-ts'
import { useShallow } from 'zustand/react/shallow'

import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
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

	const [debouncedShowDualView] = useDebounceValue(
		showDualView,
		TRANSITION_DURATION
	)

	const isTransitioning =
		(!debouncedShowDualView && showDualView) || !showDualView

	if ((!showDualView && !debouncedShowDualView) || (!showDualView && sidebar)) {
		return null
	}

	return (
		<>
			<ResizableHandle />
			<ResizablePanel
				minSize={30}
				order={2}
				style={{
					transitionDuration: `${isTransitioning ? TRANSITION_DURATION : 0}ms`,
				}}
				className={cn(
					'flex w-full max-w-full flex-col border transition-all',
					!showDualView && 'max-w-0'
				)}
			>
				<div className="flex items-center justify-between p-4">
					<h1 className="text-2xl font-bold">Dual View</h1>
					<DualViewSelector />
				</div>
				{modeToComponent[dualViewMode]}
			</ResizablePanel>
		</>
	)
}

export default DualView
