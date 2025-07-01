'use client'

import type React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { PROMO_PAGE } from '@/constants/german-constants'
import useVideoTranslation from '@/hooks/mutation/use-video-translation'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { Copy, FileVideo, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

import IfElse, { Else, If } from '@/components/if-else'
import { IconLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import Spinner from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils/helpers'

export default function VideoUpload() {
	const [isDragging, setIsDragging] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { mutate, data, isPending, isError, reset } = useVideoTranslation()

	const { responses, taskEnded } = useSocketStreaming()

	const translatedData = useMemo(() => {
		if (!data || !responses[data]) {
			return ''
		}

		const concatenatedResponse = responses[data].join('')
		return concatenatedResponse
	}, [data, responses])

	const isEnded = useMemo(() => {
		if (!data) {
			return false
		}
		return taskEnded[data]
	}, [data, taskEnded])

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
			if (droppedFile.type.startsWith('video/')) {
				setFile(droppedFile)
			} else {
				toast.error(PROMO_PAGE.UPLOAD_VIDEO, {
					icon: <BubbleCrossedIcon />,
				})
			}
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		reset()
		if (e.target.files && e.target.files.length > 0) {
			const selectedFile = e.target.files[0]
			if (selectedFile.type.startsWith('video/')) {
				setFile(selectedFile)
			} else {
				toast.error(PROMO_PAGE.UPLOAD_VIDEO, {
					icon: <BubbleCrossedIcon />,
				})
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
		reset()
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!file) {
			return
		}

		if (data) {
			resetState()
			return
		}
		mutate({ file })
	}

	const handleCopy = useCallback(() => {
		void navigator.clipboard.writeText(translatedData)
		toast.success(PROMO_PAGE.COPIED)
	}, [translatedData])

	const fileSize = useMemo(
		() => ((file?.size || 0) / (1024 * 1024)).toFixed(2) + 'MB',
		[file]
	)

	const videoUrl = useMemo(
		() => (!file ? '' : URL.createObjectURL(file)),
		[file]
	)

	return (
		<form
			onSubmit={handleSubmit}
			className={cn('container max-w-3xl py-10', { 'max-w-6xl': !!data })}
		>
			<Card>
				<CardHeader>
					<CardTitle>{PROMO_PAGE.TITLE}</CardTitle>
					<CardDescription>{PROMO_PAGE.DESCRIPTION}</CardDescription>
				</CardHeader>
				<CardContent
					className={cn('grid w-full grid-cols-1 gap-6', {
						'grid-cols-2': !!data,
					})}
				>
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
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							accept="video/*"
							className="hidden"
						/>

						<div className="flex flex-col items-center justify-center gap-2 text-center">
							<IfElse condition={!file}>
								<If>
									<Upload className="text-muted-foreground size-10" />
									<h3 className="text-lg font-medium">
										{PROMO_PAGE.DND_TITLE}
									</h3>
									<p className="text-muted-foreground text-sm">
										{PROMO_PAGE.DND_DESCRIPTION}
									</p>
								</If>
								<Else>
									<div className="w-full">
										<div className="bg-muted/50 flex items-center justify-between rounded-md border p-2">
											<div className="flex items-center gap-2 overflow-hidden">
												<FileVideo className="text-primary size-6 shrink-0" />
												<span className="truncate text-sm font-medium">
													{file?.name}
												</span>
												<span className="text-muted-foreground text-xs">
													{fileSize}
												</span>
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
										<video
											controls
											className="mt-4 h-96 w-full rounded-lg bg-black"
											src={videoUrl}
										></video>
									</div>
								</Else>
							</IfElse>
						</div>
					</div>

					<If condition={isError}>
						<div className="text-destructive text-sm font-medium">
							{PROMO_PAGE.ERROR}
						</div>
					</If>

					<If condition={!!data}>
						<div className="grid grid-rows-[auto_1fr] gap-2">
							<div className="flex w-full items-center justify-between">
								<h3 className="text-lg font-medium">
									{PROMO_PAGE.TRANSCRIPTION_TITLE}
								</h3>
								<div className="flex items-center gap-2">
									<If condition={!isEnded}>
										<Spinner size={20} />
									</If>
									<Button
										tooltip="Copy"
										type="button"
										variant="ghost"
										size="icon"
										onClick={handleCopy}
									>
										<Copy className="size-4" />
									</Button>
								</div>
							</div>
							<Textarea
								value={translatedData || PROMO_PAGE.PROCESSING}
								readOnly
								className="h-full resize-none"
							/>
						</div>
					</If>
				</CardContent>
				<CardFooter>
					<Button
						disabled={!file || isPending}
						className="w-full"
						type="submit"
					>
						<IfElse condition={isPending}>
							<If>
								<IconLoader />
								{PROMO_PAGE.PROCESSING}
							</If>
							<Else>{data ? PROMO_PAGE.RESET : PROMO_PAGE.TRANSCRIBE}</Else>
						</IfElse>
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}
