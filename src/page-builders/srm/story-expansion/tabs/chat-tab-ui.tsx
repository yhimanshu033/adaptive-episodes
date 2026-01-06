'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { CrossIcon } from '@/icons/cross-icon'
import { useSpeechToText } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-speech-to-text'
import { Mic, Paperclip } from 'lucide-react'
import { toast } from 'sonner'

import CircularLoader from '@/components/aural-ui/circular-loader'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import TextArea from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

import { TMessage } from '../lib/types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 2
const ACCEPTED_FILE_TYPES = [
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
	'text/plain', // .txt
]

export interface IChatTabUIProps {
	emptyStateMessage?: string
	files?: File[]
	handleSendMessage: (input: string, files?: File[]) => void
	input?: string
	isSendingMessage: boolean
	messages: TMessage[]
	setFiles?: (files: File[]) => void
	setInput?: (value: string) => void
}

export default function ChatTabUI({
	messages,
	input: externalInput,
	setInput: externalSetInput,
	handleSendMessage,
	isSendingMessage,
	emptyStateMessage = 'Start a conversation with AI',
	files: externalFiles,
	setFiles: externalSetFiles,
}: IChatTabUIProps) {
	const {
		startRecording,
		stopRecording,
		isLoading: isSpeechToTextLoading,
		orderedTranscript,
		isRecording,
	} = useSpeechToText()

	const [internalInput, setInternalInput] = useState<string>('')
	const [internalFiles, setInternalFiles] = useState<File[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// Use external input/files if provided, otherwise use internal state
	const input = externalInput ?? internalInput
	const setInput = externalSetInput ?? setInternalInput
	const files = externalFiles ?? internalFiles
	const setFiles = externalSetFiles ?? setInternalFiles

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	useEffect(() => {
		if (!orderedTranscript) {
			return
		}
		setInput(orderedTranscript)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderedTranscript])

	const handleSubmit = () => {
		stopRecording()
		handleSendMessage(input, files.length > 0 ? files : undefined)
		// Clear input if managed internally
		if (!externalInput && input.trim()) {
			setInternalInput('')
		}
		// Clear files if managed internally
		if (!externalFiles && files.length > 0) {
			setInternalFiles([])
		}
	}

	const hasText = input.trim().length > 0

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey && hasText) {
			e.preventDefault()
			handleSubmit()
		}
	}

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
					toast.error(
						`File "${file.name}" exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
						{
							icon: <BubbleCrossedIcon />,
						}
					)
					return
				}
			}

			const updatedFiles = [...files, ...newFiles]
			setFiles(updatedFiles)
		},
		[files, setFiles]
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
		},
		[files, setFiles]
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

	const handleFileButtonClick = useCallback(() => {
		fileInputRef.current?.click()
	}, [])

	const disabled = isSendingMessage || isSpeechToTextLoading

	return (
		<div className="grid h-full grid-rows-[1fr_auto_auto] overflow-hidden">
			<ScrollArea className="h-full overflow-auto px-4">
				<div className="flex flex-col gap-4 py-4">
					{messages.length === 0 ? (
						<div className="text-fm-tertiary py-8 text-center">
							<p className="text-fm-md">{emptyStateMessage}</p>
						</div>
					) : (
						messages.map((message) => (
							<div
								key={message.id}
								className={cn(
									'flex',
									message.role === 'user' ? 'justify-end' : 'justify-start'
								)}
							>
								<div
									className={cn(
										'max-w-[80%] rounded-lg p-3',
										message.role === 'user'
											? 'bg-fm-primary text-fm-surface-secondary'
											: 'bg-fm-surface-secondary text-fm-primary'
									)}
								>
									<p className="text-fm-md whitespace-pre-wrap">
										{message.content}
									</p>
								</div>
							</div>
						))
					)}
					{isSendingMessage && (
						<div className="flex justify-start">
							<div className="bg-fm-surface-secondary text-fm-primary rounded-lg p-3">
								<p className="text-fm-md">AI is thinking...</p>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>

			<Divider className="mx-4" />
			<div className="space-y-4 p-4">
				{files.length > 0 && (
					<div className="space-y-2">
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
				<div className="flex items-center gap-2">
					<input
						ref={fileInputRef}
						type="file"
						multiple
						accept=".docx,.txt"
						onChange={handleFileInputChange}
						className="hidden"
					/>
					<IconButton
						type="button"
						label="Insert Files"
						tooltip="Insert Files (Max 2 files, 10MB each)"
						onClick={handleFileButtonClick}
						disabled={disabled || files.length >= MAX_FILES}
						className={cn('transition-all duration-200', {
							'border-fm-divider-primary bg-transparent':
								disabled || files.length >= MAX_FILES,
						})}
						variant={
							!disabled && files.length < MAX_FILES ? 'ghost' : 'outlined'
						}
						icon={
							<Paperclip
								width={18}
								height={18}
								className={cn(
									'text-fm-divider-primary transition-colors duration-200',
									disabled || files.length >= MAX_FILES
										? 'text-fm-contrast'
										: ''
								)}
							/>
						}
					/>
					<TextArea
						ref={textareaRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type your message..."
						decoration="outline"
						autoGrow
						minHeight={40}
						maxHeight={120}
						className="flex-1"
					/>
					<IconButton
						type="button"
						label={isRecording ? 'Stop Recording' : 'Talk it Out'}
						tooltip={isRecording ? 'Stop Recording' : 'Talk it Out'}
						onClick={() => {
							if (isRecording) {
								stopRecording()
							} else {
								void startRecording()
							}
						}}
						disabled={disabled}
						className={cn(
							'transition-all duration-200',
							{
								'border-fm-divider-primary bg-transparent': disabled,
							},
							{
								'bg-fm-primary hover:bg-fm-primary': !isSpeechToTextLoading,
							},
							{
								'bg-fm-secondary-800 hover:bg-fm-secondary-800':
									isRecording || isSpeechToTextLoading,
							}
						)}
						variant={!disabled ? 'ghost' : 'outlined'}
						icon={
							isSpeechToTextLoading ? (
								<CircularLoader className={cn('size-4')} />
							) : (
								<Mic
									width={18}
									height={18}
									className={cn(
										'text-fm-divider-primary transition-colors duration-200',
										disabled ? 'text-fm-contrast' : ''
									)}
								/>
							)
						}
					/>
					<IconButton
						onClick={handleSubmit}
						disabled={!hasText || disabled}
						variant="outlined"
						icon={<ArrowRightIcon width={16} height={16} />}
						label="Send"
					/>
				</div>
			</div>
		</div>
	)
}
