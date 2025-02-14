import { DEFAULT_EPISODE_RANGE } from '@/constants/episodes-constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const episodeRangeFormSchema = z.object({
	start: z.preprocess(
		(val) => Number(val),
		z.number().min(1, { message: 'Enter number >=1' }).optional()
	),
	end: z.preprocess(
		(val) => Number(val),
		z.number().min(1, { message: 'Enter number >=1' }).optional()
	),
})

export type EpisodeRangeFormSchema = z.infer<typeof episodeRangeFormSchema>

export const useEpisodeRangeResolver = () =>
	useForm<EpisodeRangeFormSchema>({
		resolver: zodResolver(episodeRangeFormSchema),
		mode: 'onChange',
		defaultValues: DEFAULT_EPISODE_RANGE,
	})
