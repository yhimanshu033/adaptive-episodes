import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PlusIcon } from '@/icons/plus-icon'
import { TrashIcon } from '@/icons/trash-icon'

import { FormDescription } from '@/components/aural-ui/form'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Typography } from '@/components/aural-ui/typography'
import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import Image from '@/components/ui/image'
import { cn, trim } from '@/lib/utils/helpers'

type ImageUploadProps = {
	classes?: {
		isDragging?: string
		root?: string
	}
	defaultFile?: File | null
	defaultUrl?: string
	onFileSelect: ({ file, url }: { file: File; url: string }) => void
} & React.ComponentProps<'input'>
export default function FileUpload({
	onFileSelect,
	defaultFile = null,
	defaultUrl = '',
	classes = {
		root: '',
		isDragging: '',
	},
	...props
}: ImageUploadProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [file, setFile] = useState<File | null>(defaultFile)
	const fileInputRef = useRef<HTMLInputElement>(null)

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
			setFile(droppedFile)
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const selectedFile = e.target.files[0]
			setFile(selectedFile)
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
		if (defaultUrl) {
			fileInputRef.current?.click()
		}
	}

	const fileSize = useMemo(
		() => ((file?.size || 0) / (1024 * 1024)).toFixed(2) + 'MB',
		[file]
	)

	const url = useMemo(
		() => (!file ? defaultUrl : URL.createObjectURL(file)),
		[file, defaultUrl]
	)

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
					'mb-0.5 rounded-sm border-1 transition-colors',
					classes.root,
					isDragging
						? `border-fm-divider-contrast`
						: 'border-fm-divider-primary hover:border-fm-divider-contrast',
					isDragging && classes.isDragging,
					!url && 'border-dashed'
				)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={() => fileInputRef.current?.click()}
			>
				<input
					{...props}
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					className="hidden"
				/>
				<div className="flex flex-col items-center justify-center gap-2 text-center">
					<IfElse condition={!url}>
						<If>
							<div className="px-4 py-8">
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
										upload story
									</Typography>
								</Typography>
							</div>
						</If>
						<Else>
							<div className="w-full">
								<div className="flex items-center justify-between rounded-md py-2 pl-4">
									<div className="flex">
										<Image
											src={url}
											alt={file?.name || 'Preview'}
											className="size-9"
										/>
										<div className="ml-3">
											<h3 className="truncate text-sm font-medium">
												{trim(file?.name || 'Current File', 15)}
											</h3>
											<h3 className="font-fm-brand text-fm-tertiary -ml-9 text-xs">
												20 M.B.
											</h3>
											<If condition={!!file?.size}>
												<span className="font-fm-brand text-fm-tertiary text-xs">
													{fileSize}
												</span>
											</If>
										</div>
									</div>
									<Button
										type="button"
										variant="link"
										className="text-fm-negative gap-2 text-xs"
										onClick={(e) => {
											e.stopPropagation()
											resetState()
										}}
									>
										<TrashIcon
											height={16}
											width={16}
											className="text-fm-negative uppercase"
										/>
										Delete
									</Button>
								</div>
							</div>
						</Else>
					</IfElse>
				</div>
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
						FORMATS: JPG, PNG
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
		</>
	)
}
