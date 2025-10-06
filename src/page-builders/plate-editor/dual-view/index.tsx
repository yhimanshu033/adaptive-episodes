import React, { useMemo } from 'react'
import { TRANSITION_DURATION } from '@/constants/editor-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useAccessChecks from '@/hooks/use-access-checks'
import { CrossIcon } from '@/icons/cross-icon'
import ContentDisplay from '@/page-builders/plate-editor/dual-view/content-display'
import LocalDiffSection from '@/page-builders/plate-editor/dual-view/local-diff'
import NextEpisode from '@/page-builders/plate-editor/dual-view/next-episode'
import PreviousEpisode from '@/page-builders/plate-editor/dual-view/prev-episode'
import Translation from '@/page-builders/plate-editor/dual-view/translation'
import VoicePass from '@/page-builders/plate-editor/dual-view/voice-pass'
import useEpisodeIdStore from '@/store/episode-id-store'
import usePlateStore from '@/store/plate-store'
import { toast } from 'sonner'
import { useDebounceValue } from 'usehooks-ts'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { cn } from '@/lib/utils/helpers'
import { getTextFromTextOrValue } from '@/lib/utils/plate'

import { EChatMode } from '@/types/ai-types'
import { EDualVIewMode, MODE_TO_TITLE } from '@/types/episode-type'
import { ESidebar } from '@/types/plate-types'

import BaseScript from './base-script'

const DualView = () => {
	const { store, setSidebar } = usePlateStore()
	const sidebar = store((state) => state.sidebar)
	const focusMode = store((state) => state.focusMode)
	const { isGerman } = useAccessChecks()
	const { data } = useEpisodeContent()

	const showDualView = sidebar === ESidebar.DUAL_VIEW && !focusMode

	const extraViews = useMemo(() => {
		if (!data?.additional_view) {
			return {}
		}
		return Object.keys(data.additional_view).reduce(
			(acc, k) => {
				return {
					...acc,
					[k as EDualVIewMode]: (
						<ContentDisplay
							content={data?.additional_view?.[k]}
							customButton={
								<Button
									tooltip="Copy Content"
									variant="outline"
									size="sm"
									onClick={() => {
										void navigator.clipboard.writeText(
											getTextFromTextOrValue(data?.additional_view?.[k] || '')
										)
										toast.success('Content copied successfully!')
									}}
								>
									Copy
								</Button>
							}
							enableDiff
							reverseDiff
						/>
					),
				}
			},
			{} as Record<EDualVIewMode, React.ReactNode>
		)
	}, [data])
	const modeToComponent: Record<EDualVIewMode, React.ReactNode> = useMemo(
		() => ({
			[EDualVIewMode.US_TRANSLATION]: <Translation />,
			[EDualVIewMode.BASE_SCRIPT]: <BaseScript />,
			[EDualVIewMode.PREV_EP]: <PreviousEpisode />,
			[EDualVIewMode.NEXT_EP]: <NextEpisode />,
			[EDualVIewMode.LOCAL_DIFF]: <LocalDiffSection />,
			[EDualVIewMode.VOICE_PASS]: (
				<VoicePass voiceMode={EChatMode.VOICE2_XML} />
			),
			...extraViews,
		}),
		[extraViews]
	)

	const { store: useEpisodeIdStoreContext, setDualViewMode } =
		useEpisodeIdStore()
	const dualViewMode = useEpisodeIdStoreContext(
		useShallow((state) => state.dualViewMode)
	)

	const [debouncedShowDualView] = useDebounceValue(
		showDualView,
		TRANSITION_DURATION
	)

	const isTransitioning =
		(!debouncedShowDualView && showDualView) || !showDualView

	const closeDualView = () => {
		setDualViewMode(null)
		setSidebar(null, false)
	}

	const modeToTitle = useMemo(() => {
		if (!isGerman) {
			MODE_TO_TITLE[EDualVIewMode.US_TRANSLATION] = 'Source Script'
		}
		return MODE_TO_TITLE
	}, [isGerman])

	if (
		(!showDualView && !debouncedShowDualView) ||
		(!showDualView && sidebar) ||
		!dualViewMode
	) {
		return null
	}

	return (
		<>
			<ResizableHandle />
			<ResizablePanel
				minSize={30}
				defaultSize={50}
				maxSize={50}
				order={2}
				style={{
					transitionDuration: `${isTransitioning ? TRANSITION_DURATION : 0}ms`,
				}}
				className={cn(
					'first-line border-fm-divider-tertiary relative flex w-full max-w-full flex-col border transition-all',
					!showDualView && 'max-w-0'
				)}
			>
				<div className="border-fm-divider-tertiary flex h-15.5 items-center justify-between gap-4 border-b py-3 pr-4 pl-7">
					<h3 className="text-fm-primary leading-fm-md [font-size:var(--text-fm-md)] font-normal">
						{modeToTitle[dualViewMode]}
					</h3>
					<IconButton
						size="small"
						variant="ghost"
						icon={<CrossIcon />}
						label="Close Dual View"
						onClick={closeDualView}
					/>
				</div>
				<ScrollArea className="h-[calc(100%-62px)]">
					<div>{modeToComponent[dualViewMode]}</div>
				</ScrollArea>
			</ResizablePanel>
		</>
	)
}

export default DualView
