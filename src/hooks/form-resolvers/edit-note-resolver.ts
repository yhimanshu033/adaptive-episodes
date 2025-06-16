import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const EditNoteFormSchema = z.object({
	title: z.string(),
	description: z.string(),
})

export type EditNoteFormSchemaFormSchema = z.infer<typeof EditNoteFormSchema>

export const useEditNoteFormResolver = (
	defaultValues: EditNoteFormSchemaFormSchema
) =>
	useForm<EditNoteFormSchemaFormSchema>({
		resolver: zodResolver(EditNoteFormSchema),
		mode: 'onChange',
		defaultValues: defaultValues,
	})
