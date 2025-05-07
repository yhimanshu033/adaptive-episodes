import React from 'react'
import { useParams } from 'next/navigation'
import { useBaseExtensionResolver } from '@/hooks/form-resolvers/base-extension-resolver'
import useBaseExtensionMutation from '@/hooks/mutation/use-base-extension-mutation'
import { z } from 'zod'

import IfElse from '@/components/if-else'
import { IconLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { TBaseScriptExtensionResponse } from '@/types/admin-types'

const BaseExtensionForm = ({
	totalEpisodes,
	data,
}: {
	data?: TBaseScriptExtensionResponse
	totalEpisodes: number
}) => {
	const { id } = useParams()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { form, baseExtensionFormSchema } =
		useBaseExtensionResolver(totalEpisodes)

	const baseExtensionMutation = useBaseExtensionMutation()

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
		<Form {...form}>
			<form
				onSubmit={(e) => void form.handleSubmit(handleBaseExtension)(e)}
				className="flex gap-2"
			>
				<FormField
					control={form.control}
					name="episodes"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<Input type="number" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<IfElse
					condition={baseExtensionMutation.isPending}
					if={<IconLoader />}
					else={<Button>Update</Button>}
				/>
			</form>
		</Form>
	)
}

export default BaseExtensionForm
