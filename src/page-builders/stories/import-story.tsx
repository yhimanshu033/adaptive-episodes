/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import {
	StoryImportFormSchema,
	useStoryImportFormResolver,
} from '@/hooks/form-resolvers/story-import-resolver'
import useStoryUploadHook from '@/hooks/mutation/use-story-upload-hook'
import { setFormOpen } from '@/store/story-store'
import { ImageIcon, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

import { FullScreenLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function ImportStory() {
	const [isDragging, setIsDragging] = useState(false)
	const [imageSrc, setImageSrc] = useState<string | null>(null)
	const imageInputRef = useRef<HTMLInputElement | null>(null)
	const storyInputRef = useRef<HTMLInputElement | null>(null)

	const { storyUploadMutation } = useStoryUploadHook()

	const form = useStoryImportFormResolver()

	const handleDiscardImage = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault()
		if (imageInputRef.current) {
			imageInputRef.current.value = ''
		}
		form.resetField('image_file')
		setImageSrc(null)
	}

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(e?.type === 'dragenter' || e?.type === 'dragover')
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)

		const file = e.dataTransfer.files[0]
		if (file) {
			form.setValue('story_file', file)
		}
	}

	const onSubmit = (data: StoryImportFormSchema) => {
		storyUploadMutation.mutate(data, {
			onSuccess: () => {
				form.reset()
				setImageSrc(null)
				setFormOpen(false)
				toast.success('Story uploaded successfully', {
					description: 'Please wait while the server processes the story.',
					className: 'bg-primary text-foreground top-0 mx-auto',
				})
			},
		})
	}

	return (
		<Card className="overflow-y-auto py-2">
			<CardContent>
				{storyUploadMutation.isPending && <FullScreenLoader />}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="title">
										Story Title<sup>*</sup>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter story title"
											id="title"
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
									<FormLabel htmlFor="author">Author</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter Author name"
											id="author"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormItem>
							<FormLabel htmlFor="ep_start">
								Episode Range<sup>*</sup>
							</FormLabel>
						</FormItem>
						<div className="flex items-center gap-2">
							<FormField
								control={form.control}
								name="start_ep"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<Input
												type="number"
												placeholder="Episode Start"
												id="ep_start"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="end_ep"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<Input
												type="number"
												placeholder="Episode End"
												id="ep_end"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="image_file"
							render={({ field }) => (
								<FormItem className="flex items-center justify-between">
									<div className="flex flex-col gap-4">
										<FormLabel htmlFor="image">
											Story Image (Optional)
										</FormLabel>
										<FormControl>
											<Input
												id="image"
												type="file"
												onChange={(e) => {
													if (e.target.files?.length) {
														const file = e.target.files[0]
														form.setValue('image_file', file)
														const imageURL = URL.createObjectURL(file)
														setImageSrc(imageURL)
													}
												}}
												accept="image/*"
												ref={imageInputRef}
												className="hidden"
											/>
										</FormControl>
										<Button
											type="button"
											variant="outline"
											onClick={() => imageInputRef.current?.click()}
										>
											<ImageIcon className="mr-2 size-4" />
											{field.value ? 'Change Image' : 'Upload Image'}
										</Button>
										<FormMessage />
									</div>
									{
										<div className="group relative aspect-square w-20">
											{imageSrc ? (
												<>
													<Image
														src={imageSrc}
														alt="Story Thumbnail"
														layout="fill"
														objectFit="cover"
														className="overflow-hidden rounded-md"
													/>
													<Button
														asChild
														variant="ghost"
														size="icon"
														className="absolute right-0 top-0 m-1 hidden -translate-y-1/2 translate-x-1/2 rounded-full bg-primary shadow group-hover:block"
														onClick={handleDiscardImage}
													>
														<X className="size-4" />
													</Button>
												</>
											) : (
												<div className="flex size-full items-center justify-center rounded-md border-2 border-dashed">
													<ImageIcon className="size-8 text-muted-foreground" />
												</div>
											)}
										</div>
									}
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="story_file"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="story">
										Upload Story Files<sup>*</sup>
									</FormLabel>
									<FormControl>
										<div
											className={`mt-6 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors duration-200 ${
												isDragging
													? 'border-primary bg-primary/10'
													: 'border-border'
											}`}
											onDragOver={handleDrag}
											onDragLeave={handleDrag}
											onDrop={handleDrop}
										>
											<>
												<Upload className="size-8 text-muted-foreground" />
												<div className="break-words text-center">
													<p className="break-all text-sm text-muted-foreground">
														{field.value
															? field.value.name
															: 'Drag and drop your story file here'}
													</p>
													<Button
														variant="link"
														className="mt-2"
														onClick={() => storyInputRef.current?.click()}
													>
														{field.value
															? 'Change file'
															: 'Choose file to upload'}
													</Button>
													<Input
														id="story"
														type="file"
														accept=".docx"
														ref={storyInputRef}
														className="hidden"
														onChange={(e) => {
															if (e.target.files?.length) {
																const file = e.target.files[0]
																field.onChange(file)
															}
														}}
													/>
												</div>
											</>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={storyUploadMutation.isPending}>
							{storyUploadMutation.isPending ? 'Uploading' : 'Upload Story'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
