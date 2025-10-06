import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useImageFileSize } from '@/hooks/use-image-size'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { TrashIcon } from '@/icons/trash-icon'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import { FormDescription } from '@/components/aural-ui/form'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import DeleteModal from '@/components/delete-modal'
import { cn, formatFileSize } from '@/lib/utils/helpers'

type ImageUploadProps = {
	allowedTypes?: string[]
	classes?: {
		isDragging?: string
		root?: string
	}
	defaultFile?: File | null
	defaultUrl?: string
	maxSize?: number
	onFileSelect: ({ file, url }: { file: File; url: string }) => void
	supportedFormat?: string
} & React.ComponentProps<'input'>

export default function FileUpload({
	onFileSelect,
	defaultFile = null,
	defaultUrl = '',
	classes = {
		root: '',
		isDragging: '',
	},
	maxSize = 25,
	supportedFormat = 'JPG, PNG',
	allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
	...props
}: ImageUploadProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [file, setFile] = useState<File | null>(defaultFile)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const validateFileFormat = (file: File): boolean => {
		if (!allowedTypes.includes(file.type)) {
			toast.error(
				`Invalid file format. Please upload ${supportedFormat} files only.`,
				{
					icon: <BubbleCrossedIcon />,
				}
			)
			return false
		}
		return true
	}

	const validateFileSize = (file: File): boolean => {
		const maxBytes = maxSize * 1024 * 1024
		if (file.size > maxBytes) {
			toast.error(`File exceeds ${maxSize}MB. Please upload a smaller file.`, {
				icon: <BubbleCrossedIcon />,
			})
			return false
		}
		return true
	}

	const validateFile = (file: File): boolean => {
		return validateFileFormat(file) && validateFileSize(file)
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragging(false)

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const droppedFile = e.dataTransfer.files[0]
			if (validateFile(droppedFile)) {
				setFile(droppedFile)
			}
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const selectedFile = e.target.files[0]
			if (validateFile(selectedFile)) {
				setFile(selectedFile)
			}
		}
	}

	const handleRemoveFile = () => {
		setFile(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const resetState = () => {
		handleRemoveFile()
	}

	const url = useMemo(
		() => (!file ? defaultUrl : URL.createObjectURL(file)),
		[file, defaultUrl]
	)

	const fileSize = useImageFileSize(url)

	useEffect(() => {
		if (!file || !url) {
			return
		}
		onFileSelect({ file, url })
	}, [file, url, onFileSelect])

	return (
		<>
			<div
				className={cn(
					'mb-0.5 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-1 p-4 transition-colors',
					classes.root,
					isDragging
						? `border-fm-divider-contrast`
						: 'border-fm-divider-primary hover:border-fm-divider-contrast',
					isDragging && classes.isDragging,
					!url && 'border-dashed p-8'
				)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={
					!url || defaultUrl === url
						? () => fileInputRef.current?.click()
						: () => {}
				}
			>
				<input
					{...props}
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					className="hidden"
					accept={allowedTypes.join(',')}
				/>
				<IfElse condition={!url}>
					<If>
						<IconButton
							label="Upload file button"
							size="small"
							icon={<PlusIcon />}
						/>
						<Typography
							color="tertiary"
							variant="caption-large"
							className="text-fm-primary pt-3"
							weight="regular"
						>
							Drag and drop or{' '}
							<Typography as="span" className="text-fm-secondary-800">
								upload image
							</Typography>
						</Typography>
					</If>
					<Else>
						<div className="flex w-full items-center justify-between rounded-md">
							<div
								className="flex max-w-3/5 gap-4"
								onClick={
									!url || defaultUrl !== url
										? () => fileInputRef.current?.click()
										: () => {}
								}
							>
								<div className="relative aspect-square h-9 shrink-0 overflow-hidden">
									<Image
										src={url}
										alt={file?.name || 'Preview'}
										className="size-9 rounded-md"
										layout="fill"
										objectFit="cover"
									/>
								</div>
								<div className="flex w-full flex-col">
									<Typography
										as="div"
										variant="caption-large"
										className="truncate overflow-hidden whitespace-nowrap"
									>
										{file?.name || 'Current File'}
									</Typography>
									<Typography
										as="div"
										color="tertiary"
										variant="caption-medium"
										transform="uppercase"
										className="font-fm-brand"
									>
										{formatFileSize(fileSize.size || 0)}
									</Typography>
								</div>
							</div>
							<DeleteModal
								onPrimaryClick={resetState}
								title="Delete uploaded image"
								subTitle="Once deleted, this can't be undone. Don't worry! You can always upload a new image."
							>
								<Button
									variant="text"
									className={cn('text-fm-negative gap-2', {
										'text-fm-icon-inactive': defaultUrl === url,
									})}
									innerClassName="!p-0 translate-y-0"
									disabled={defaultUrl === url}
								>
									<TrashIcon
										height={16}
										width={16}
										className={cn('text-fm-negative uppercase', {
											'text-fm-icon-inactive': defaultUrl === url,
										})}
									/>{' '}
									DELETE
								</Button>
							</DeleteModal>
						</div>
					</Else>
				</IfElse>
			</div>
			<FormDescription className="flex flex-col text-xs">
				<div className="mb-4 flex w-full justify-between">
					<Typography
						as="h4"
						color="tertiary"
						variant="caption-small"
						transform="uppercase"
						className="font-fm-brand"
					>
						FORMATS: {supportedFormat}
					</Typography>
					<Typography
						as="h4"
						color="tertiary"
						variant="caption-small"
						transform="uppercase"
						className="font-fm-brand"
					>
						MAX SIZE: {maxSize} MB
					</Typography>
				</div>
			</FormDescription>
		</>
	)
}
