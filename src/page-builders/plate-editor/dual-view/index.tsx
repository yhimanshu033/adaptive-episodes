import React, { useMemo } from 'react'
import { TRANSITION_DURATION } from '@/constants/editor-constants'
import DualViewSelector from '@/page-builders/plate-editor/dual-view/dual-view-selector'
import LocalDiffSection from '@/page-builders/plate-editor/dual-view/local-diff'
import NextEpisode from '@/page-builders/plate-editor/dual-view/next-episode'
import Notes from '@/page-builders/plate-editor/dual-view/notes'
import PreviousEpisode from '@/page-builders/plate-editor/dual-view/prev-episode'
import Translation from '@/page-builders/plate-editor/dual-view/translation'
import VoicePass from '@/page-builders/plate-editor/dual-view/voice-pass'
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
	const focusMode = store((state) => state.focusMode)

	const showDualView = sidebar === ESidebar.DUAL_VIEW && !focusMode

	const modeToComponent: Record<EDualVIewMode, React.ReactNode> = useMemo(
		() => ({
			[EDualVIewMode.US_TRANSLATION]: (
				<Translation translatedContent={translatedContent} />
			),
			[EDualVIewMode.PREV_EP]: <PreviousEpisode />,
			[EDualVIewMode.NEXT_EP]: <NextEpisode />,
			[EDualVIewMode.NOTES]: <Notes />,
			[EDualVIewMode.LOCAL_DIFF]: <LocalDiffSection />,
			[EDualVIewMode.VOICE_PASS]: <VoicePass />,
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
					'relative flex w-full max-w-full flex-col border transition-all',
					!showDualView && 'max-w-0'
				)}
			>
				<div className="absolute right-0 top-0 z-20 w-fit p-4">
					<DualViewSelector />
				</div>
				{modeToComponent[dualViewMode]}
			</ResizablePanel>
		</>
	)
}

export default DualView
