import React from 'react'
import { useParams } from 'next/navigation'
import { useBaseExtensionResolver } from '@/hooks/form-resolvers/base-extension-resolver'
import useBaseExtensionMutation from '@/hooks/mutation/use-base-extension-mutation'
import { z } from 'zod'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { InputBase } from '@/components/aural-ui/input'
import { Typography } from '@/components/aural-ui/typography'
import IfElse from '@/components/if-else'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'

import { TBaseScriptExtensionResponse } from '@/types/admin-types'

const BaseExtensionForm = ({
	totalEpisodes,
	data,
	baseExtensionMutation,
}: {
	baseExtensionMutation: ReturnType<typeof useBaseExtensionMutation>
	data?: TBaseScriptExtensionResponse
	totalEpisodes: number
}) => {
	const { id } = useParams()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { form, baseExtensionFormSchema } =
		useBaseExtensionResolver(totalEpisodes)

	const handleBaseExtension = ({
		episodes,
	}: z.infer<typeof baseExtensionFormSchema>) => {
		if (!data) {
			return
		}

		const { file_id, ranges } = data
		const { de_start, us_start } = ranges

		baseExtensionMutation.mutate({
			file_id,
			project_id: Number(id),
			ranges: {
				...ranges,
				de_end: de_start + episodes - 1,
				us_end: us_start + episodes - 1,
			},
		})
	}

	return (
		<div className="space-y-3">
			<Typography
				transform="uppercase"
				variant="caption-medium"
				className="font-fm-brand"
			>
				Episode Count
			</Typography>
			<Form {...form}>
				<form
					onSubmit={(e) => void form.handleSubmit(handleBaseExtension)(e)}
					className="flex items-center gap-2"
				>
					<FormField
						control={form.control}
						name="episodes"
						render={({ field }) => (
							<FormItem className="relative flex-1">
								<FormControl>
									<InputBase
										type="number"
										decoration="outline"
										className="placeholder:text-fm-md text-fm-md h-9! w-full border-none pr-4 outline-none"
										placeholder="Paste the google drive folder link here"
										{...field}
									/>
								</FormControl>
								<FormMessage className="absolute -bottom-2 translate-y-full" />
							</FormItem>
						)}
					/>
					<IfElse
						condition={baseExtensionMutation.isPending}
						if={<CircularLoader />}
						else={
							<Button
								type="submit"
								variant="text"
								innerClassName={'text-sm !p-0 translate-y-0 uppercase'}
							>
								Update
							</Button>
						}
					/>
				</form>
			</Form>
		</div>
	)
}

export default BaseExtensionForm
