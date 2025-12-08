import React, { useEffect } from 'react'
import { EFeedback } from '@/constants/analytics'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import ChevronLeftIcon from '@/icons/chevron-left-icon'
import ChevronRightIcon from '@/icons/chevron-right-icon'
import {
	convertWritersProfileBeToFe,
	getWriterProfileStateFromData,
} from '@/page-builders/episodes/outliner-questionnaire/lib/fns'
import { useOutlinerQuestionnaireNewIdeasQuery } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-new-ideas'
import { useOutlinerQuestionnaireProfile } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-profile'
import OutlinerLoading from '@/page-builders/episodes/outliner-questionnaire/loading'
import useOutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire/provider'
import ResetProfileBtn from '@/page-builders/episodes/outliner-questionnaire/reset-profile-btn'
import StoryIdeaRegenerateForm from '@/page-builders/episodes/outliner-questionnaire/story-idea-regenerate-form'
import StoryIdeaUI from '@/page-builders/episodes/outliner-questionnaire/story-idea-ui'
import { RotateCcw } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { OutlinerFeedback } from '@/components/outliner-feedback'
import { cn } from '@/lib/aural-ui/utils'
import { getSafeArrayIdx } from '@/lib/utils/helpers'

export default function OutlinerQuestionnaireStoryIdea() {
	const { data, isPending } = useOutlinerQuestionnaireNewIdeasQuery()
	const {
		storyIdeaDataState,
		handleInitialNewIdeasFetch,
		selectedStoryIdeaState: storyIdeaIdx,
		setSelectedStoryIdeaState,
		handleStoryIdeaGenerate,
		isNewIdeaRegenerating,
		writerProfileDataState,
		handleInitialProfileFetch,
		isOnboardingCompletionPending,
		handleCompleteOnboarding,
		handleChangeStoryDataStateField,
		completedTaskId,
		handleNewIdeasFeedback,
		handleNewIdeasRegenerateFeedback,
	} = useOutlinerQuestionnaire()

	const { data: fetchedProfile } = useOutlinerQuestionnaireProfile(
		!!writerProfileDataState
	)

	useEffect(() => {
		if (
			!fetchedProfile ||
			Object.keys(fetchedProfile.result.profile).length === 0
		) {
			return
		}
		handleInitialProfileFetch(
			getWriterProfileStateFromData(
				convertWritersProfileBeToFe(fetchedProfile.result.profile)
			)
		)
	}, [fetchedProfile, handleInitialProfileFetch])

	useEffect(() => {
		if (!data) {
			return
		}

		handleInitialNewIdeasFetch(data)
	}, [data, handleInitialNewIdeasFetch])

	if (!storyIdeaDataState[storyIdeaIdx] || isPending) {
		return <OutlinerLoading />
	}

	return (
		<div className="grid h-full grid-rows-[auto_auto_1fr_auto]">
			<div className="flex items-start justify-between px-4 pb-4">
				<div className="grid grid-cols-[auto_1fr] grid-rows-2 gap-2">
					<div className="row-span-2">
						{/* <ResetProfileBtn icon={true} leftIcon={<ArrowRightIcon className='rotate-180' />} /> */}
					</div>
					<h1 className="text-xl font-bold">Your Story Idea</h1>
					<p className="text-fm-tertiary text-sm">
						CoPilot organized your ideas into this structured outline
					</p>
				</div>
				<div className="flex items-center gap-2">
					{/* Show feedback for regeneration when completed and not regenerating for last idea */}
					<If
						condition={
							!!completedTaskId.newIdeasRegenerate &&
							!isNewIdeaRegenerating &&
							storyIdeaIdx === storyIdeaDataState.length - 1
						}
					>
						<OutlinerFeedback
							onLike={(comment) =>
								handleNewIdeasRegenerateFeedback(EFeedback.LIKE, comment)
							}
							onDislike={(comment) =>
								handleNewIdeasRegenerateFeedback(EFeedback.DISLIKE, comment)
							}
						/>
					</If>

					{/* Show feedback for new ideas generation when completed and not regenerating for all ideas before last idea */}
					<If
						condition={
							!!completedTaskId.newIdeas &&
							!isNewIdeaRegenerating &&
							storyIdeaIdx !== storyIdeaDataState.length - 1
						}
					>
						<OutlinerFeedback
							onLike={(comment) =>
								handleNewIdeasFeedback(EFeedback.LIKE, comment)
							}
							onDislike={(comment) =>
								handleNewIdeasFeedback(EFeedback.DISLIKE, comment)
							}
						/>
					</If>
					<If condition={!!writerProfileDataState}>
						<IconButton
							label="Regenerate"
							tooltip="Regenerate"
							variant="ghost"
							icon={isNewIdeaRegenerating ? <CircularLoader /> : <RotateCcw />}
							onClick={() => void handleStoryIdeaGenerate()}
							disabled={isNewIdeaRegenerating}
							size="small"
						/>
					</If>
				</div>
			</div>

			<div className="flex items-center justify-between px-4 pb-1">
				<h3>{`Idea ${storyIdeaIdx + 1}`}</h3>
				<div className="flex items-center gap-2">
					<p>{`${storyIdeaIdx + 1}/${storyIdeaDataState.length}`}</p>
					<IconButton
						label="Previous Idea"
						tooltip="Previous Idea"
						variant="ghost"
						icon={<ChevronLeftIcon />}
						onClick={() =>
							setSelectedStoryIdeaState(
								getSafeArrayIdx(storyIdeaIdx - 1, storyIdeaDataState.length)
							)
						}
						size="small"
					/>
					<IconButton
						label="Next Idea"
						tooltip="Next Idea"
						variant="ghost"
						icon={<ChevronRightIcon />}
						onClick={() =>
							setSelectedStoryIdeaState(
								getSafeArrayIdx(storyIdeaIdx + 1, storyIdeaDataState.length)
							)
						}
						size="small"
					/>
				</div>
			</div>

			<If
				condition={
					!isNewIdeaRegenerating &&
					storyIdeaIdx === storyIdeaDataState.length - 1
				}
			>
				<StoryIdeaRegenerateForm />
			</If>

			<StoryIdeaUI
				idx={storyIdeaIdx}
				storyIdeaState={storyIdeaDataState[storyIdeaIdx]}
				disabled={isNewIdeaRegenerating}
				handleChangeStoryDataStateField={handleChangeStoryDataStateField}
			/>

			<div
				className={cn(
					'bg-fm-surface-frosted/10 border-fm-divider-primary sticky bottom-0 z-100 flex justify-between gap-2 border-t px-4 py-3 backdrop-blur-xs transition-opacity',
					{ 'pointer-events-none opacity-0': isNewIdeaRegenerating }
				)}
			>
				<ResetProfileBtn />
				<Button
					onClick={() => {
						void handleCompleteOnboarding()
					}}
					variant="outline"
					size="sm"
					disabled={isOnboardingCompletionPending}
					isDisabled={isOnboardingCompletionPending}
					rightIcon={
						isOnboardingCompletionPending ? (
							<CircularLoader />
						) : (
							<ArrowRightIcon />
						)
					}
				>
					Continue
				</Button>
			</div>
		</div>
	)
}
