import React, { useMemo } from 'react'
import useBulkPromptFormResolver, {
	TBulkPromptFormSchema,
} from '@/hooks/form-resolvers/bulk-prompt-resolver'
import useBulkPromptMutation from '@/hooks/mutation/use-bulk-prompt-mutation'
import { CrossIcon } from '@/icons/cross-icon'
import { MagicBookIcon } from '@/icons/magic-book-icon'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/aural-ui/select'
import TextArea from '@/components/aural-ui/textarea'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { getEpisodesShortTitle } from '@/lib/utils/helpers'

import { ELanguage } from '@/types/common'
import { TEpisode } from '@/types/episode-type'

interface BulkPromptDialogProps {
	selectedRowData: TEpisode[]
}

export default function BulkPromptDialog({
	selectedRowData,
}: BulkPromptDialogProps) {
	const { form } = useBulkPromptFormResolver()
	const { initialStoryData } = useEpisodeTableContext()

	const { mutate, isPending } = useBulkPromptMutation()

	const availableLanguages = initialStoryData?.languages || []

	function handleClick(data: TBulkPromptFormSchema) {
		mutate({
			prompt: data.prompt,
			seq_nos: selectedRowData.map((item) => item.seq_number),
			language: data.language as ELanguage,
		})
	}

	const isDisabled = useMemo(() => {
		return selectedRowData.length > 10
	}, [selectedRowData.length])

	const title = useMemo(() => {
		return getEpisodesShortTitle(selectedRowData)
	}, [selectedRowData])
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					disabled={isPending || isDisabled}
					isDisabled={isPending || isDisabled}
					tooltip="Bulk Episode Prompt"
					innerClassName={'border-fm-divider-secondary h-9'}
				>
					<MagicBookIcon className="size-4" />
				</Button>
			</DialogTrigger>
			<DialogContent
				noise="none"
				showCloseButton={false}
				opacity="high"
				glass="high"
				borderConfig={['left', 'right']}
				className="max-sm:[100vw] h-[60vh] w-[90vw] gap-5 px-0 [box-shadow:none]"
			>
				<DialogHeader className="px-4">
					<DialogTitle className="mb-0 flex items-center justify-between gap-4 py-2">
						Bulk Prompting {title}
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

					<DialogDescription className="sr-only">
						Run your prompt on multiple episode
					</DialogDescription>

					<Divider variant="dashed" />
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={(e) =>
							void form.handleSubmit((data) => handleClick(data))(e)
						}
						className="flex h-full flex-col gap-4 px-4"
					>
						<FormField
							control={form.control}
							name="prompt"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel>Prompt</FormLabel>
									<FormControl>
										<TextArea
											placeholder="Enter prompt here"
											variant={fieldState.error ? 'error' : 'default'}
											decoration="outline"
											minHeight={150}
											maxHeight={150}
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="language"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="mb-2">Language</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger decoration="outline" className="w-full">
												<SelectValue placeholder="Select language" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{availableLanguages.map((language) => (
												<SelectItem key={language} value={language}>
													{language.charAt(0).toUpperCase() +
														language.slice(1).replace('_', ' ')}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex flex-1 flex-col justify-end">
							<DialogClose asChild>
								<Button
									isDisabled={!form.formState.isValid}
									type="submit"
									className="w-full"
								>
									Send
								</Button>
							</DialogClose>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
