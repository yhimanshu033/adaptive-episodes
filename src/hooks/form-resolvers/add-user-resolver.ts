import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ERole } from '@/types/admin-types'

export const addUserFormSchema = z.object({
	email: z.string().email('Invalid email address'),
	role: z.nativeEnum(ERole).optional(),
})

export type AddUserFormSchema = z.infer<typeof addUserFormSchema>

export const useAddUserFormResolver = () =>
	useForm<AddUserFormSchema>({
		resolver: zodResolver(addUserFormSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			role: undefined,
		},
	})
