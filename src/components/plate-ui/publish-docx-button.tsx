import React, { useEffect } from 'react'
import {
	RenameFileFormSchema,
	useRenameFileFormResolver,
} from '@/hooks/form-resolvers/rename-file-resolver'
import useDocxDownloadHook from '@/hooks/mutation/use-docx-download-hook'
import usePublishDocxHook from '@/hooks/mutation/use-publish-docx-hook'
import { UploadIcon } from '@/icons/upload-icon'

import { Button } from '@/components/aural-ui/button'
import Input from '@/components/aural-ui/input'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'

import { DownloadDocxParams } from '@/types/episode-type'

import { Popover, PopoverContent, PopoverTrigger } from '../aural-ui/popover'
import { Typography } from '../aural-ui/typography'
import CircularLoader from '../ui/circular-loader'

export default function UploadDocxButton({ latestStatus }: DownloadDocxParams) {
	const { isPending, showButton, mutate } = usePublishDocxHook({
		latestStatus,
	})
	const {
		isPending: isDownlaodPending,
		mutate: mutateDownload,
		title,
		isCalculatingSize,
		fileSize,
	} = useDocxDownloadHook({
		latestStatus,
	})

	const form = useRenameFileFormResolver()

	const onSubmit = (data: RenameFileFormSchema) => {
		mutate({ fileName: data.fileName })
	}

	useEffect(() => {
		form.setValue('fileName', title)
	}, [form, title])

	if (!showButton) {
		return null
	}

	return (
		<Popover>
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
			<PopoverContent
				className="rounded-fm-s px-4 py-6"
				align="end"
				side="bottom"
			>
				<div className="border-fm-divider-primary mt-1 mb-5 flex items-center justify-between border-b pb-5">
					<div>
						<Typography
							as="h3"
							color="primary"
							variant="caption-medium"
							weight="medium"
							className="mb-1"
						>
							{title} {'  '} .docx
						</Typography>
						<Typography
							color="tertiary"
							variant="caption-medium"
							weight="medium"
							className="uppercase"
						>
							{isCalculatingSize ? 'Calculating size...' : fileSize}
						</Typography>
					</div>
					<Button
						size="sm"
						onClick={() => mutateDownload()}
						isDisabled={isDownlaodPending}
						disabled={isDownlaodPending}
						className="flex items-center gap-2"
					>
						{isDownlaodPending ? <CircularLoader className="size-4" /> : null}
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
								{form.formState.isSubmitting || isPending ? (
									<>
										<CircularLoader className="size-4" />
										Uploading...
									</>
								) : (
									'Upload'
								)}
							</Button>
						</form>
					</Form>
				</div>
			</PopoverContent>
		</Popover>
	)
}
