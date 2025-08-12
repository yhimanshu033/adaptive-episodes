import {
	ACCEPTED_DOCX_TYPES,
	MAX_DOCX_FILE_SIZE_100,
} from '@/constants/story-constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const useBaseExtensionResolver = (totalEpisodes: number) => {
	const baseExtensionFormSchema = z.object({
		episodes: z.preprocess(
			(val) => Number(val),
			z
				.number()
				.min(1, { message: 'Enter number >=1' })
				.max(totalEpisodes, {
					message: `Enter number <= ${totalEpisodes}`,
				})
		),
	})

	const form = useForm<z.infer<typeof baseExtensionFormSchema>>({
		resolver: zodResolver(baseExtensionFormSchema),
		mode: 'onChange',
		defaultValues: {
			episodes: 0,
		},
	})
	return { form, baseExtensionFormSchema }
}

export const useBaseScriptUploadResolver = () => {
	const baseScriptUploadFormSchema = z.object({
		file: z
			.instanceof(File)
			.refine(
				(file) => !file || (file && file.size <= MAX_DOCX_FILE_SIZE_100),
				`File size exceeds the 100MB. Please upload a smaller file.`
			)
			.refine(
				(file) => !file || (file && ACCEPTED_DOCX_TYPES.includes(file.type)),
				'Only .docx format is supported.'
			),
	})
	const form = useForm<z.infer<typeof baseScriptUploadFormSchema>>({
		resolver: zodResolver(baseScriptUploadFormSchema),
		mode: 'onChange',
		defaultValues: {
			file: undefined,
		},
	})

	return { form, baseScriptUploadFormSchema }
}
