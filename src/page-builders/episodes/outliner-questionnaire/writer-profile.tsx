import React, { useEffect } from 'react'
import { EFeedback } from '@/constants/analytics'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import {
	convertWritersProfileBeToFe,
	getWriterProfileStateFromData,
} from '@/page-builders/episodes/outliner-questionnaire/lib/fns'
import { useOutlinerQuestionnaireProfile } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-profile'
import { EOutlinerQuestionnaireTab } from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import OutlinerLoading from '@/page-builders/episodes/outliner-questionnaire/loading'
import useOutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire/provider'
import ResetProfileBtn from '@/page-builders/episodes/outliner-questionnaire/reset-profile-btn'
import WriterProfileCard from '@/page-builders/episodes/outliner-questionnaire/writer-profile-card'

import { Button } from '@/components/aural-ui/button'
import { IfElse } from '@/components/aural-ui/if-else'
import { OutlinerFeedback } from '@/components/outliner-feedback'

export default function OutlinerQuestionnaireWriterProfile() {
	const {
		handleChangeTab,
		handleInitialProfileFetch,
		writerProfileDataState,
		isUpdateOutlinerProfilePending,
		handleProfileFeedback,
	} = useOutlinerQuestionnaire()
	const { data: fetchedProfile, isPending } = useOutlinerQuestionnaireProfile()

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

	if (isPending) {
		return <OutlinerLoading />
	}

	if (!writerProfileDataState) {
		return null
	}

	return (
		<div className="grid h-full grid-rows-[auto_1fr_auto]">
			<div className="flex justify-between p-4">
				<div className="flex items-start gap-2">
					<div className="space-y-2">
						<h1 className="text-xl font-bold">{'Your AI Writer Profile'}</h1>
						<p className="text-fm-tertiary col-start-1 text-sm">
							{"Here's your unique writer DNA"}
						</p>
					</div>
					<OutlinerFeedback
						onLike={(comment) => handleProfileFeedback(EFeedback.LIKE, comment)}
						onDislike={(comment) =>
							handleProfileFeedback(EFeedback.DISLIKE, comment)
						}
					/>
				</div>

				<p className="text-fm-tertiary/75 font-fm-brand text-sm uppercase">
					<IfElse
						condition={isUpdateOutlinerProfilePending}
						if={'Saving...'}
						else={'Saved'}
					/>
				</p>
			</div>

			<div className="space-y-4 px-4 pb-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<WriterProfileCard field="show_style" />
					<WriterProfileCard field="dialogue_style" />
				</div>

				<WriterProfileCard field="journey" />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<WriterProfileCard field="genre" />
					<WriterProfileCard field="character_type" />
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<WriterProfileCard field="relationship" />
					<WriterProfileCard field="story_length" />
				</div>
				<WriterProfileCard field="world" />
			</div>

			<div className="bg-fm-surface-frosted/10 border-fm-divider-primary sticky bottom-0 z-100 flex justify-between gap-2 border-t px-4 py-3 backdrop-blur-xs">
				<ResetProfileBtn />
				<Button
					onClick={() => handleChangeTab(EOutlinerQuestionnaireTab.STORY_IDEA)}
					variant="outline"
					size="sm"
					rightIcon={<ArrowRightIcon />}
				>
					Generate
				</Button>
			</div>
		</div>
	)
}
