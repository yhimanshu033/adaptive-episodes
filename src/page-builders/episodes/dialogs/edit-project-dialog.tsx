import React, { PropsWithChildren, useCallback, useEffect } from 'react'
import useStoryUploadHook from '@/hooks/mutation/use-story-upload-hook'
import useUploadFile from '@/hooks/mutation/use-upload-file'
import { CrossIcon } from '@/icons/cross-icon'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import FileUpload from '@/components/aural-ui/file-upload'
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
import useEpisodeTableContext from '@/providers/episode-table-provider'

import { TStory } from '@/types/story-types'

const editProjectSchema = z.object({
	project_title: z
		.string()
		.min(2, 'Series title should have at least 2 characters'),
	author: z.string().min(2, 'Author name should have at least 2 characters!'),
	image: z.string().optional().nullable(),
})
export default function EditProjectDialog({ children }: PropsWithChildren) {
	const { initialStoryData: storyData } = useEpisodeTableContext()
	const form = useForm<Partial<TStory> & { newImage: File | null }>({
		resolver: zodResolver(editProjectSchema),
	})

	const { mutateAsync: sendFile, isPending: isFileUploading } = useUploadFile()
	const { storyUpdateMutation } = useStoryUploadHook()
	const { mutate } = storyUpdateMutation
	const { reset } = form

	const onSubmit = useCallback(async () => {
		const values = form.getValues()

		if (values.newImage) {
			const newImageFile = await sendFile(values.newImage)
			if (newImageFile?.url) {
				values.image = newImageFile?.url
			}
		}

		mutate({
			author: values.author,
			project_title: values.project_title,
			image: values.image,
		})
	}, [form, sendFile, mutate])

	useEffect(() => {
		reset({
			author: storyData?.author || '',
			project_title: storyData?.project_title || '',
			image: storyData?.image,
			newImage: null,
		})
	}, [storyData, reset])

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				variant="neutral"
				classes={{
					content: 'w-full',
				}}
				noise="none"
				showCloseButton={false}
			>
				<DialogTitle>
					<div className="flex items-center justify-between py-3">
						<h3 className="font-fm-text text-xl">Edit series details</h3>
						<DialogClose asChild>
							<IconButton
								variant="ghost"
								size="small"
								icon={<CrossIcon width={20} height={20} />}
								label="cross icon"
							/>
						</DialogClose>
					</div>
					<Divider variant="dashed" />
				</DialogTitle>
				<Form {...form}>
					<form
						className="mt-6 space-y-8"
						onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
					>
						<FormField
							control={form.control}
							name="project_title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="mb-2 text-xs">Series title</FormLabel>
									<FormControl>
										<Input
											className="text-sm"
											decoration="outline"
											placeholder="Enter series title"
											id="project_title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="author"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="mb-2 text-xs">Author</FormLabel>
									<FormControl>
										<Input
											decoration="outline"
											className="text-sm"
											placeholder="Enter author name"
											id="project_title"
											{...field}
											value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="mb-2 text-xs">Thumbnail</FormLabel>
									<FileUpload
										accept="image/*"
										defaultUrl={field.value}
										onFileSelect={({ file }) => {
											form.setValue('newImage', file)
										}}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogClose asChild>
							<Button
								disabled={isFileUploading || storyUpdateMutation.isPending}
								className="mt-8 w-full"
								type="submit"
							>
								Save
							</Button>
						</DialogClose>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
