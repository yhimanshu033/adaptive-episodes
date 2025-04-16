import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const uploadSlackChannelSchema = z.object({
	slack_channel_id: z.string(),
})

export type UploadSlackChannelSchema = z.infer<typeof uploadSlackChannelSchema>

export const useUploadSlackChannelResolver = () =>
	useForm<UploadSlackChannelSchema>({
		resolver: zodResolver(uploadSlackChannelSchema),
		mode: 'onChange',
		defaultValues: {
			slack_channel_id: '',
		},
	})
