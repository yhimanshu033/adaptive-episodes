import { Value } from '@udecode/plate-common'

export type PlateStoreData = {
	activeDiffId: string | null
	currentDiffValue: Value | null
	resolved: boolean
	scale: number
	sidebar: 'comments' | 'chatbot' | 'outline' | 'far' | 'translation' | null
}
