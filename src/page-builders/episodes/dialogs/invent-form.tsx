import React, { useEffect } from 'react'
import useEpisodeTable from '@/hooks/use-episode-table'
import { CrossIcon } from '@/icons/cross-icon'
import { useEpisodeStore } from '@/store/episode-store'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/aural-ui/form'
import { IconButton } from '@/components/aural-ui/icon-button'
import Input from '@/components/aural-ui/input'

import { TEpisodeInventForm } from '@/types/episode-type'

const InventForm = () => {
	const { useEpisodeTableStore, setIsInventOpen } = useEpisodeStore()
	const { isInventOpen, currentInventIndex } = useEpisodeTableStore()
	const { handleAddEpisode } = useEpisodeTable()

	const form = useForm<TEpisodeInventForm>({
		defaultValues: {
			title: '',
		},
	})

	useEffect(() => {
		if (!isInventOpen) {
			form.reset()
		}
		return () => {
			// Reset form when the dialog is closed
			form.reset()
		}
	}, [form, isInventOpen])

	return (
		<Dialog onOpenChange={setIsInventOpen} open={isInventOpen}>
			<DialogContent
				noise="none"
				showCloseButton={false}
				classes={{
					content: 'w-full h-full',
				}}
			>
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center justify-between py-3">
							<h3 className="text-xl">
								{!currentInventIndex ? 'Add' : 'Invent'} New Episode
							</h3>
							<IconButton
								variant="ghost"
								size="small"
								onClick={() => setIsInventOpen(false)}
								icon={<CrossIcon width={20} height={20} />}
								label="cross icon"
							/>
						</div>
						<Divider variant="dashed" />
					</DialogTitle>
					<Form {...form}>
						<form
							onSubmit={(e) =>
								void form.handleSubmit((data) => handleAddEpisode(data))(e)
							}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="mt-8">Episode Title</FormLabel>
										<FormControl>
											<Input
												classes={{
													input: 'mt-2 !text-sm',
												}}
												placeholder="What's the episode name"
												id="title"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="mt-40 w-full">
								Create
							</Button>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default InventForm
