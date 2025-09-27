import { ELLMModel } from '@/constants/episodes-constants'
import {
	ACCEPTED_DOCX_TYPES,
	ACCEPTED_IMAGE_TYPES,
	MAX_DOCX_FILE_SIZE_100,
	MAX_IMAGE_FILE_SIZE_25,
} from '@/constants/story-constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ELanguage } from '@/types/common'

const validateFiles = (
	files: File[] | undefined,
	maxSize: number,
	acceptedTypes: string[],
	maxFiles?: number
) => {
	if (!files) {
		return true
	}
	if (maxFiles && files.length > maxFiles) {
		return false
	}
	for (const file of files) {
		if (file.size > maxSize) {
			return false
		}
		if (!acceptedTypes.includes(file.type)) {
			return false
		}
	}
	return true
}

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
			(file) => !file || file.size <= MAX_IMAGE_FILE_SIZE_25,
			`File size exceeds the 25MB. Please upload a smaller file.`
		)
		.refine(
			(file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		),
	story_files: z
		.array(z.instanceof(File))
		.optional()
		.refine(
			(files) =>
				!files ||
				files.length === 0 ||
				validateFiles(files, MAX_DOCX_FILE_SIZE_100, ACCEPTED_DOCX_TYPES, 10),
			`Each file must be <= 100MB, max 10 files, and only .docx format is supported.`
		),
	input_language: z.string(),
	run_adaptation: z.boolean(),
	target_language: z.string().optional(),
	llm_model: z.string(),
	book_name: z.string().optional(),
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
			story_files: undefined,
			input_language: ELanguage.ENGLISH,
			run_adaptation: false,
			target_language: undefined,
			llm_model: ELLMModel.HYBRID,
			book_name: undefined,
		},
	})
