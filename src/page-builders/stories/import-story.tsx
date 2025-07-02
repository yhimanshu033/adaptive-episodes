/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SOURCE_TO_TARGET_LANGUAGE_MAP } from '@/constants/ai-constants'
import { ELLMModel } from '@/constants/episodes-constants'
import { SAMPLE_DOC_LINK } from '@/constants/global-constants'
import {
	StoryImportFormSchema,
	useStoryImportFormResolver,
} from '@/hooks/form-resolvers/story-import-resolver'
import useStoryUploadHook from '@/hooks/mutation/use-story-upload-hook'
import useIsInternal from '@/hooks/use-is-internal'
import useSocket from '@/hooks/use-socket'
import { setFormOpen } from '@/store/story-store'
import { ArrowUpRight, ImageIcon, Lightbulb, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

import { If } from '@/components/if-else'
import { FullScreenLoader } from '@/components/loader'
import LanguageSelector, {
	LLMModelSelector,
} from '@/components/plate-ui/language-selector'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FetchResponseResult } from '@/lib/fetch-api'
import { cn } from '@/lib/utils/helpers'

import { ELanguage } from '@/types/common'

export function ImportStory() {
	const [isDragging, setIsDragging] = useState(false)
	const [imageSrc, setImageSrc] = useState<string | null>(null)
	const imageInputRef = useRef<HTMLInputElement | null>(null)
	const storyInputRef = useRef<HTMLInputElement | null>(null)

	const { storyUploadMutation } = useStoryUploadHook()
	const { getResponse } = useSocket()

	const form = useStoryImportFormResolver()
	const isInternal = useIsInternal()

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
		if (
			data.input_language === (ELanguage.ENGLISH as string) &&
			data.run_adaptation
		) {
			data.input_language = ELanguage.ENGLISH_US
		}
		storyUploadMutation.mutate(data, {
			onSuccess: async (taskId) => {
				form.reset()
				setImageSrc(null)
				setFormOpen(false)
				toast.info('Story import started')
				const data: FetchResponseResult = await getResponse(taskId)
				if (data?.success === false) {
					toast.error('Story upload failed, please retry!', {
						description: 'There might be an issue with the format.',
					})
				}
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

						<FormField
							control={form.control}
							name="input_language"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="language">Language</FormLabel>
									<FormControl>
										<LanguageSelector
											value={field.value as ELanguage}
											selectableLanguages={
												Object.keys(
													SOURCE_TO_TARGET_LANGUAGE_MAP
												) as ELanguage[]
											}
											onValueChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<If condition={isInternal}>
							<FormField
								control={form.control}
								name="run_adaptation"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormControl>
											<div className="flex items-center gap-2">
												<Checkbox
													checked={field.value}
													id="adaptation-checkbox"
													onCheckedChange={field.onChange}
												/>
												<FormLabel htmlFor="adaptation-checkbox">
													Run Adaptation
												</FormLabel>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</If>

						<If condition={form.watch('run_adaptation')}>
							<FormField
								control={form.control}
								name="target_language"
								render={({ field }) => {
									const inputLang = form.watch('input_language') as ELanguage
									const adaptedLanguages = SOURCE_TO_TARGET_LANGUAGE_MAP[
										inputLang
									] || [ELanguage.ENGLISH]
									const currentTarget = field.value

									// Auto-select the first adapted language if needed
									if (
										adaptedLanguages.length > 0 &&
										(!currentTarget ||
											!adaptedLanguages.includes(currentTarget as ELanguage))
									) {
										setTimeout(() => field.onChange(adaptedLanguages[0]), 0)
									}

									return (
										<FormItem className="space-y-2">
											<FormLabel htmlFor="language">Target Language</FormLabel>
											<FormControl>
												<LanguageSelector
													value={field.value as ELanguage}
													selectableLanguages={adaptedLanguages}
													onValueChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)
								}}
							/>
							<FormField
								control={form.control}
								name="llm_model"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel htmlFor="language">AI Model</FormLabel>
										<FormControl>
											<LLMModelSelector
												value={field.value as ELLMModel}
												onValueChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</If>

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
													className="bg-primary absolute top-0 right-0 m-1 hidden translate-x-1/2 -translate-y-1/2 rounded-full shadow group-hover:block"
													onClick={handleDiscardImage}
												>
													<X className="size-4" />
												</Button>
											</>
										) : (
											<div className="flex size-full items-center justify-center rounded-md border-2 border-dashed">
												<ImageIcon className="text-muted-foreground size-8" />
											</div>
										)}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="story_file"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="story">
										Upload Story Files (optional)
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
												<Upload className="text-muted-foreground size-8" />
												<div className="text-center break-words">
													<p className="text-muted-foreground text-sm break-all">
														{field.value
															? field.value.name
															: 'Drag and drop your story file here'}
													</p>
													<Button
														type="button"
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
									<FormDescription className="bg-foreground/10 flex flex-col gap-1.5 p-1 text-xs">
										<div className="flex items-center justify-between">
											<Badge className="bg-primary/20 text-xxs flex gap-2 rounded-none py-1">
												<Lightbulb className="size-4" />
												Content format
											</Badge>
											<Link
												href={SAMPLE_DOC_LINK}
												target="_blank"
												className={cn(
													buttonVariants({ variant: 'link' }),
													'h-6 px-0.5 text-xs'
												)}
											>
												View sample
												<ArrowUpRight className="size-4" />
											</Link>
										</div>
										<h4>
											Make sure each episode is numbered correctly in your file
											names so we can import them in the right order
										</h4>
										<h3 className="bg-primary/30 text-primary p-1.5">
											Example: Episode 01 - Shadowed Realms
										</h3>
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							className="mx-auto w-full"
							type="submit"
							disabled={storyUploadMutation.isPending}
						>
							{storyUploadMutation.isPending
								? 'Uploading'
								: 'Upload or Create New Story'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
