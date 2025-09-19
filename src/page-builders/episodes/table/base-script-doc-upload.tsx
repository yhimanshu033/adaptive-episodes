import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { SAMPLE_DOC_LINK } from '@/constants/global-constants'
import { useBaseScriptUploadResolver } from '@/hooks/form-resolvers/base-extension-resolver'
import useBaseExtensionMutation from '@/hooks/mutation/use-base-extension-mutation'
import { ArrowRightUpIcon } from '@/icons/arrow-right-up-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { LightBulbSimpleIcon } from '@/icons/light-bulb-simple-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { TrashIcon } from '@/icons/trash-icon'
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
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
import { SortableFileItem } from '@/components/sortable-file-item'
import { cn } from '@/lib/aural-ui/utils'
import { checkForDuplicates } from '@/lib/utils/helpers'

const BaseScriptDocUpload = ({
	setDialogOpen,
}: {
	setDialogOpen: (open: boolean) => void
}) => {
	const { id } = useParams()
	const fileInputref = useRef<HTMLInputElement | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [files, setFiles] = useState<File[]>([])
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { form, baseScriptUploadFormSchema } = useBaseScriptUploadResolver()
	const baseExtensionMutation = useBaseExtensionMutation()

	// Drag and drop sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const handleDiscardDoc = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		index?: number
	) => {
		e.preventDefault()
		e.stopPropagation()
		if (typeof index === 'number') {
			const newFiles = [...files]
			newFiles.splice(index, 1)
			setFiles(newFiles)
			form.setValue('files', newFiles)
			if (fileInputref.current) {
				fileInputref.current.value = ''
			}
		} else {
			setFiles([])
			form.resetField('files')
			if (fileInputref.current) {
				fileInputref.current.value = ''
			}
		}
	}

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(e?.type === 'dragenter' || e?.type === 'dragover')
	}

	const handleDocValidation = async (newFiles: FileList | File[]) => {
		const filesArr = Array.from(newFiles)

		const duplicates = checkForDuplicates(files, filesArr)
		if (duplicates.length > 0) {
			const fileNames = duplicates.slice(0, 2).join(', ')
			const message =
				duplicates.length === 1
					? `File "${fileNames}" is already uploaded.`
					: duplicates.length === 2
						? `Files "${fileNames}" are already uploaded.`
						: `Files "${fileNames}" and ${
								duplicates.length - 2
							} others are already uploaded.`

			toast.error(message, {
				icon: <BubbleCrossedIcon />,
			})
			return false
		}

		const totalFilesAfterUpload = files.length + filesArr.length
		if (totalFilesAfterUpload > 10) {
			toast.error('You can upload a maximum of 10 files.', {
				icon: <BubbleCrossedIcon />,
			})
			return false
		}

		const potentialNewFileList = [...files, ...filesArr]
		form.setValue('files', potentialNewFileList)
		const isValid = await form.trigger('files')
		const error = form.getFieldState('files').error?.message

		if (!isValid) {
			toast.error(error || 'Invalid document file.', {
				icon: <BubbleCrossedIcon />,
			})
			form.setValue('files', files)
			return false
		}

		setFiles(potentialNewFileList)
		return true
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)

		const newFiles = e.dataTransfer.files
		if (newFiles && newFiles.length > 0) {
			void handleDocValidation(newFiles)
		}
	}

	// Drag and drop handlers for file reordering
	const handleSortDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over || active.id === over.id) {
			return
		}

		const activeIndex = files.findIndex(
			(_, index) => `file-${index}` === String(active.id)
		)
		const overIndex = files.findIndex(
			(_, index) => `file-${index}` === String(over.id)
		)

		if (activeIndex !== -1 && overIndex !== -1) {
			const newFiles = arrayMove(files, activeIndex, overIndex)
			setFiles(newFiles)
			form.setValue('files', newFiles)
		}
	}

	const onSubmit = (data: z.infer<typeof baseScriptUploadFormSchema>) => {
		if (!data.files || data.files.length === 0) {
			return
		}
		baseExtensionMutation.mutate({
			files: data.files,
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
					name="files"
					render={() => (
						<FormItem className="space-y-2">
							<FormLabel htmlFor="story">Episodes</FormLabel>
							<FormControl>
								<div
									className={cn(
										'border-fm-divider-secondary hover:border-fm-divider-primary flex flex-col justify-center gap-1 rounded-xs border-1 border-dashed p-8 transition-colors duration-200',
										{
											'border-fm-divider-primary bg-fm-divider-primary/30':
												isDragging,
											'border-solid p-4': files.length > 0,
											'cursor-pointer': files.length === 0,
										}
									)}
									onDragOver={handleDrag}
									onDragLeave={handleDrag}
									onDrop={handleDrop}
									aria-label="Upload document file"
								>
									<If condition={files.length === 0}>
										<div
											className="flex w-full cursor-pointer flex-col items-center justify-center gap-1"
											onClick={() => fileInputref.current?.click()}
										>
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
													upload episodes
												</Typography>
											</Typography>
											<Typography
												as="div"
												color="tertiary"
												variant="caption-small"
												className="mt-2"
											>
												You can select multiple files at once.
											</Typography>
										</div>
									</If>
									<If condition={files.length > 0}>
										<DndContext
											sensors={sensors}
											collisionDetection={closestCenter}
											onDragEnd={handleSortDragEnd}
										>
											<SortableContext
												items={files.map((_, index) => `file-${index}`)}
												strategy={verticalListSortingStrategy}
											>
												<div className="flex max-h-40 w-full flex-col gap-2 overflow-y-auto pr-1">
													{files.map((file, idx) => (
														<SortableFileItem
															key={`${file.name}-${file.size}-${idx}`}
															id={`file-${idx}`}
															file={file}
															index={idx}
															onDelete={handleDiscardDoc}
														/>
													))}
												</div>
											</SortableContext>
										</DndContext>
										<div
											className="mt-2 flex justify-between"
											onClick={(e) => e.stopPropagation()}
										>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={(e) => {
													e.preventDefault()
													e.stopPropagation()
													fileInputref.current?.click()
												}}
												className="flex items-center gap-2"
											>
												<PlusIcon className="size-4" />
												Add more files
											</Button>
											<DeleteModal
												title="Remove all files"
												subTitle="This will remove all uploaded episode files."
												onPrimaryClick={(e) => handleDiscardDoc(e)}
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
													Remove all
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
										multiple
										onChange={(e) => {
											if (e.target.files && e.target.files.length > 0) {
												void handleDocValidation(e.target.files)
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
										FORMATS: DOCX
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
								!form.watch('files')?.length || baseExtensionMutation.isPending
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
