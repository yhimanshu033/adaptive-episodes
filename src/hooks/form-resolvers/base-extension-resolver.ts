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
