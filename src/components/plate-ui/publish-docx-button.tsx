import React, { useEffect, useState } from 'react'
import {
	RenameFileFormSchema,
	useRenameFileFormResolver,
} from '@/hooks/form-resolvers/rename-file-resolver'
import useDocxHtml from '@/hooks/mutation/use-get-docx-hook'
import usePublishDocxHook from '@/hooks/mutation/use-publish-docx-hook'
import { Upload } from 'lucide-react'

import IfElse from '@/components/if-else'
import { inputVariants } from '@/components/plate-ui/input'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import { cn, getFormattedDate } from '@/lib/utils/helpers'

import { DownloadDocxParams } from '@/types/episode-type'

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
			`${projectTitle.toUpperCase()} - Episode - ${epNumber} - ${title} - ${getFormattedDate()}`
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!showButton) {
		return null
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					disabled={isPending}
					className="px-2"
					tooltip="Upload to Google Drive"
				>
					<IfElse
						condition={isPending}
						if={<Spinner size={16} />}
						else={<Upload size={16} />}
					/>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-1/2 max-w-none">
				<DialogTitle>Upload</DialogTitle>
				<DialogDescription>
					Confirm filename before uploading to Google Drive
				</DialogDescription>
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
										<div className="flex flex-1 items-center gap-2 space-y-0 rounded-md border border-input p-1.5 px-3">
											<Input
												{...field}
												className={cn(
													'w-full',
													inputVariants({ variant: 'ghost' })
												)}
												placeholder="Enter file name"
											/>
											<Separator className="h-10" orientation="vertical" />
											<span className="text-sm text-muted-foreground">
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
			</DialogContent>
		</Dialog>
	)
}
