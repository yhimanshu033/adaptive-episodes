import React, { PropsWithChildren, useCallback, useEffect } from 'react'
import {
	ACCEPTED_IMAGE_TYPES,
	MAX_IMAGE_FILE_SIZE_25,
} from '@/constants/story-constants'
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
	DialogDescription,
	DialogHeader,
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
import { iconButtonVariants } from '@/components/aural-ui/icon-button'
import Input from '@/components/aural-ui/input'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import useEpisodeTableContext from '@/providers/episode-table-provider'

import { TStory } from '@/types/story-types'

const editProjectSchema = z.object({
	project_title: z
		.string()
		.min(2, 'Series title should have at least 2 characters'),
	author: z.string().min(2, 'Author name should have at least 2 characters!'),
	image: z
		.union([
			z.string().url().optional().nullable(),
			z.instanceof(File).refine((file) => file.size <= MAX_IMAGE_FILE_SIZE_25, {
				message: 'File size exceeds the 25MB. Please upload a smaller file.',
			}),
		])
		.optional()
		.nullable(),
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
				noise="none"
				showCloseButton={false}
				opacity="high"
				glass="high"
				borderConfig={['left', 'right']}
				className="max-sm:[100vw] h-[85vh] w-[90vw] gap-5 px-0 [box-shadow:none]"
			>
				<DialogHeader className="px-4">
					<DialogTitle className="mb-0 flex items-center justify-between gap-4 py-2">
						Edit series details
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
						Edit Project Title
					</DialogDescription>

					<Divider variant="dashed" />
				</DialogHeader>

				<Form {...form}>
					<form
						className="h-full"
						onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
					>
						<div className="flex h-full flex-col justify-between gap-2">
							<ScrollArea
								className="h-[calc(100%-60px)] px-4"
								classes={{
									viewport:
										'[&>div]:!flex [&>div]:flex-col [&>div]:gap-4 [&>div]:h-full',
								}}
							>
								<FormField
									control={form.control}
									name="project_title"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="mb-2 text-xs">
												Series title
											</FormLabel>
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
												defaultUrl={field.value}
												onFileSelect={({ file }) => {
													form.setValue('newImage', file, { shouldDirty: true })
												}}
												classes={{
													isDragging:
														'border-fm-divider-primary bg-fm-divider-primary/30',
												}}
												allowedTypes={ACCEPTED_IMAGE_TYPES}
												supportedFormat="JPEG, JPG, PNG & WEBP"
											/>
											<FormMessage />
										</FormItem>
									)}
								/>
							</ScrollArea>

							<div className="px-4">
								<DialogClose asChild>
									<Button
										disabled={
											isFileUploading ||
											storyUpdateMutation.isPending ||
											!form.formState.isDirty
										}
										isDisabled={
											isFileUploading ||
											storyUpdateMutation.isPending ||
											!form.formState.isDirty
										}
										className="w-full"
										type="submit"
									>
										Save
									</Button>
								</DialogClose>
							</div>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
