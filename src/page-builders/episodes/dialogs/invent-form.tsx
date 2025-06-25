import React, { useEffect } from 'react'
import useEpisodeTable from '@/hooks/use-episode-table'
import { CrossIcon } from '@/icons/cross-icon'
import { useEpisodeStore } from '@/store/episode-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	useDialogCleanup,
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
import { iconButtonVariants } from '@/components/aural-ui/icon-button'
import Input from '@/components/aural-ui/input'
import { DialogDescription } from '@/components/ui/dialog'

export const invertFormSchema = z.object({
	title: z.string().min(2, {
		message: 'Title must be at least 2 characters.',
	}),
})

export type InvertFormSchema = z.infer<typeof invertFormSchema>

const InventForm = () => {
	const { handleDialogClose } = useDialogCleanup({
		threshold: 1000,
	})

	const { useEpisodeTableStore, setIsInventOpen } = useEpisodeStore()
	const { isInventOpen, currentInventIndex } = useEpisodeTableStore()
	const { handleAddEpisode } = useEpisodeTable()

	const form = useForm<InvertFormSchema>({
		resolver: zodResolver(invertFormSchema),
		mode: 'onChange',
		defaultValues: {
			title: '',
		},
	})

	useEffect(() => {
		if (!isInventOpen) {
			handleDialogClose()
			form.reset()
		}
		return () => {
			// Reset form when the dialog is closed
			form.reset()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, isInventOpen])

	return (
		<Dialog onOpenChange={setIsInventOpen} open={isInventOpen}>
			<DialogContent
				noise="none"
				showCloseButton={false}
				opacity="high"
				glass="high"
				className="w-[90vw] gap-5 px-0"
			>
				<DialogHeader className="px-4">
					<DialogTitle className="flex items-center justify-between gap-4">
						{!currentInventIndex ? 'Add' : 'Invent'} New Episode
						<DialogClose
							className={iconButtonVariants({
								variant: 'ghost',
								size: 'small',
								shape: 'square',
							})}
						>
							<CrossIcon className="h-4 w-4" />
						</DialogClose>
					</DialogTitle>

					<DialogDescription className="sr-only">New Episode</DialogDescription>

					<Divider variant="dashed" />
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={(e) =>
							void form.handleSubmit((data) => handleAddEpisode(data))(e)
						}
						className="space-y-4 px-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel>Episode Title</FormLabel>
									<FormControl>
										<Input
											classes={{
												input: 'mt-2 !text-sm',
											}}
											placeholder="What's the episode name"
											variant={fieldState.error ? 'error' : 'default'}
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
			</DialogContent>
		</Dialog>
	)
}

export default InventForm
