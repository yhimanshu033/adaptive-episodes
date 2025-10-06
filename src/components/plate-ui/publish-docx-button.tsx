import React, { useEffect, useState } from 'react'
import {
	RenameFileFormSchema,
	useRenameFileFormResolver,
} from '@/hooks/form-resolvers/rename-file-resolver'
import useDocxDownloadHook from '@/hooks/mutation/use-docx-download-hook'
import usePublishDocxHook from '@/hooks/mutation/use-publish-docx-hook'
import useDocxSize from '@/hooks/query/use-docx-size'
import useEnableDocx from '@/hooks/use-enable-docx'
import { UploadIcon } from '@/icons/upload-icon'

import { Button } from '@/components/aural-ui/button'
import Input from '@/components/aural-ui/input'
import IfElse, { Else, If } from '@/components/if-else'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { getFormattedDate } from '@/lib/utils/helpers'

import { Popover, PopoverContent, PopoverTrigger } from '../aural-ui/popover'
import { Typography } from '../aural-ui/typography'
import CircularLoader from '../ui/circular-loader'

export default function UploadDocxButton() {
	const [isOpen, setIsOpen] = useState(false)

	const { downloadDocxEnabled } = useEnableDocx()

	if (!downloadDocxEnabled) {
		return null
	}

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					tooltip="Upload to Google Drive"
					tooltipContentProps={{
						side: 'bottom',
						align: 'end',
					}}
					size="sm"
					className="group"
					innerClassName="font-fm-brand border-fm-divider-secondary group-hover:border-fm-divider-contrast group-disabled:translate-y-0 group-disabled:hover:border-fm-divider-secondary group-data-[state=open]:border-fm-divider-contrast"
				>
					Export
				</Button>
			</PopoverTrigger>
			<If condition={isOpen}>
				<PopoverContent
					className="rounded-fm-s w-md px-4 py-6"
					align="end"
					side="bottom"
				>
					<UploadDocxPopoverContent />
				</PopoverContent>
			</If>
		</Popover>
	)
}

// ONLY IN DOM WHEN POPOVER OPEN
function UploadDocxPopoverContent() {
	const { isPending, mutate } = usePublishDocxHook()
	const {
		isPending: isDownloadPending,
		mutate: mutateDownload,
		title,
		projectTitle,
		epNumber,
	} = useDocxDownloadHook()

	const { data: fileSize } = useDocxSize()

	const form = useRenameFileFormResolver()

	const onSubmit = (data: RenameFileFormSchema) => {
		mutate({ fileName: data.fileName })
	}

	useEffect(() => {
		form.setValue(
			'fileName',
			`${projectTitle.toUpperCase()} - EP ${epNumber} - ${title} - ${getFormattedDate()}`
		)
	}, [epNumber, form, projectTitle, title])

	return (
		<>
			<div className="border-fm-divider-primary mt-1 mb-5 flex items-center justify-between border-b pb-5">
				<div>
					<Typography
						as="h3"
						color="primary"
						variant="caption-medium"
						weight="medium"
						className="mb-1"
					>
						{title}.docx
					</Typography>
					<Typography
						color="tertiary"
						variant="caption-medium"
						weight="medium"
						className="uppercase"
					>
						{!fileSize ? 'Calculating size...' : fileSize}
					</Typography>
				</div>
				<Button
					size="sm"
					onClick={() => mutateDownload()}
					isDisabled={isDownloadPending}
					disabled={isDownloadPending}
					className="flex items-center gap-2"
				>
					<If condition={isDownloadPending}>
						<CircularLoader className="size-4" />
					</If>
					Download
				</Button>
			</div>
			<div>
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
						className="flex flex-col items-center gap-5"
					>
						<FormField
							control={form.control}
							name="fileName"
							render={({ field }) => (
								<FormItem className="w-full flex-1">
									<FormControl>
										<Input
											placeholder="Enter file name"
											{...field}
											decoration="filled"
											fullWidth
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							variant="outline"
							size="sm"
							type="submit"
							isDisabled={form.formState.isSubmitting || isPending}
							disabled={form.formState.isSubmitting || isPending}
							className="group w-full"
							innerClassName="font-fm-brand border-fm-divider-secondary group-hover:border-fm-divider-contrast group-disabled:translate-y-0 group-disabled:hover:border-fm-divider-secondary group-data-[state=open]:border-fm-divider-contrast"
						>
							<IfElse condition={form.formState.isSubmitting || isPending}>
								<If>
									<CircularLoader className="size-4" />
									Uploading...
								</If>
								<Else>Upload</Else>
							</IfElse>
						</Button>
					</form>
				</Form>
			</div>
		</>
	)
}
