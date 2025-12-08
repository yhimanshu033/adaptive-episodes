import React, { useEffect } from 'react'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { useSpeechToText } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-speech-to-text'
import useOutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire/provider'
import { Mic } from 'lucide-react'

import CircularLoader from '@/components/aural-ui/circular-loader'
import { IconButton } from '@/components/aural-ui/icon-button'
import TextArea, { textareaVariants } from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

export default function OutlinerQuestionnairePromptInput() {
	const {
		inputPrompt,
		setInputPrompt,
		handleSendChat,
		isChatLoading,
		lastMessageTaskId,
	} = useOutlinerQuestionnaire()

	const {
		startRecording,
		stopRecording,
		isLoading: isSpeechToTextLoading,
		orderedTranscript,
		isRecording,
	} = useSpeechToText()

	useEffect(() => {
		if (!orderedTranscript) {
			return
		}
		setInputPrompt(orderedTranscript)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderedTranscript])

	const handleSubmit = () => {
		stopRecording()
		void handleSendChat()
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey && !disabled && hasText) {
			e.preventDefault()
			handleSubmit()
		}
	}

	const disabled = isChatLoading || !!lastMessageTaskId
	const hasText = !!inputPrompt.trim().length

	return (
		<div className="bg-background sticky bottom-0 z-50 p-4">
			<div
				className={cn(
					textareaVariants({
						variant: 'default',
					}),
					'focus:border-fm-divider-contrast w-auto rounded-md border-transparent transition-all duration-200'
				)}
			>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						handleSubmit()
					}}
				>
					<TextArea
						fullWidth
						value={inputPrompt}
						onChange={(e) => setInputPrompt(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={'Chat here...'}
						minHeight={100}
						maxHeight={100}
						unstyled={true}
						className="w-full resize-none outline-none"
					/>
					<div className="flex w-full items-center justify-end gap-2">
						<IconButton
							type={'button'}
							label={isRecording ? 'Stop Recording' : 'Talk it Out'}
							tooltip={isRecording ? 'Stop Recording' : 'Talk it Out'}
							onClick={() => {
								if (isRecording) {
									stopRecording()
								} else {
									void startRecording()
								}
							}}
							disabled={isChatLoading || isSpeechToTextLoading}
							className={cn(
								'size-8 p-0! transition-all duration-200',
								{
									'border-fm-divider-primary bg-transparent': isChatLoading,
								},
								{
									'bg-fm-primary hover:bg-fm-primary': !isSpeechToTextLoading,
								},
								{
									'bg-fm-secondary-800 hover:bg-fm-secondary-800':
										isRecording || isSpeechToTextLoading,
								}
							)}
							variant={!isChatLoading ? 'ghost' : 'outlined'}
							icon={
								isSpeechToTextLoading ? (
									<CircularLoader className={cn('size-4')} />
								) : (
									<Mic
										width={18}
										height={18}
										className={cn(
											'text-fm-divider-primary transition-colors duration-200',
											isChatLoading ? 'text-fm-contrast' : ''
										)}
									/>
								)
							}
						/>
						<IconButton
							type={disabled || !hasText ? 'button' : 'submit'}
							label={'Send Message'}
							tooltip={'Send Message'}
							onClick={() => {
								handleSubmit()
							}}
							disabled={disabled || !hasText}
							className={cn(
								'bg-fm-primary size-8 p-0! transition-all duration-200',
								{
									'border-fm-divider-primary bg-transparent':
										disabled || !hasText,
								}
							)}
							variant={disabled || !hasText ? 'ghost' : 'outlined'}
							icon={
								<ArrowRightIcon
									width={16}
									height={16}
									className={cn(
										'text-fm-divider-primary -rotate-90 transition-colors duration-200',
										hasText ? 'text-fm-contrast' : ''
									)}
								/>
							}
						/>
					</div>
				</form>
			</div>
		</div>
	)
}
