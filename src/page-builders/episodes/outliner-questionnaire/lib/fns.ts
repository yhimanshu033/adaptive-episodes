import {
	storyDataKeyToMultiSelect,
	storyDataKeyToTitle,
	writerProfileKeyToTitle,
} from '@/page-builders/episodes/outliner-questionnaire/lib/constants'
import {
	TGetOutlinerQuestionnaireStatus,
	TPostOutlinerQuestionnaireChatResponse,
	TStoryDataKey,
	TStoryIdeaData,
	TStoryIdeaDataState,
	TStoryIdeaDataStateItem,
	TWriterProfileData,
	TWriterProfileDataBE,
	TWriterProfileDataStateItem,
	TWriterProfileKey,
	TWriterProfileState,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'

import { MultiSelectOption } from '@/components/ui/multi-select'

import { EAction, EMessenger, TMessage } from '@/types/ai-types'

export function getStoryIdeaStateFromData(data: TStoryIdeaData) {
	return Object.keys(data).reduce((acc, curr) => {
		return {
			...acc,
			[curr]: {
				isEditing: false,
				isMultiSelect: !!storyDataKeyToMultiSelect[curr as TStoryDataKey],
				value: data[curr as TStoryDataKey],
				title: storyDataKeyToTitle[curr as TStoryDataKey],
			} as TStoryIdeaDataStateItem,
		}
	}, {}) as TStoryIdeaDataState
}

export function getMultiSelectOptions(arr: string[] | string) {
	const data = Array.isArray(arr) ? arr : [arr]
	return data.map((it) => {
		return {
			label: it,
			value: it,
		} as MultiSelectOption
	})
}

export function getWriterProfileStateFromData(data: TWriterProfileData) {
	return Object.keys(data).reduce((acc, curr) => {
		return {
			...acc,
			[curr]: {
				isEditing: false,
				isMultiSelect: Array.isArray(data[curr as TWriterProfileKey]),
				value: data[curr as TWriterProfileKey],
				title: writerProfileKeyToTitle[curr as TWriterProfileKey],
			} as TWriterProfileDataStateItem,
		}
	}, {}) as TWriterProfileState
}

export function getWriterProfileDataFromState(data?: TWriterProfileState) {
	if (!data) {
		return
	}
	return Object.keys(data).reduce((acc, curr) => {
		return {
			...acc,
			[curr]: data[curr as TWriterProfileKey]?.value,
		}
	}, {} as TWriterProfileData)
}

export function isWriterProfileLoaded(data?: TWriterProfileState) {
	if (!data) {
		return false
	}
	return Object.keys(data).reduce((acc, curr) => {
		return acc || !!data[curr as TWriterProfileKey]?.value
	}, false)
}

export function getStoryIdeaDataFromState(data?: TStoryIdeaDataState) {
	if (!data) {
		return
	}
	return Object.keys(data).reduce((acc, curr) => {
		return {
			...acc,
			[curr]: data[curr as TStoryDataKey]?.value,
		}
	}, {} as TStoryIdeaData)
}

export function addElementToStrArr<T>({
	arr,
	elem,
	separator = ',',
}: {
	arr: string
	elem: T
	separator?: string
}) {
	const parsed = strArrToArr<T>({ arr, separator })
	parsed.push(elem)
	return arrToStrArr({ arr: parsed, separator })
}

export function removeElementFromStrArr<T>({
	arr,
	elem,
	separator = ',',
}: {
	arr: string
	elem: T
	separator?: string
}) {
	let parsed = strArrToArr<T>({ arr, separator })
	parsed = parsed.filter((item) => {
		return item !== elem
	})
	return arrToStrArr({ arr: parsed, separator })
}

export function strArrToArr<T>({
	arr,
	separator = ',',
}: {
	arr?: string
	separator?: string
}) {
	const parsed = arr?.split(separator) as T[]
	return parsed ?? []
}

export function arrToStrArr<T>({
	arr,
	separator = ',',
}: {
	arr?: T[]
	separator?: string
}) {
	if (!Array.isArray(arr)) {
		return arr ?? ''
	}
	return arr.join(separator)
}

export function convertWritersProfileBeToFe(
	be: TWriterProfileDataBE
): TWriterProfileData {
	return {
		...be,
		genre: strArrToArr({ arr: be.genre }),
	}
}

export function convertWritersProfileFeToBe(
	fe: TWriterProfileData
): TWriterProfileDataBE {
	return {
		...fe,
		genre: arrToStrArr({ arr: fe.genre }),
	}
}

export function convertStoryStateArrToMap(
	storyIdeaDataState: TStoryIdeaDataState[]
) {
	return Array.from(storyIdeaDataState).reduce((acc, curr, currIdx) => {
		return {
			...acc,
			[currIdx.toString()]: getStoryIdeaDataFromState(curr),
		}
	}, {})
}

export function convertBEChatToFE(data: TGetOutlinerQuestionnaireStatus) {
	const chat = data?.result?.conversation_history
	if (!chat?.length) {
		return
	}

	return chat.map((it) => {
		return {
			content: it.content,
			...(it.role === String(EMessenger.ASSISTANT)
				? {
						taskId: '',
						action: EAction.BLOCK,
						meta: {
							profileComplete: {
								completed_requirements_count:
									data.result?.completed_requirements_count ?? 0,
								pending_requirements_count:
									data.result?.pending_requirements_count ?? 10,
							},
						},
					}
				: {}),
			role: it.role,
		} as TMessage
	})
}

export function updateLast<T>(arr: T[], updater: (last: T) => T): T[] {
	if (arr.length === 0) {
		return arr
	}
	return [...arr.slice(0, -1), updater(arr[arr.length - 1])]
}

export function getDerivedChatMessage(
	data?: TPostOutlinerQuestionnaireChatResponse[]
) {
	if (!data?.length) {
		return
	}
	const derived = data.reduce(
		(acc, curr) => {
			return {
				...acc,
				...curr.result,
				message:
					acc.message === curr.result.message
						? acc.message
						: acc.message + curr.result.message,
				completed_requirements_count: curr.result.completed_requirements_count,
				pending_requirements_count: curr.result.pending_requirements_count,
			}
		},
		{ message: '' } as TPostOutlinerQuestionnaireChatResponse['result']
	)

	return derived
}

export function getDerivedChatMessageContent(
	data?: TPostOutlinerQuestionnaireChatResponse[]
) {
	if (!data?.length) {
		return []
	}
	const derived = data.reduce((acc, curr) => {
		if (curr.result.message === acc.join('')) {
			return acc
		}
		return [...acc, curr.result.message]
	}, [] as string[])

	return derived
}
