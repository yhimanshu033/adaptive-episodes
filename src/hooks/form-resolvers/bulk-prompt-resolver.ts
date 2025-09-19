import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ELanguage } from '@/types/common'

const bulkPromptFormSchema = z.object({
	prompt: z.string().trim().min(2, {
		message: 'Prompt must be at least 2 characters.',
	}),
	language: z.nativeEnum(ELanguage).optional(),
})

export type TBulkPromptFormSchema = z.infer<typeof bulkPromptFormSchema>

export default function useBulkPromptFormResolver() {
	const form = useForm<TBulkPromptFormSchema>({
		resolver: zodResolver(bulkPromptFormSchema),
		mode: 'onChange',
		defaultValues: {
			prompt: '',
			language: undefined,
		},
	})

	return { form, bulkPromptFormSchema }
}
