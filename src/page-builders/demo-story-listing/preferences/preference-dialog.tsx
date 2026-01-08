'use client'

import React, { useCallback, useState } from 'react'
import { useUserPreferencesStore } from '@/store/user-preferences-store'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, Sparkles } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogContent,
	useDialogCleanup,
} from '@/components/aural-ui/dialog'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Typography } from '@/components/aural-ui/typography'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/aural-ui/utils'

import {
	calculateBucket,
	ListeningProfile,
	ONBOARDING_QUESTIONS,
	PreferenceQuestion,
	PreferenceScores,
	PROFILE_INFO,
} from './constants'

interface PreferenceDialogProps {
	onClose: () => void
	open: boolean
}

export default function PreferenceDialog({
	open,
	onClose,
}: PreferenceDialogProps) {
	const { commitAnswers } = useUserPreferencesStore()

	// Local state for the current onboarding flow
	// This prevents modifying the store until the user completes the flow
	const [localAnswers, setLocalAnswers] = useState<Record<number, number>>({})
	const [localScores, setLocalScores] = useState<PreferenceScores>({
		speed: 0,
		immersive: 0,
		distracted: 0,
	})

	const [currentIdx, setCurrentIdx] = useState(0)
	const [selectedOption, setSelectedOption] = useState<number | null>(null)
	const [showResult, setShowResult] = useState(false)
	const [isCalculating, setIsCalculating] = useState(false)
	const [computedProfile, setComputedProfile] =
		useState<ListeningProfile | null>(null)

	const { handleDialogClose } = useDialogCleanup({ threshold: 1000 })

	const totalQuestions = ONBOARDING_QUESTIONS.length
	const currentQuestion: PreferenceQuestion | undefined =
		ONBOARDING_QUESTIONS[currentIdx]
	const progress = ((currentIdx + 1) / totalQuestions) * 100

	// Reset local state only (not the store)
	const resetLocalState = useCallback(() => {
		setLocalAnswers({})
		setLocalScores({ speed: 0, immersive: 0, distracted: 0 })
		setCurrentIdx(0)
		setSelectedOption(null)
		setShowResult(false)
		setIsCalculating(false)
		setComputedProfile(null)
	}, [])

	const handleSelectOption = useCallback(
		(optionIdx: number) => {
			if (!currentQuestion) {
				return
			}

			setSelectedOption(optionIdx)
			const option = currentQuestion.options[optionIdx]

			// Update local answers and scores
			const newAnswers = { ...localAnswers, [currentQuestion.id]: optionIdx }
			const newScores: PreferenceScores = {
				speed: localScores.speed + option.scores.speed,
				immersive: localScores.immersive + option.scores.immersive,
				distracted: localScores.distracted + option.scores.distracted,
			}

			setLocalAnswers(newAnswers)
			setLocalScores(newScores)

			// Move to next question after a brief delay
			setTimeout(() => {
				if (currentIdx < totalQuestions - 1) {
					setCurrentIdx((prev) => prev + 1)
					setSelectedOption(null)
				} else {
					// Last question - simulate API call and compute profile
					setIsCalculating(true)

					// Simulate backend calculation delay
					setTimeout(() => {
						const result = calculateBucket(newScores)
						setComputedProfile(result.bucket)

						// Commit the answers to the store (this saves to localStorage)
						commitAnswers(newAnswers, newScores)

						setIsCalculating(false)
						setShowResult(true)
					}, 1500)
				}
			}, 300)
		},
		[
			currentQuestion,
			currentIdx,
			totalQuestions,
			localAnswers,
			localScores,
			commitAnswers,
		]
	)

	const handleBack = useCallback(() => {
		if (currentIdx > 0) {
			// When going back, we need to subtract the previous answer's scores
			const prevQuestionId = ONBOARDING_QUESTIONS[currentIdx - 1].id
			const prevAnswerIdx = localAnswers[prevQuestionId]

			if (prevAnswerIdx !== undefined) {
				const prevOption =
					ONBOARDING_QUESTIONS[currentIdx - 1].options[prevAnswerIdx]
				if (prevOption) {
					setLocalScores((prev) => ({
						speed: prev.speed - prevOption.scores.speed,
						immersive: prev.immersive - prevOption.scores.immersive,
						distracted: prev.distracted - prevOption.scores.distracted,
					}))
				}
				// Remove the answer
				const newAnswers = { ...localAnswers }
				delete newAnswers[prevQuestionId]
				setLocalAnswers(newAnswers)
			}

			setCurrentIdx((prev) => prev - 1)
			setSelectedOption(null)
		}
	}, [currentIdx, localAnswers])

	const handleFinish = useCallback(() => {
		handleDialogClose()
		resetLocalState()
		onClose()
	}, [onClose, handleDialogClose, resetLocalState])

	const handleCloseDialog = useCallback(() => {
		// Just close and reset local state - don't touch the store
		handleDialogClose()
		resetLocalState()
		onClose()
	}, [handleDialogClose, resetLocalState, onClose])

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			handleCloseDialog()
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				variant="info"
				showCloseButton={!isCalculating}
				classes={{
					root: 'flex max-h-[90vh] w-[600px] max-w-[90vw] flex-col overflow-hidden p-0',
					overlay: 'z-50',
					content: 'z-60',
				}}
				noise="none"
				opacity="high"
				glass="medium"
			>
				{/* Header */}
				<div className="border-fm-divider-secondary flex items-center justify-between border-b px-6 py-4">
					<div className="flex items-center gap-3">
						{currentIdx > 0 && !showResult && !isCalculating && (
							<IconButton
								icon={<ChevronLeft className="size-5" />}
								size="small"
								variant="ghost"
								label="Go back"
								onClick={handleBack}
							/>
						)}
						<div>
							<Typography variant="label-medium" as="div">
								{showResult
									? 'Your Listening Profile'
									: isCalculating
										? 'Analyzing Your Preferences...'
										: 'Personalize Your Experience'}
							</Typography>
							{!showResult && !isCalculating && (
								<Typography variant="caption-small" color="tertiary" as="div">
									Question {currentIdx + 1} of {totalQuestions}
								</Typography>
							)}
						</div>
					</div>
				</div>

				{/* Progress */}
				{!showResult && !isCalculating && (
					<Progress value={progress} className="h-1 rounded-none" />
				)}

				{/* Content */}
				<div className="min-h-[400px] flex-1 overflow-y-auto p-6">
					<AnimatePresence mode="wait">
						{/* Calculating Animation */}
						{isCalculating && (
							<motion.div
								key="calculating"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex flex-col items-center justify-center gap-6 py-12"
							>
								{/* Animated loader */}
								<div className="relative">
									<motion.div
										className="bg-fm-secondary-600/20 size-24 rounded-full"
										animate={{
											scale: [1, 1.2, 1],
											opacity: [0.5, 1, 0.5],
										}}
										transition={{
											duration: 1.5,
											repeat: Infinity,
											ease: 'easeInOut',
										}}
									/>
									<motion.div
										className="bg-fm-secondary-600 absolute inset-0 m-auto size-16 rounded-full"
										animate={{
											scale: [1, 0.9, 1],
										}}
										transition={{
											duration: 1.5,
											repeat: Infinity,
											ease: 'easeInOut',
										}}
									>
										<Sparkles className="absolute inset-0 m-auto size-8 text-white" />
									</motion.div>
								</div>
								<div className="text-center">
									<Typography variant="label-medium" as="div" className="mb-2">
										Crunching the numbers...
									</Typography>
									<Typography variant="body-small" color="tertiary">
										Finding the perfect listening style for you
									</Typography>
								</div>
							</motion.div>
						)}

						{/* Result Screen */}
						{showResult && computedProfile && !isCalculating && (
							<motion.div
								key="result"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ duration: 0.4, ease: 'easeOut' }}
								className="flex flex-col items-center gap-6 py-8 text-center"
							>
								{/* Animated emoji reveal */}
								<motion.div
									initial={{ scale: 0, rotate: -180 }}
									animate={{ scale: 1, rotate: 0 }}
									transition={{
										type: 'spring',
										stiffness: 200,
										damping: 15,
										delay: 0.1,
									}}
									className="bg-fm-surface-secondary relative flex size-28 items-center justify-center rounded-full text-6xl shadow-lg"
								>
									{PROFILE_INFO[computedProfile].emoji}
									{/* Celebration particles */}
									<motion.div
										className="absolute inset-0"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
									>
										{Array.from({ length: 6 }).map((_, i) => (
											<motion.div
												key={i}
												className="bg-fm-secondary-600 absolute size-2 rounded-full"
												initial={{
													x: 0,
													y: 0,
													opacity: 1,
												}}
												animate={{
													x: Math.cos((i * 60 * Math.PI) / 180) * 60,
													y: Math.sin((i * 60 * Math.PI) / 180) * 60,
													opacity: 0,
												}}
												transition={{
													duration: 0.6,
													delay: 0.3 + i * 0.05,
													ease: 'easeOut',
												}}
												style={{
													left: '50%',
													top: '50%',
													marginLeft: -4,
													marginTop: -4,
												}}
											/>
										))}
									</motion.div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
									className="flex flex-col items-center"
								>
									<Typography variant="title-small" as="h2" className="mb-2">
										{PROFILE_INFO[computedProfile].title}
									</Typography>
									<Typography
										variant="body-small"
										color="tertiary"
										className="max-w-md"
									>
										{PROFILE_INFO[computedProfile].description}
									</Typography>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 }}
								>
									<Button
										variant="primary"
										onClick={handleFinish}
										className="mt-4"
										innerClassName="translate-y-0"
									>
										Start Listening
									</Button>
								</motion.div>
							</motion.div>
						)}

						{/* Questions */}
						{!showResult && !isCalculating && currentQuestion && (
							<motion.div
								key={currentQuestion.id}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.2 }}
								className="flex flex-col gap-6"
							>
								<Typography variant="label-large" as="h2">
									{currentQuestion.question}
								</Typography>

								<div className="grid gap-3">
									{currentQuestion.options.map((option, idx) => (
										<button
											key={idx}
											onClick={() => handleSelectOption(idx)}
											disabled={selectedOption !== null}
											className={cn(
												'border-fm-divider-secondary hover:border-fm-secondary-600 group relative flex items-center gap-4 rounded-lg border p-4 text-left transition-all',
												'hover:bg-fm-surface-secondary/50',
												selectedOption === idx &&
													'border-fm-secondary-600 bg-fm-secondary-600/10',
												selectedOption !== null &&
													selectedOption !== idx &&
													'opacity-50'
											)}
										>
											<div
												className={cn(
													'border-fm-divider-contrast flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
													selectedOption === idx &&
														'border-fm-secondary-600 bg-fm-secondary-600'
												)}
											>
												{selectedOption === idx && (
													<Check className="size-3.5 text-white" />
												)}
											</div>
											<Typography variant="body-small">
												{option.text}
											</Typography>
										</button>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</DialogContent>
		</Dialog>
	)
}
