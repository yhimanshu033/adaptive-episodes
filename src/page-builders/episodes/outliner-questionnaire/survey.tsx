import React, { useEffect, useMemo } from 'react'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { useOutlinerQuestionnaireSurveyQuestions } from '@/page-builders/episodes/outliner-questionnaire/lib/hooks/use-outliner-questionnaire-survey'
import OutlinerLoading from '@/page-builders/episodes/outliner-questionnaire/loading'
import useOutlinerQuestionnaire from '@/page-builders/episodes/outliner-questionnaire/provider'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import DotLoader from '@/components/aural-ui/dot-loader'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import Input from '@/components/aural-ui/input'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/aural-ui/utils'

export default function OutlinerQuestionnaireSurvey() {
	const {
		currentQuestion,
		handleAnswerSelect,
		currentIdx,
		customAnswer,
		setCustomAnswer,
		isCustomAnswerSubmittable,
		handleInitialSurveyFetch,
		questionsData,
		updateOutlinerQuestionnaireSurveyPending,
		handleOptionsGenerate,
		isOptionGenerationPending,
	} = useOutlinerQuestionnaire()

	const { data: fetchedSurvey, isPending: isSurveyPending } =
		useOutlinerQuestionnaireSurveyQuestions()

	const disabled = updateOutlinerQuestionnaireSurveyPending

	const limit = currentIdx > 9 ? (questionsData?.questions?.length ?? 10) : 10
	const options = useMemo(() => {
		if (
			!!currentQuestion?.conditional &&
			!!questionsData?.responses?.[currentQuestion?.conditional?.depends_on]
		) {
			const dependsOn = questionsData?.questions?.find(
				(item) => item.key === currentQuestion.conditional?.depends_on
			)
			const selectedOption = dependsOn?.options?.find(
				(item) =>
					item.key ===
					questionsData?.responses?.[
						currentQuestion?.conditional?.depends_on || ''
					]
			)

			if (selectedOption?.dependents?.[currentQuestion.key]) {
				return selectedOption?.dependents?.[currentQuestion.key]
			}
		}
		return currentQuestion?.options || []
	}, [currentQuestion, questionsData])

	useEffect(() => {
		if (!options || options.length > 0 || !currentQuestion) {
			return
		}
		void handleOptionsGenerate({
			question: currentQuestion,
		})
	}, [currentQuestion, options, handleOptionsGenerate])

	useEffect(() => {
		if (!fetchedSurvey) {
			return
		}
		handleInitialSurveyFetch(fetchedSurvey)
	}, [handleInitialSurveyFetch, fetchedSurvey])

	if (isSurveyPending) {
		return <OutlinerLoading />
	}

	if (!questionsData) {
		return null
	}

	return (
		<div className="flex flex-1 flex-col">
			<Progress
				value={(100 * (currentIdx + 1)) / (limit + 1)}
				className="h-1 rounded-none"
			/>
			<div className="flex items-center gap-2 px-4 pt-4">
				<div className="text-fm-tertiary text-sm">
					Question {currentIdx + 1} of {limit}
				</div>
				<If condition={updateOutlinerQuestionnaireSurveyPending}>
					<CircularLoader className="size-3" />
				</If>
			</div>

			<div className="flex flex-col px-4">
				<h2 className="text-xl font-bold">{currentQuestion?.question_text}</h2>
				<If condition={isOptionGenerationPending}>
					<div className="flex h-full flex-col justify-center py-24">
						<DotLoader />
					</div>
				</If>
				<If condition={!isOptionGenerationPending}>
					<div className="grid grid-cols-2 gap-4 py-4">
						{options
							.filter((item) => item.key !== 'custom')
							.map((option, idx, arr) => (
								<Button
									variant="outline"
									key={option.key}
									onClick={() => {
										void handleAnswerSelect(option.key, currentIdx)
									}}
									disabled={disabled}
									isDisabled={disabled}
									innerClassName={cn('rounded-none transition-colors h-20', {
										'hover:text-background hover:bg-foreground': !disabled,
									})}
									className={cn({
										'col-span-2':
											idx === arr.length - 1 && arr.length % 2 === 1,
									})}
								>
									{option.text}
								</Button>
							))}
						<div
							className={cn(
								'col-span-2 flex items-center gap-0 transition-[gap]',
								{
									'gap-2': isCustomAnswerSubmittable,
								}
							)}
						>
							<Input
								placeholder="Custom answer..."
								className="w-full rounded-none"
								decoration="filled"
								classes={{
									input: 'rounded-none h-11',
									wrapper: 'mt-0',
								}}
								disabled={disabled}
								value={customAnswer}
								onChange={(e) => {
									setCustomAnswer(e.target.value)
								}}
								onKeyDown={(e) => {
									if (
										e.key.toLowerCase() === 'enter' &&
										isCustomAnswerSubmittable
									) {
										void handleAnswerSelect(customAnswer, currentIdx, true)
									}
								}}
							/>
							<IconButton
								label="Submit Answer"
								tooltip="Submit Answer"
								className={cn(
									'transition-[width,color,background-color]',
									isCustomAnswerSubmittable ? 'shrink-0' : 'w-0 shrink',
									{
										'hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background':
											!disabled,
									}
								)}
								disabled={!isCustomAnswerSubmittable || disabled}
								icon={<ArrowRightIcon className="size-4" />}
								onClick={() => {
									void handleAnswerSelect(customAnswer, currentIdx, true)
								}}
							/>
						</div>
					</div>
				</If>
			</div>
		</div>
	)
}
