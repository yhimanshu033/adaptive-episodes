import React, { useEffect, useState } from 'react'
import {
	RenameFileFormSchema,
	useRenameFileFormResolver,
} from '@/hooks/form-resolvers/rename-file-resolver'
import useDocxHtml from '@/hooks/mutation/use-get-docx-hook'
import usePublishDocxHook from '@/hooks/mutation/use-publish-docx-hook'
import { UploadIcon } from '@/icons/upload-icon'

import { Button } from '@/components/aural-ui/button'
import { inputVariants } from '@/components/plate-ui/input'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn, getFormattedDate } from '@/lib/utils/helpers'

import { DownloadDocxParams } from '@/types/episode-type'

import { Popover, PopoverContent, PopoverTrigger } from '../aural-ui/popover'
import { Typography } from '../aural-ui/typography'

export default function UploadDocxButton({ latestStatus }: DownloadDocxParams) {
	const [open, setOpen] = useState<boolean>(false)
	const { isPending, showButton, mutate } = usePublishDocxHook({
		latestStatus,
	})
	const { projectTitle, epNumber, title } = useDocxHtml({ latestStatus })

	const form = useRenameFileFormResolver()

	const onSubmit = (data: RenameFileFormSchema) => {
		mutate({ fileName: data.fileName })
		setOpen(false)
	}

	useEffect(() => {
		form.setValue(
			'fileName',
			`${projectTitle.toUpperCase()} - EP ${epNumber} - ${title} - ${getFormattedDate()}`
		)
	}, [epNumber, form, projectTitle, title])

	if (!showButton) {
		return null
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					disabled={isPending}
					tooltip="Upload to Google Drive"
					tooltipContentProps={{
						side: 'bottom',
						align: 'end',
					}}
					isDisabled={isPending}
					size="sm"
					className="group"
					innerClassName="font-fm-brand border-fm-divider-secondary group-hover:border-fm-divider-contrast group-disabled:translate-y-0 group-disabled:hover:border-fm-divider-secondary"
				>
					Export
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="rounded-fm-s px-4 py-6"
				align="end"
				side="bottom"
			>
				<Typography
					as="h3"
					color="primary"
					variant="caption-medium"
					weight="medium"
					className="mb-1 flex items-center gap-2"
				>
					<UploadIcon className="size-4" /> Upload to Drive
				</Typography>
				<Typography
					color="tertiary"
					variant="caption-medium"
					weight="medium"
					className="mb-4"
				>
					Confirm the file name to avoid any errors later
				</Typography>
				<Form {...form}>
					<form
						onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
						className="flex items-center gap-2"
					>
						<FormField
							control={form.control}
							name="fileName"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormControl>
										<div className="border-input flex flex-1 items-center gap-2 space-y-0 rounded-md border p-1.5 px-3">
											<Input
												{...field}
												className={cn(
													'w-full',
													inputVariants({ variant: 'ghost' })
												)}
												placeholder="Enter file name"
											/>
											<Separator className="h-10" orientation="vertical" />
											<span className="text-muted-foreground text-sm">
												.docx
											</span>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button>Upload</Button>
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	)
}
