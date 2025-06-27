/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AVAILABLE_TARGET_LANGUAGES } from '@/constants/ai-constants'
import {
	ELLMModel,
	ImportStoryStep,
	ImportStoryType,
	sourceLanguages,
	storySteps,
	switchableStepsInfo,
} from '@/constants/episodes-constants'
import { SAMPLE_DOC_LINK } from '@/constants/global-constants'
import { ACCEPTED_IMAGE_TYPES } from '@/constants/story-constants'
import {
	StoryImportFormSchema,
	useStoryImportFormResolver,
} from '@/hooks/form-resolvers/story-import-resolver'
import useStoryUploadHook from '@/hooks/mutation/use-story-upload-hook'
import useIsInternal from '@/hooks/use-is-internal'
import useSocket from '@/hooks/use-socket'
import { ArrowRightUpIcon } from '@/icons/arrow-right-up-icon'
import { BubbleCrossIcon } from '@/icons/bubble-cross-icon'
import { FeatureShineIcon } from '@/icons/feature-shine-icon'
import { FileChartIcon } from '@/icons/file-chart-icon'
import { LightBulbSimpleIcon } from '@/icons/light-bulb-simple-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { TrashIcon } from '@/icons/trash-icon'
import ChooseStoryTypes from '@/page-builders/stories/choose-story-types'
import DeleteModal from '@/page-builders/stories/delete-modal'
import useStoryStore from '@/store/story-store'
import { toast } from 'sonner'

import Badge from '@/components/aural-ui/badge'
import { Button, buttonVariants } from '@/components/aural-ui/button'
import { Checkbox } from '@/components/aural-ui/checkbox'
import { Divider } from '@/components/aural-ui/divider'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/aural-ui/form'
import { IconButton } from '@/components/aural-ui/icon-button'
import Input from '@/components/aural-ui/input'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Stepper } from '@/components/aural-ui/stepper'
import { Typography } from '@/components/aural-ui/typography'
import { If } from '@/components/if-else'
import { FullScreenLoader } from '@/components/loader'
import LanguageSelector, {
	LLMModelSelector,
} from '@/components/plate-ui/language-selector'
import SwitchCase, { Case } from '@/components/switch-case'
import { cn } from '@/lib/aural-ui/utils'
import { FetchResponseResult } from '@/lib/fetch-api'
import { formatFileSize } from '@/lib/utils/helpers'

import { ELanguage } from '@/types/common'

export function ImportStory() {
	const [storyType, setStoryType] = useState(ImportStoryType.EMPTY)
	const [step, setStep] = useState(ImportStoryStep.CHOOSE_TYPE)
	const [isDragging, setIsDragging] = useState(false)
	const [imageSrc, setImageSrc] = useState<string | null>(null)
	const imageInputRef = useRef<HTMLInputElement | null>(null)
	const storyInputRef = useRef<HTMLInputElement | null>(null)
	const { setFormOpen, setShowTitle, showTitle } = useStoryStore()

	const { storyUploadMutation } = useStoryUploadHook()
	const { getResponse } = useSocket()

	const form = useStoryImportFormResolver()
	const isInternal = useIsInternal()

	const lastStep = useMemo(
		() =>
			storyType === ImportStoryType.EMPTY
				? ImportStoryStep.DETAILS
				: ImportStoryStep.CONTENT,
		[storyType]
	)

	const updateStoryType = useCallback((type: ImportStoryType) => {
		setStoryType(type)
	}, [])

	const nextStep = useCallback(() => {
		const currentIdx = storySteps.indexOf(step)
		if (storyType === ImportStoryType.IMPORT) {
			setShowTitle(false)
		}
		if (step === lastStep) {
			return true
		} else {
			setStep(storySteps[currentIdx + 1])
		}
	}, [lastStep, setShowTitle, step, storyType])

	const buttonText = useMemo(() => {
		if (storyUploadMutation.isPending) {
			return (
				<>
					Uploading <FeatureShineIcon height={16} width={16} className="ml-2" />
				</>
			)
		}
		if (step === lastStep) {
			return 'Create'
		}
		return 'Continue'
	}, [step, lastStep, storyUploadMutation.isPending])

	const PrimaryBtnText = useMemo(() => {
		if (storyUploadMutation.isPending) {
			return 'Uploading'
		}
		if (storyType === ImportStoryType.EMPTY) {
			return 'Create New Story'
		}
		if (step === lastStep) {
			return 'Import a Story'
		}
		return 'Continue'
	}, [storyUploadMutation.isPending, storyType, step, lastStep])

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

	const handleDiscardDoc = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault()
		if (storyInputRef.current) {
			storyInputRef.current.value = ''
		}
		form.resetField('story_file')
		setImageSrc(null)
	}

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(e?.type === 'dragenter' || e?.type === 'dragover')
	}

	const handleDocValidation = async (file: File) => {
		form.setValue('story_file', file)

		const isValid = await form.trigger('story_file')
		const error = form.getFieldState('story_file').error?.message

		if (!isValid) {
			toast.error(error || 'Invalid document file.', {
				icon: <BubbleCrossIcon />,
			})
			form.setValue('story_file', undefined)
			return false
		}

		return true
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)

		const file = e.dataTransfer.files[0]
		if (file) {
			void handleDocValidation(file)
		}
	}

	const handleImageValidation = async (file: File) => {
		form.setValue('image_file', file)
		const isValid = await form.trigger('image_file')

		if (!isValid) {
			const message = form.formState.errors.image_file?.message
			toast.error(message, {
				icon: <BubbleCrossIcon />,
			})
			form.setValue('image_file', undefined)
			setImageSrc('')
			return
		}

		setImageSrc(URL.createObjectURL(file))
	}

	const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)

		const file = e.dataTransfer.files?.[0]
		if (file) {
			void handleImageValidation(file)
		}
	}

	const handelImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			void handleImageValidation(file)
		}
	}

	const handleStepClick = (stepIndex: number) => {
		const isCompleted =
			storySteps.indexOf(step) >=
			storySteps.indexOf(switchableStepsInfo[stepIndex].type)
		if (!isCompleted) {
			return
		}
		setStep(switchableStepsInfo[stepIndex].type)
	}

	const onSubmit = (data: StoryImportFormSchema) => {
		if (
			data.input_language === (ELanguage.ENGLISH as string) &&
			data.run_adaptation
		) {
			data.input_language = ELanguage.ENGLISH_US
		}
		const proceed = nextStep()
		if (proceed) {
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
	}

	return (
		<div
			className={cn('flex flex-col', {
				'h-[calc(100%-64px)]': showTitle,
				'h-full': !showTitle,
			})}
		>
			<If condition={storyUploadMutation.isPending}>
				<FullScreenLoader />
			</If>
			<SwitchCase value={step}>
				<Case value={ImportStoryStep.CHOOSE_TYPE}>
					<ChooseStoryTypes
						storyType={storyType}
						updateStoryType={updateStoryType}
						buttonText={buttonText}
						nextStep={nextStep}
					/>
				</Case>
				<Case value={[ImportStoryStep.DETAILS, ImportStoryStep.CONTENT]}>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
							<div className="flex h-[calc(100%-78px)] flex-col gap-4">
								<If condition={storyType === ImportStoryType.IMPORT}>
									<div className="flex flex-col justify-center px-8">
										<Stepper
											steps={2}
											activeStep={storySteps.indexOf(step) - 1}
											variant="primary"
											className="mx-auto w-full max-w-90 pb-4"
											stepLabels={switchableStepsInfo.map((item) => item.title)}
											onStepClick={handleStepClick}
										/>
										<Divider variant="dashed" />
									</div>
								</If>
								<ScrollArea
									className={cn('px-8', {
										'h-full': storyType !== ImportStoryType.IMPORT,
										'h-[calc(100%-96px)]': storyType === ImportStoryType.IMPORT,
									})}
								>
									<div className="flex flex-col gap-4">
										<Case value={ImportStoryStep.DETAILS}>
											<FormField
												control={form.control}
												name="title"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel htmlFor="title">Story Title</FormLabel>
														<FormControl>
															<Input
																placeholder="Give your series a name"
																decoration="outline"
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
													<FormItem className="space-y-2">
														<FormLabel htmlFor="author">Author</FormLabel>
														<FormControl>
															<Input
																placeholder="Enter Author name"
																decoration="outline"
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
													<FormItem className="space-y-2">
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
											<If
												condition={
													isInternal && storyType === ImportStoryType.IMPORT
												}
											>
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
													render={({ field }) => (
														<FormItem className="space-y-2">
															<FormLabel htmlFor="language">
																Target Language
															</FormLabel>
															<FormControl>
																<LanguageSelector
																	value={field.value as ELanguage}
																	selectableLanguages={
																		AVAILABLE_TARGET_LANGUAGES
																	}
																	onValueChange={field.onChange}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
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
													<FormItem className="flex flex-col gap-2 align-text-bottom">
														<FormLabel htmlFor="image">
															Story Image{' '}
															<Typography
																as="span"
																color="tertiary"
																variant="caption-small"
																weight="regular"
																className="font-fm-brand !text-fm-xs text-inherit"
															>
																[Optional]
															</Typography>
														</FormLabel>
														<FormControl>
															<div
																className={cn(
																	'border-fm-divider-secondary hover:border-fm-divider-primary flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-1 border-dashed p-8 transition-colors duration-200',
																	{
																		'border-fm-divider-primary bg-fm-divider-primary/30':
																			isDragging,
																		'border-solid p-4': !!field.value,
																	}
																)}
																onDragOver={handleDrag}
																onDragLeave={handleDrag}
																onDrop={handleImageDrop}
																onClick={() =>
																	!imageSrc
																		? imageInputRef.current?.click()
																		: {}
																}
															>
																<If condition={!field.value}>
																	<IconButton
																		label="Upload image button"
																		size="small"
																		icon={<PlusIcon />}
																	/>

																	<Typography
																		color="tertiary"
																		variant="caption-large"
																		weight="regular"
																	>
																		Drag and drop or{' '}
																		<Typography
																			as="span"
																			className="text-fm-secondary-800"
																		>
																			upload image
																		</Typography>
																	</Typography>
																</If>
																<If condition={!!field.value}>
																	<div className="flex w-full items-center justify-between text-sm">
																		<div className="flex max-w-3/5 gap-4">
																			{imageSrc && (
																				<div
																					className="relative aspect-square h-9 shrink-0 overflow-hidden"
																					onClick={() =>
																						imageInputRef.current?.click()
																					}
																				>
																					<Image
																						src={imageSrc}
																						alt="Story Thumbnail"
																						layout="fill"
																						objectFit="cover"
																						className="rounded-md"
																					/>
																				</div>
																			)}
																			<div className="flex w-full flex-col gap-1">
																				<Typography
																					as="div"
																					variant="caption-large"
																					className="truncate overflow-hidden whitespace-nowrap"
																				>
																					{field.value?.name}
																				</Typography>
																				<Typography
																					as="div"
																					color="tertiary"
																					variant="caption-medium"
																					transform="uppercase"
																					className="font-fm-brand"
																				>
																					{formatFileSize(
																						field.value?.size || 0
																					)}
																				</Typography>
																			</div>
																		</div>
																		<DeleteModal
																			onPrimaryClick={handleDiscardImage}
																			title="Delete uploaded image"
																			subTitle="Once deleted, this can't be
																					undone. Don't worry! You can
																					always upload a new image."
																		>
																			<Button
																				variant="text"
																				className="text-fm-negative gap-2"
																				innerClassName="!p-0"
																			>
																				<TrashIcon
																					height={16}
																					width={16}
																					className="text-fm-negative"
																				/>{' '}
																				DELETE
																			</Button>
																		</DeleteModal>
																	</div>
																</If>
																<input
																	id="image"
																	type="file"
																	onChange={handelImageUpload}
																	accept={ACCEPTED_IMAGE_TYPES.join(',')}
																	ref={imageInputRef}
																	className="hidden"
																/>
															</div>
														</FormControl>
														<FormDescription className="flex flex-col text-xs">
															<div className="mb-4 flex w-full justify-between">
																<Typography
																	as="h4"
																	color="tertiary"
																	variant="caption-small"
																	transform="uppercase"
																	className="font-fm-brand"
																>
																	FORMATS: JPG, JPEG, PNG & WEBP
																</Typography>
																<Typography
																	as="h4"
																	color="tertiary"
																	variant="caption-small"
																	transform="uppercase"
																	className="font-fm-brand"
																>
																	MAX SIZE: 25 MB
																</Typography>
															</div>
														</FormDescription>
													</FormItem>
												)}
											/>
										</Case>

										<Case value={ImportStoryStep.CONTENT}>
											<FormField
												control={form.control}
												name="story_file"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel htmlFor="story">
															STORY{' '}
															<Typography
																as="span"
																color="tertiary"
																variant="caption-small"
																weight="regular"
																className="font-fm-brand !text-fm-xs text-inherit"
															>
																[Optional]
															</Typography>
														</FormLabel>
														<FormControl>
															<div
																className={cn(
																	'border-fm-divider-secondary hover:border-fm-divider-primary flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-1 border-dashed p-8 transition-colors duration-200',
																	{
																		'border-fm-divider-primary bg-fm-divider-primary/30':
																			isDragging,
																		'border-solid p-4': !!field.value,
																	}
																)}
																onDragOver={handleDrag}
																onDragLeave={handleDrag}
																onDrop={handleDrop}
																onClick={() =>
																	!field.value
																		? storyInputRef.current?.click()
																		: {}
																}
															>
																<If condition={!field.value}>
																	<IconButton
																		label="Upload file button"
																		size="small"
																		icon={<PlusIcon />}
																	/>
																	<Typography
																		color="tertiary"
																		variant="caption-large"
																		weight="regular"
																	>
																		Drag and drop or{' '}
																		<Typography
																			as="span"
																			className="text-fm-secondary-800"
																		>
																			upload story
																		</Typography>
																	</Typography>
																</If>
																<If condition={!!field.value}>
																	<div className="flex w-full items-center justify-between text-sm">
																		<div className="flex gap-4">
																			<IconButton
																				label="Re-Upload file button"
																				icon={
																					<FileChartIcon className="text-fm-secondary-800" />
																				}
																				onClick={() =>
																					storyInputRef.current?.click()
																				}
																			/>
																			<div className="flex flex-col gap-1">
																				<Typography as="div">
																					Translation Document
																				</Typography>
																				<Typography
																					as="div"
																					color="tertiary"
																					variant="caption-large"
																					transform="uppercase"
																					className="font-fm-brand"
																				>
																					{formatFileSize(
																						field.value?.size || 0
																					)}
																				</Typography>
																			</div>
																		</div>
																		<DeleteModal
																			title="Delete uploaded file"
																			subTitle="Once deleted, this can't be
																					undone. Don't worry! You can
																					always upload a new file."
																			onPrimaryClick={handleDiscardDoc}
																		>
																			<Button
																				variant="text"
																				className="text-fm-negative gap-2"
																				innerClassName="!p-0"
																			>
																				<TrashIcon
																					height={16}
																					width={16}
																					className="text-fm-negative"
																				/>{' '}
																				DELETE
																			</Button>
																		</DeleteModal>
																	</div>
																</If>
																<input
																	id="story"
																	type="file"
																	accept=".docx"
																	ref={storyInputRef}
																	className="hidden"
																	onChange={(e) => {
																		if (e.target.files?.length) {
																			void handleDocValidation(
																				e.target.files[0]
																			)
																		}
																	}}
																/>
															</div>
														</FormControl>
														<FormDescription className="flex flex-col text-xs">
															<div className="mb-4 flex w-full justify-between">
																<Typography
																	as="h4"
																	color="tertiary"
																	variant="caption-small"
																	transform="uppercase"
																	className="font-fm-brand"
																>
																	FORMATS: TXT, PDF, DOC
																</Typography>
																<Typography
																	as="h4"
																	color="tertiary"
																	variant="caption-small"
																	transform="uppercase"
																	className="font-fm-brand"
																>
																	MAX SIZE: 100 MB
																</Typography>
															</div>
															<div className="relative z-0 flex flex-col gap-5 px-3 py-4">
																<div className="absolute inset-0 z-[-1] bg-[url('/assets/dusky_bg.webp')] bg-cover bg-center opacity-5" />
																<div className="flex items-center justify-between">
																	<Badge className="flex gap-2" size="sm">
																		<LightBulbSimpleIcon className="size-4" />
																		Content format
																	</Badge>
																	<Link
																		href={SAMPLE_DOC_LINK}
																		target="_blank"
																		className={cn(
																			buttonVariants({ variant: 'text' }),
																			'h-6 w-23 text-xs'
																		)}
																	>
																		<div className="flex gap-1">
																			VIEW SAMPLE
																			<ArrowRightUpIcon className="size-4" />
																		</div>
																	</Link>
																</div>
																<Typography
																	as="h4"
																	color="tertiary"
																	variant="caption-medium"
																>
																	Make sure each episode is numbered correctly
																	in your file names so we can import them in
																	the right order
																</Typography>
																<Typography
																	as="h4"
																	variant="caption-medium"
																	className="bg-fm-blue-200 text-fm-info-sec rounded p-1"
																>
																	Example: Episode 01 - Shadowed Realms
																</Typography>
															</div>
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										</Case>
									</div>
								</ScrollArea>
							</div>

							<div className="flex flex-col justify-end px-8">
								<If condition={storyType === ImportStoryType.IMPORT}>
									<Divider variant="dashed" />
								</If>

								<div className="flex w-full items-center justify-between pt-8">
									<If condition={storyType === ImportStoryType.IMPORT}>
										<Button
											variant="text"
											onClick={() => {
												setFormOpen(false)
												form.reset()
											}}
										>
											Exit & Discard
										</Button>
									</If>

									<Button
										className={cn('w-full', {
											'h-11 w-fit': storyType === ImportStoryType.IMPORT,
										})}
										isDisabled={
											!form.watch('title') || storyUploadMutation.isPending
										}
										type="submit"
									>
										{PrimaryBtnText}
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</Case>
			</SwitchCase>
		</div>
	)
}
