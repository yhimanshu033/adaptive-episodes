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
				className="max-sm:[100vw] h-[85vh] w-[90vw] gap-5 px-0"
			>
				<DialogHeader className="px-4">
					<DialogTitle className="mb-0 flex items-center justify-between gap-4 py-2">
						{!currentInventIndex ? 'Add' : 'Invent'} new episode
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
						className="flex h-full flex-col gap-4 px-4"
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
											decoration="outline"
											id="title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex flex-1 flex-col justify-end">
							<Button
								isDisabled={!form.formState.isValid}
								type="submit"
								className="w-full"
							>
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
