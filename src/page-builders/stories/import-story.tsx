/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import {
	ImportStoryStep,
	ImportStoryType,
	sourceLanguages,
	storySteps,
	switchableStepsInfo,
} from '@/constants/episodes-constants'
import {
	StoryImportFormSchema,
	useStoryImportFormResolver,
} from '@/hooks/form-resolvers/story-import-resolver'
import useStoryUploadHook from '@/hooks/mutation/use-story-upload-hook'
import { setFormOpen } from '@/store/story-store'
import { File, ImageIcon, Plus, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/aural-ui/radio'
import { If } from '@/components/if-else'
import { FullScreenLoader } from '@/components/loader'
import LanguageSelector from '@/components/plate-ui/language-selector'
import SwitchCase, { Case } from '@/components/switch-case'
import { CardDescription } from '@/components/ui/card'
import ForEach from '@/components/ui/for-each'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import { cn } from '@/lib/utils/helpers'

import { ELanguage, IconComponent } from '@/types/common'

const storyTypesInfoRecord: Record<
	ImportStoryType,
	{ desc: string; icon: IconComponent; title: string }
> = {
	[ImportStoryType.EMPTY]: {
		title: 'Create new series',
		desc: 'Start from scratch and shape your story as inspiration strikes',
		icon: (props) => <Plus {...props} />,
	},
	[ImportStoryType.IMPORT]: {
		title: 'Import content for series',
		desc: 'Bring in your work and enhance it with fresh tools and insights',
		icon: (props) => <File {...props} />,
	},
}

const storyTypesInfo = Object.keys(storyTypesInfoRecord).map((k) => ({
	...storyTypesInfoRecord[k as ImportStoryType],
	type: k as ImportStoryType,
}))

export function ImportStory() {
	const [storyType, setStoryType] = useState(ImportStoryType.EMPTY)
	const [step, setStep] = useState(ImportStoryStep.CHOOSE_TYPE)
	const [isDragging, setIsDragging] = useState(false)
	const [imageSrc, setImageSrc] = useState<string | null>(null)
	const imageInputRef = useRef<HTMLInputElement | null>(null)
	const storyInputRef = useRef<HTMLInputElement | null>(null)

	const { storyUploadMutation } = useStoryUploadHook()

	const form = useStoryImportFormResolver()

	const lastStep = useMemo(
		() =>
			storyType === ImportStoryType.EMPTY
				? ImportStoryStep.DETAILS
				: ImportStoryStep.CONTENT,
		[storyType]
	)

	const nextStep = useCallback(() => {
		const currentIdx = storySteps.indexOf(step)
		if (step === lastStep) {
			return true
		} else {
			setStep(storySteps[currentIdx + 1])
		}
	}, [lastStep, step])

	const buttonText = useMemo(() => {
		if (storyUploadMutation.isPending) {
			return (
				<>
					Uploading <Spinner size={16} className="ml-2" />
				</>
			)
		}
		if (step === lastStep) {
			return 'Create'
		}
		return 'Next'
	}, [step, lastStep, storyUploadMutation.isPending])

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
		const proceed = nextStep()
		if (proceed) {
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
	}

	return (
		<div className="overflow-y-auto py-2">
			<If condition={storyUploadMutation.isPending}>
				<FullScreenLoader />
			</If>
			<SwitchCase value={step}>
				<Case value={ImportStoryStep.CHOOSE_TYPE}>
					<CardDescription className="pb-2">
						{
							"Pick how you'd like to begin, write something new or build on what you've created."
						}
					</CardDescription>
					<RadioGroup
						value={storyType}
						onValueChange={(v) => setStoryType(v as ImportStoryType)}
					>
						<ForEach data={storyTypesInfo}>
							{(item, idx) => (
								<div key={idx} className="flex space-x-2 p-2">
									<RadioGroupItem
										value={item.type}
										id={item.type}
										className="mt-2"
									/>
									<Label htmlFor={item.type} className="flex flex-col">
										<span className="text-lg">{item.title}</span>
										<span className="text-muted-foreground">{item.desc}</span>
									</Label>
									<Label htmlFor={item.type} className="flex h-full items-end">
										<item.icon />
									</Label>
								</div>
							)}
						</ForEach>
					</RadioGroup>
					<Button className="mx-auto mt-2 w-full" onClick={nextStep}>
						{buttonText}
					</Button>
				</Case>
				<Case value={[ImportStoryStep.DETAILS, ImportStoryStep.CONTENT]}>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<If condition={storyType === ImportStoryType.IMPORT}>
								<div className="flex items-center justify-between">
									<ForEach data={switchableStepsInfo}>
										{(item, idx) => {
											const isCompleted =
												storySteps.indexOf(step) >=
												storySteps.indexOf(item.type)
											const handleClick = () => {
												if (!isCompleted) {
													return
												}
												setStep(item.type)
											}
											return (
												<div
													key={idx}
													className={cn(
														'flex items-center',
														idx === 0 ? 'w-fit' : 'w-full grow'
													)}
												>
													<If condition={idx !== 0}>
														<Separator
															className={cn('shrink', {
																'bg-primary': isCompleted,
															})}
														/>
													</If>
													<Button
														variant="ghost"
														type={isCompleted ? 'button' : 'submit'}
														onClick={handleClick}
														className="flex h-auto grow gap-2 rounded-full p-2"
													>
														<span
															className={cn('rounded-full p-1', {
																'bg-primary/20 text-primary': isCompleted,
															})}
														>
															0{idx + 1}
														</span>
														<h4>{item.title}</h4>
													</Button>
												</div>
											)
										}}
									</ForEach>
								</div>
							</If>
							<Case value={ImportStoryStep.DETAILS}>
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
													selectableLanguages={sourceLanguages}
													onValueChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</Case>

							<Case value={ImportStoryStep.CONTENT}>
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
																className="bg-primary absolute top-0 right-0 m-1 hidden translate-x-1/2 -translate-y-1/2 rounded-full shadow-sm group-hover:block"
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
											<FormMessage />
										</FormItem>
									)}
								/>
							</Case>
							<Button
								className="mx-auto w-full"
								type="submit"
								disabled={storyUploadMutation.isPending}
							>
								{buttonText}
							</Button>
						</form>
					</Form>
				</Case>
			</SwitchCase>
		</div>
	)
}
