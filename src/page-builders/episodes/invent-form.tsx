/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import useEpisodeTable from '@/hooks/use-episode-table'
import { setIsInventOpen, useEpisodeStore } from '@/store/episode-store'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { TEpisodeInventForm } from '@/types/episode-type'

const InventForm = () => {
	const { isInventOpen } = useEpisodeStore()
	const { handleAddEpisode } = useEpisodeTable()

	const form = useForm<TEpisodeInventForm>({
		defaultValues: {
			title: '',
		},
	})
	return (
		<Dialog onOpenChange={setIsInventOpen} open={isInventOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invent New Episode</DialogTitle>
					<DialogDescription>
						Enter the details for the new episode.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => handleAddEpisode(data))}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Episode Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter Episode Title"
											id="title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="text-right">
							<Button type="submit" size="sm" className="mt-4 font-bold">
								Create
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default InventForm
