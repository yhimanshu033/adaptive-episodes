import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const bulkPromptFormSchema = z.object({
	prompt: z.string().trim().min(2, {
		message: 'Prompt must be at least 2 characters.',
	}),
})

export type TBulkPromptFormSchema = z.infer<typeof bulkPromptFormSchema>

export default function useBulkPromptFormResolver() {
	const form = useForm<TBulkPromptFormSchema>({
		resolver: zodResolver(bulkPromptFormSchema),
		mode: 'onChange',
		defaultValues: {
			prompt: '',
		},
	})

	return { form, bulkPromptFormSchema }
}
