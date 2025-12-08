import { ELanguage } from '@/types/common'

export enum EOutlinerQuestionnaireTab {
	CHAT = 'CHAT',
	COMPLETED = 'COMPLETED',
	START = 'START',
	STORY_IDEA = 'IDEA',
	SURVEY = 'SURVEY',
	WRITER_PROFILE = 'PROFILE',
}

export type TStoryIdeaData = {
	key_relationships: string
	logline: string
	main_character: string
	narrative_journey: string
	synopsis: string
	themes: string
	title: string
	tone_and_style: string
	why_this_fits: string
	world: string
}

export type TStoryIdeaDataStateItem = {
	isEditing: boolean
	isMultiSelect: boolean
	title: string
	value: string
}

export type TStoryDataKey = keyof TStoryIdeaData
export type TStoryIdeaDataState = Record<TStoryDataKey, TStoryIdeaDataStateItem>

export type TWriterProfileData = Omit<TWriterProfileDataBE, 'genre'> & {
	genre: string[]
}

export type TWriterProfileDataBE = {
	character_type?: string
	dialogue_style?: string
	genre?: string
	journey?: string
	relationship?: string
	show_style?: string
	story_length?: string
	world?: string
}

export type TWriterProfileDataStateItem = (
	| {
			isMultiSelect: true
			value: string[]
	  }
	| {
			isMultiSelect: false
			value: string
	  }
) & {
	isEditing: boolean
	title: string
}

export type TWriterProfileKey = keyof TWriterProfileData
export type TWriterProfileState = Record<
	TWriterProfileKey,
	TWriterProfileDataStateItem
>

export type TGetStoryIdeasResponse = {
	message: string
	result: {
		new_story_ideas: TStoryIdeaData[]
		project_id: number
	}
	status: number
}

export type TGetStoryIdeasUrlParams = {
	projectId: string
}

export type TPostStoryIdeasBody = {
	new_story_ideas: TStoryIdeaData[]
}

export type TGetOutlinerQuestionnaireStatus = {
	result: {
		completed_requirements_count: number
		conversation_history: {
			content: string
			role: string
		}[]
		pending_requirements_count: number
		stage: EOutlinerQuestionnaireTab
	} | null
}

export type TGetOutlinerQuestionnaireStatusQueryParams = {
	project_id: string
}

export type TPostOutlinerQuestionnaireChat = {
	message: string
}

export type TPostOutlinerQuestionnaireChatResponse = {
	result: {
		completed_requirements_count: number
		message: string
		pending_requirements_count: number
		requirements?: string[]
		stage: EOutlinerQuestionnaireTab
	}
	room_id: number
	task_id: string
}

export type TUpdateOutlinerQuestionnaireStatusBody = {
	stage: EOutlinerQuestionnaireTab
}

export type TUpdateOutlinerQuestionnaireStatusUrlParams = {
	projectId: string
}

export type TGetOutlinerQuestionnaireSurveyResponse = {
	message: string
	result: {
		questions: TOutlinerSurveyQuestion[]
		responses: Record<string, string>
		stage: EOutlinerQuestionnaireTab
		total_questions: number
	}
	success: boolean
}

export type TOutlinerSurveyQuestion = {
	conditional: TOutlinerSurveyQuestionConditional | null
	key: string
	motivational_message: string | null
	options: TOutlinerSurveyQuestionOption[]
	order: number
	question_text: string
	required: boolean
}

export type TOutlinerSurveyQuestionConditional = {
	depends_on: string
}

export type TOutlinerSurveyQuestionOption = {
	dependents: Record<
		string,
		Omit<TOutlinerSurveyQuestionOption, 'dependents'>[]
	>
	key: string
	text: string
}

export type TSaveOutlinerSurveyQuestionResponse = {
	message: string
	result: {
		responses: Record<string, string>
		stage: string
		total_answered: number
	}
	success: boolean
}

export type TSaveOutlinerSurveyQuestionBody = {
	answer: string
	custom_text: string
	question_key: string
}

export type TRegenerateStoryIdeasBody = {
	file_urls?: string[]
	input_language?: ELanguage
	narrative_arc_plan?: string
	previous_ideas?: TStoryIdeaData[]
	prompt?: string
	writer_profile: Partial<TWriterProfileDataBE>
}

export type TGenerateOutlinerSurveyOptionsBody = {
	genre: string
}

export type TGenerateOutlinerSurveyOptionsResponse = {
	shows: string[]
}

export type TGetWriterProfileResponse = {
	result: {
		profile: TWriterProfileDataBE
	}
}

export type TPostWriterProfileBody = {
	profile: TWriterProfileDataBE
}

export type TGetAssemblyAITokenResponse = {
	token: string
}

export type TResetWriterProfileQueryParams = {
	project_id: number
}
