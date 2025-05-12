import React, { PropsWithChildren, useCallback, useEffect } from 'react'
import useStoryUploadHook from '@/hooks/mutation/use-story-upload-hook'
import useUploadFile from '@/hooks/mutation/use-upload-file'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import IfElse from '@/components/if-else'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import FileUpload from '@/components/ui/file-upload'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Spinner from '@/components/ui/spinner'
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
			<DialogContent>
				<DialogTitle>Edit Details</DialogTitle>
				<Form {...form}>
					<form
						className="space-y-4"
						onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
					>
						<FormField
							control={form.control}
							name="project_title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Series title</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter story title"
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
									<FormLabel>Author</FormLabel>
									<FormControl>
										<Input
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
									<FormLabel>Thumbnail</FormLabel>
									<FormControl>
										<FileUpload
											accept="image/*"
											defaultUrl={field.value}
											onFileSelect={({ file }) => {
												form.setValue('newImage', file)
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogClose asChild>
							<Button
								disabled={isFileUploading || storyUpdateMutation.isPending}
								className="w-full"
								type="submit"
							>
								<IfElse
									condition={isFileUploading || storyUpdateMutation.isPending}
									if={<Spinner />}
									else={'Save'}
								/>
							</Button>
						</DialogClose>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
