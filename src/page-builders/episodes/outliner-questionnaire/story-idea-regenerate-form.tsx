'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useUploadFile from '@/hooks/mutation/use-upload-file'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { CrossIcon } from '@/icons/cross-icon'
import { useSpeechToText } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-speech-to-text'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mic } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { IconButton } from '@/components/aural-ui/icon-button'
import TextArea from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

import useOutlinerQuestionnaire from './provider'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 3
const ACCEPTED_FILE_TYPES = [
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
	'text/plain', // .txt
]

const regenerateFormSchema = z.object({
	prompt: z.string().optional(),
	files: z
		.array(z.instanceof(File))
		.max(MAX_FILES, { message: `Maximum ${MAX_FILES} files allowed` })
		.refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
			message: 'Each file must be 5MB or less',
		})
		.refine(
			(files) =>
				files.every(
					(file) =>
						ACCEPTED_FILE_TYPES.includes(file.type) ||
						file.name.toLowerCase().endsWith('.docx') ||
						file.name.toLowerCase().endsWith('.txt')
				),
			{ message: 'Only .docx and .txt files are allowed' }
		)
		.optional()
		.default([]),
})

type RegenerateFormSchema = z.infer<typeof regenerateFormSchema>

export default function StoryIdeaRegenerateForm() {
	const [isDragging, setIsDragging] = useState(false)
	const [files, setFiles] = useState<File[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)
	const uploadFileMutation = useUploadFile()
	const { handleStoryIdeaRegenerateWithPrompt, isNewIdeaRegenerating } =
		useOutlinerQuestionnaire()

	const {
		startRecording,
		stopRecording,
		isLoading: isSpeechToTextLoading,
		orderedTranscript,
		isRecording,
	} = useSpeechToText()

	const form = useForm<RegenerateFormSchema>({
		resolver: zodResolver(regenerateFormSchema),
		mode: 'onChange',
		defaultValues: {
			prompt: '',
			files: [],
		},
	})

	// Update form prompt when transcript changes
	useEffect(() => {
		if (!orderedTranscript) {
			return
		}
		form.setValue('prompt', orderedTranscript)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderedTranscript])

	const prompt = form.watch('prompt')
	const formFiles = form.watch('files')

	const isFileOrPromptPresent = useMemo(() => {
		return !!prompt || !!formFiles.length
	}, [formFiles, prompt])

	const handleFilesValidation = useCallback(
		(newFiles: File[]) => {
			// Check total file count
			const totalFiles = files.length + newFiles.length
			if (totalFiles > MAX_FILES) {
				toast.error(`Maximum ${MAX_FILES} files allowed`, {
					icon: <BubbleCrossedIcon />,
				})
				return
			}

			// Check for duplicates
			const duplicateFiles = newFiles.filter((newFile) =>
				files.some(
					(file) => file.name === newFile.name && file.size === newFile.size
				)
			)
			if (duplicateFiles.length > 0) {
				toast.error('Some files are already added', {
					icon: <BubbleCrossedIcon />,
				})
				return
			}

			// Validate each file
			for (const file of newFiles) {
				// Check MIME type or file extension as fallback
				const isValidType =
					ACCEPTED_FILE_TYPES.includes(file.type) ||
					file.name.toLowerCase().endsWith('.docx') ||
					file.name.toLowerCase().endsWith('.txt')
				if (!isValidType) {
					toast.error(`File "${file.name}" is not a .docx or .txt file`, {
						icon: <BubbleCrossedIcon />,
					})
					return
				}
				if (file.size > MAX_FILE_SIZE) {
					toast.error(`File "${file.name}" exceeds 5MB limit`, {
						icon: <BubbleCrossedIcon />,
					})
					return
				}
			}

			const updatedFiles = [...files, ...newFiles]
			setFiles(updatedFiles)
			form.setValue('files', updatedFiles)
		},
		[files, form]
	)

	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
	}, [])

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault()
			e.stopPropagation()
			setIsDragging(false)

			const droppedFiles = Array.from(e.dataTransfer.files)
			handleFilesValidation(droppedFiles)
		},
		[handleFilesValidation]
	)

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files && e.target.files.length > 0) {
				const selectedFiles = Array.from(e.target.files)
				handleFilesValidation(selectedFiles)
			}
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		},
		[handleFilesValidation]
	)

	const handleRemoveFile = useCallback(
		(index: number) => {
			const updatedFiles = files.filter((_, i) => i !== index)
			setFiles(updatedFiles)
			form.setValue('files', updatedFiles)
		},
		[files, form]
	)

	const onSubmit = useCallback(
		async (data: RegenerateFormSchema) => {
			try {
				// Stop recording if active
				stopRecording()

				// Upload files first
				let fileUrls: string[] = []
				if (data.files && data.files.length > 0) {
					const uploadPromises = data.files.map((file) =>
						uploadFileMutation.mutateAsync(file)
					)
					const uploadResults = await Promise.all(uploadPromises)
					fileUrls = uploadResults
						.map((result) => result?.url)
						.filter((url): url is string => !!url)
				}

				// Call the regenerate function with prompt and file_urls
				await handleStoryIdeaRegenerateWithPrompt({
					prompt: data.prompt,
					file_urls: fileUrls.length > 0 ? fileUrls : undefined,
				})

				toast.success('Story idea regeneration started!', {
					icon: <BubbleCheckIcon />,
				})

				// Reset form
				form.reset()
				setFiles([])
			} catch (error) {
				console.error('Error submitting form:', error)
				toast.error('Failed to regenerate story idea', {
					icon: <BubbleCrossedIcon />,
				})
			}
		},
		[
			stopRecording,
			uploadFileMutation,
			handleStoryIdeaRegenerateWithPrompt,
			form,
		]
	)

	const formatFileSize = useCallback((bytes: number): string => {
		if (bytes < 1024) {
			return bytes + ' B'
		}
		if (bytes < 1024 * 1024) {
			return (bytes / 1024).toFixed(2) + ' KB'
		}
		return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
	}, [])

	const handleMicClick = useCallback(() => {
		if (isRecording) {
			stopRecording()
		} else {
			void startRecording()
		}
	}, [isRecording, stopRecording, startRecording])

	const handleDragAreaClick = useCallback(() => {
		fileInputRef.current?.click()
	}, [])

	return (
		<div className="space-y-4 px-4 pb-4">
			<div>
				<h3 className="text-fm-primary mb-1 text-lg font-semibold">
					{"What's your story idea?"}
				</h3>
				<p className="text-fm-secondary text-sm">
					{
						'Provide a description and optionally upload files to generate your story idea'
					}
				</p>
			</div>

			<form
				onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
				className="space-y-4"
			>
				<div className="relative">
					<TextArea
						label="Idea Description"
						placeholder="Enter your idea here..."
						{...form.register('prompt')}
						variant={form.formState.errors.prompt ? 'error' : 'default'}
						helperText={form.formState.errors.prompt?.message || ''}
						classes={{
							textarea: 'min-h-32 pr-12',
							label: 'pb-2',
						}}
						value={prompt}
					/>
					<div className="absolute -top-2 right-1">
						<IconButton
							type="button"
							size="small"
							label={isRecording ? 'Stop Recording' : 'Talk it Out'}
							tooltip={isRecording ? 'Stop Recording' : 'Talk it Out'}
							onClick={handleMicClick}
							disabled={isNewIdeaRegenerating || isSpeechToTextLoading}
							className={cn(
								'size-6 p-0! transition-all duration-200',
								{
									'border-fm-divider-primary bg-transparent':
										isNewIdeaRegenerating,
								},
								{
									'bg-fm-primary hover:bg-fm-primary':
										!isSpeechToTextLoading && !isNewIdeaRegenerating,
								},
								{
									'bg-fm-secondary-800 hover:bg-fm-secondary-800':
										isRecording || isSpeechToTextLoading,
								}
							)}
							variant={!isNewIdeaRegenerating ? 'ghost' : 'outlined'}
							icon={
								isSpeechToTextLoading ? (
									<CircularLoader className={cn('size-3')} />
								) : (
									<Mic
										width={18}
										height={18}
										className={cn(
											'text-fm-divider-primary size-3 transition-colors duration-200',
											isNewIdeaRegenerating ? 'text-fm-contrast' : ''
										)}
									/>
								)
							}
						/>
					</div>
				</div>

				<div>
					<label className="text-fm-primary font-fm-brand mb-2 block text-sm font-medium">
						Files (Optional)
						<span className="text-fm-tertiary ml-1 text-xs">
							Max {MAX_FILES} files, 5MB each (.docx, .txt only)
						</span>
					</label>

					{/* Drag and Drop Area */}
					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={handleDragAreaClick}
						className={cn(
							'border-fm-divider-primary flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
							isDragging
								? 'border-fm-primary bg-fm-surface-secondary'
								: 'hover:border-fm-primary/50 hover:bg-fm-surface-secondary/50'
						)}
					>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept=".docx,.txt"
							onChange={handleFileInputChange}
							className="hidden"
						/>
						<p className="text-fm-primary mb-2 text-center text-sm">
							Drag and drop files here, or click to select
						</p>
						<p className="text-fm-tertiary text-xs">
							.docx or .txt files only, max 5MB each
						</p>
					</div>

					{/* File List */}
					{files.length > 0 && (
						<div className="mt-4 space-y-2">
							{files.map((file, index) => (
								<div
									key={`${file.name}-${index}`}
									className="bg-fm-surface-secondary border-fm-divider-primary flex items-center justify-between rounded-lg border p-3"
								>
									<div className="min-w-0 flex-1">
										<p className="text-fm-primary truncate text-sm font-medium">
											{file.name}
										</p>
										<p className="text-fm-tertiary text-xs">
											{formatFileSize(file.size)}
										</p>
									</div>
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation()
											handleRemoveFile(index)
										}}
										className="text-fm-tertiary hover:text-fm-primary ml-2 shrink-0 rounded p-1 transition-colors"
									>
										<CrossIcon className="h-4 w-4" />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="flex w-full justify-end gap-2">
					<Button
						size="sm"
						type="submit"
						disabled={
							isNewIdeaRegenerating ||
							uploadFileMutation.isPending ||
							!form.formState.isValid ||
							!isFileOrPromptPresent
						}
						isDisabled={
							isNewIdeaRegenerating ||
							uploadFileMutation.isPending ||
							!form.formState.isValid ||
							!isFileOrPromptPresent
						}
					>
						{uploadFileMutation.isPending
							? 'Uploading...'
							: isNewIdeaRegenerating
								? 'Generating...'
								: 'Generate'}
					</Button>
				</div>
			</form>
		</div>
	)
}
