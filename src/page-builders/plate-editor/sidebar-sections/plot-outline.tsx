/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import { useParams } from 'next/navigation'
import usePlotOutlineHook from '@/hooks/mutation/use-plotoutline-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { getLoglines } from '@/server-action/episode-action'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface PlotlineForm {
	character: string
	description: string
	end: string
	parts: string
	start: string
}

const PlotOutline = () => {
	const { id, episodeId } = useParams()
	const { data: episodeContent } = useEpisodeContent()
	const { plotlineMutation } = usePlotOutlineHook()
	const { data: plotline, isPending } = plotlineMutation

	console.log(plotline, isPending)

	const formSchema = z.object({
		start: z.string().min(1, {
			message: 'Start episode must be at least 1.',
		}),
		end: z.string().min(1, {
			message: 'End episode must be at least 1.',
		}),
		character: z.string().min(1, {
			message: 'Character is required.',
		}),
		description: z.string().optional(),
		parts: z.string().min(1, {
			message: 'Parts must be at least 1.',
		}),
	})
	const form = useForm({
		resolver: zodResolver(formSchema),
	})

	const onSubmit = async (data: PlotlineForm) => {
		if (episodeContent) {
			const { loglines } = await getLoglines(id as string, data.start, data.end)
			const plotlinePayload = {
				character: data.character,
				context: episodeContent.summary,
				context_array: loglines,
				dimension: data.description,
				ep_from: data.start,
				ep_to: data.end,
				ep_number: episodeId as string,
				max_parts: data.parts,
			}
			plotlineMutation.mutate(plotlinePayload)
		}
	}

	return (
		<div className="p-4">
			<h1 className="mb-4 text-2xl font-bold">Plot Outlines</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
					className="space-y-8"
				>
					<div className="flex space-x-4">
						<FormField
							control={form.control}
							name="start"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Start Episode</FormLabel>
									<FormControl>
										<Input min={1} type="number" placeholder="1" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="end"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>End Episode</FormLabel>
									<FormControl>
										<Input min={1} type="number" placeholder="1" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="character"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Character</FormLabel>
								<FormControl>
									<Input placeholder="Character Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea placeholder="Description..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="parts"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Parts</FormLabel>
								<FormControl>
									<Input min={1} type="number" placeholder="1" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Create Plot Outline</Button>
				</form>
			</Form>
		</div>
	)
}

export default PlotOutline
