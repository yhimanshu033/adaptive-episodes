import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { SAMPLE_DOC_LINK } from '@/constants/global-constants'
import { useBaseScriptUploadResolver } from '@/hooks/form-resolvers/base-extension-resolver'
import useBaseExtensionMutation from '@/hooks/mutation/use-base-extension-mutation'
import { ArrowRightUpIcon } from '@/icons/arrow-right-up-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { FileChartIcon } from '@/icons/file-chart-icon'
import { LightBulbSimpleIcon } from '@/icons/light-bulb-simple-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { TrashIcon } from '@/icons/trash-icon'
import { toast } from 'sonner'
import z from 'zod'

import Badge from '@/components/aural-ui/badge'
import { Button, buttonVariants } from '@/components/aural-ui/button'
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
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import DeleteModal from '@/components/delete-modal'
import { cn } from '@/lib/aural-ui/utils'
import { formatFileSize } from '@/lib/utils/helpers'

const BaseScriptDocUpload = ({
	setDialogOpen,
}: {
	setDialogOpen: (open: boolean) => void
}) => {
	const { id } = useParams()
	const fileInputref = useRef<HTMLInputElement | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { form, baseScriptUploadFormSchema } = useBaseScriptUploadResolver()
	const baseExtensionMutation = useBaseExtensionMutation()

	const handleDiscardDoc = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault()
		if (fileInputref.current) {
			fileInputref.current.value = ''
		}
		form.resetField('file')
	}

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(e?.type === 'dragenter' || e?.type === 'dragover')
	}

	const handleDocValidation = async (file: File) => {
		form.setValue('file', file)

		const isValid = await form.trigger('file')
		const error = form.getFieldState('file').error?.message

		if (!isValid) {
			toast.error(error || 'Invalid document file.', {
				icon: <BubbleCrossedIcon />,
			})
			form.resetField('file')
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

	const onSubmit = (data: z.infer<typeof baseScriptUploadFormSchema>) => {
		if (!data.file) {
			return
		}
		baseExtensionMutation.mutate({
			file: data.file,
			project_id: Number(id),
		})
		setDialogOpen(false)
	}

	useEffect(() => {
		return () => {
			if (fileInputref.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				fileInputref.current.value = ''
			}
		}
	}, [])

	return (
		<Form {...form}>
			<form
				className="flex h-full flex-col justify-between"
				onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
			>
				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem className="space-y-2">
							<FormLabel htmlFor="story">Episodes</FormLabel>
							<FormControl>
								<div
									className={cn(
										'border-fm-divider-secondary hover:border-fm-divider-primary flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xs border-1 border-dashed p-8 transition-colors duration-200',
										{
											'border-fm-divider-primary bg-fm-divider-primary/30':
												isDragging,
											'border-solid p-4': !!field.value,
										}
									)}
									onDragOver={handleDrag}
									onDragLeave={handleDrag}
									onDrop={handleDrop}
									aria-label="Upload document file"
									onClick={() =>
										!field.value ? fileInputref.current?.click() : {}
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
											<Typography as="span" className="text-fm-secondary-800">
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
													onClick={() => fileInputref.current?.click()}
												/>
												<div className="flex flex-col gap-1">
													<Typography as="div">Translation Document</Typography>
													<Typography
														as="div"
														color="tertiary"
														variant="caption-large"
														transform="uppercase"
														className="font-fm-brand"
													>
														{formatFileSize(field.value?.size || 0)}
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
													innerClassName="!p-0 translate-y-0"
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
										ref={fileInputref}
										className="hidden"
										onChange={(e) => {
											if (e.target.files?.length) {
												void handleDocValidation(e.target.files[0])
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
										FORMATS: DOC
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
									<div className="absolute inset-0 z-[-1] bg-[url('/assets/dusky_bg.webp')] bg-cover bg-center opacity-16" />
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
									<div className="flex flex-col gap-2">
										<Typography
											as="h4"
											color="tertiary"
											variant="caption-medium"
										>
											Make sure each episode is numbered correctly in your file
											names so we can import them in the right order
										</Typography>
										<Typography
											as="h4"
											variant="caption-medium"
											className="bg-fm-info-tert text-fm-info-sec rounded p-1"
										>
											Example: Episode 01 - Shadowed Realms
										</Typography>
									</div>
								</div>
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col justify-end">
					<Divider variant="dashed" />

					<div className="flex w-full items-center justify-between pt-8">
						<Button
							variant="text"
							onClick={(e) => {
								e.preventDefault()
								setDialogOpen(false)
								form.reset()
							}}
						>
							Exit & Discard
						</Button>

						<Button
							className="h-11 w-fit"
							isDisabled={
								!form.watch('file') || baseExtensionMutation.isPending
							}
							type="submit"
						>
							Import
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}

export default BaseScriptDocUpload
