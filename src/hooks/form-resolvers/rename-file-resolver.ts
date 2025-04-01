import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const renameFileFormSchema = z.object({
	fileName: z.string(),
})

export type RenameFileFormSchema = z.infer<typeof renameFileFormSchema>

export const useRenameFileFormResolver = () =>
	useForm<RenameFileFormSchema>({
		resolver: zodResolver(renameFileFormSchema),
		mode: 'onChange',
		defaultValues: {
			fileName: '',
		},
	})
