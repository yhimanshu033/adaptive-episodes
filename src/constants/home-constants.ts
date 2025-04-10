import { TLocaleDict } from '@/constants/localization-constants'
import { BookOpen, PlusCircle, Sparkles } from 'lucide-react'

export const FEATURES_LIST: {
	content: keyof TLocaleDict['landing']['features']
	icon: typeof BookOpen
	title: keyof TLocaleDict['landing']['features']
}[] = [
	{
		icon: BookOpen,
		title: 'f1_title',
		content: 'f1_desc',
	},
	{
		icon: PlusCircle,
		title: 'f2_title',
		content: 'f2_desc',
	},
	{
		icon: Sparkles,
		title: 'f3_title',
		content: 'f3_desc',
	},
] as const
