import React from 'react'
import { LightBulbSimpleIcon } from '@/icons/light-bulb-simple-icon'
import { MessageIcon } from '@/icons/message-icon'
import { NotesIcon } from '@/icons/notes-icon'
import { EOutlinerQuestionnaireTab } from '@/page-builders/episodes/outliner-questionnaire/lib/types'
import useOutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire/provider'

const questionnaireOptions = [
	{
		id: EOutlinerQuestionnaireTab.SURVEY,
		title: 'Take Survey',
		description: 'Answer guided questions to define your story',
		icon: NotesIcon,
	},
	{
		id: EOutlinerQuestionnaireTab.CHAT,
		title: 'Talk It Out',
		description: 'Have a conversation about your story idea',
		icon: MessageIcon,
	},
	{
		id: EOutlinerQuestionnaireTab.STORY_IDEA,
		title: 'Start with Idea',
		description: 'Jump right to reviewing your story',
		icon: LightBulbSimpleIcon,
	},
] as const

export default function OutlinerQuestionnaireStartSection() {
	const { handleChangeTab } = useOutlinerQuestionnaire()
	return (
		<div className="flex flex-1 flex-col gap-8 p-4">
			<div className="space-y-1">
				<h1 className="text-foreground text-xl font-bold">
					{'Build Your Story'}
				</h1>
				<p className="text-fm-tertiary">
					{"Choose how you'd like to develop your story idea"}
				</p>
			</div>

			<div className="flex w-full flex-1 flex-col space-y-4">
				{questionnaireOptions.map(({ id, title, description, icon: Icon }) => (
					<button
						key={id}
						onClick={() => handleChangeTab(id)}
						className="border-fm-divider-primary hover:border-fm-secondary-600 w-full cursor-pointer border p-4 text-left transition-all hover:shadow-lg active:scale-95"
					>
						<div className="flex items-start gap-4">
							<div className="bg-fm-secondary-600 shrink-0 p-3">
								<Icon className="size-6" />
							</div>
							<div className="flex-1">
								<h3 className="font-fm-brand font-semibold uppercase">
									{title}
								</h3>
								<p className="text-fm-tertiary text-sm">{description}</p>
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	)
}
