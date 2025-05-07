import {
	ACCEPTED_DOCX_TYPES,
	ACCEPTED_IMAGE_TYPES,
	MAX_DOCX_FILE_SIZE,
	MAX_IMAGE_FILE_SIZE,
} from '@/constants/story-constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ELanguage } from '@/types/common'

export const storyImportFormSchema = z.object({
	title: z.string(),
	author: z.string().optional(),
	start_ep: z.preprocess(
		(val) => Number(val),
		z.number().min(1, { message: 'Enter number >=1' })
	),
	end_ep: z.preprocess(
		(val) => Number(val),
		z.number().min(1, { message: 'Enter number >=1' })
	),
	image_file: z
		.instanceof(File)
		.optional()
		.refine(
			(file) => !file || file.size <= MAX_IMAGE_FILE_SIZE,
			`Max image size is 5MB.`
		)
		.refine(
			(file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		),
	story_file: z
		.instanceof(File)
		.refine(
			(file) => file && file.size <= MAX_DOCX_FILE_SIZE,
			`Max document size is 10MB.`
		)
		.refine(
			(file) => file && ACCEPTED_DOCX_TYPES.includes(file.type),
			'Only .docx format is supported.'
		),
	input_language: z.string(),
})

export type StoryImportFormSchema = z.infer<typeof storyImportFormSchema>

export const useStoryImportFormResolver = () =>
	useForm<StoryImportFormSchema>({
		resolver: zodResolver(storyImportFormSchema),
		mode: 'onChange',
		defaultValues: {
			title: undefined,
			author: undefined,
			start_ep: 1,
			end_ep: 1,
			image_file: undefined,
			story_file: undefined,
			input_language: ELanguage.ENGLISH,
		},
	})
