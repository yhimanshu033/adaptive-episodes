import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import Image from '@/components/ui/image'
import { cn, trim } from '@/lib/utils/helpers'

type ImageUploadProps = {
	defaultFile?: File | null
	defaultUrl?: string
	onFileSelect: ({ file, url }: { file: File; url: string }) => void
} & React.ComponentProps<'input'>
export default function FileUpload({
	onFileSelect,
	defaultFile = null,
	defaultUrl = '',
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
		<div
			className={cn(
				'rounded-lg border-2 border-dashed p-6 transition-colors',
				isDragging
					? 'border-primary bg-primary/5'
					: 'border-muted-foreground/25 hover:border-primary/50'
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
						<Upload className="text-muted-foreground size-10" />
						<h3 className="text-lg font-medium">Add file</h3>
						<p className="text-muted-foreground text-sm">
							Drag and drop or click to select files
						</p>
					</If>
					<Else>
						<div className="w-full">
							<div className="bg-muted/50 flex items-center justify-between rounded-md border p-2">
								<div className="flex items-center gap-2 overflow-hidden">
									<Image
										src={url}
										alt={file?.name || 'Preview'}
										className="text-primary size-6 shrink-0"
									/>
									<span className="truncate text-sm font-medium">
										{trim(file?.name || 'Current File', 15)}
									</span>
									<If condition={!!file?.size}>
										<span className="text-muted-foreground text-xs">
											{fileSize}
										</span>
									</If>
								</div>
								<Button
									tooltip="Reset"
									type="button"
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.stopPropagation()
										resetState()
									}}
								>
									<X className="size-4" />
								</Button>
							</div>
						</div>
					</Else>
				</IfElse>
			</div>
		</div>
	)
}
