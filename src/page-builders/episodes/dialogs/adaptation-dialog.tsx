import React, { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { languageToTitle } from '@/constants/episodes-constants'
import ArrowRightIcon from '@/icons/arrow-right-icon'
import { TickCircleIcon } from '@/icons/tick-circle-icon'
import LSTableEditor from '@/page-builders/episodes/dialogs/ls-editor'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import { If } from '@/components/aural-ui/if-else'
import Label from '@/components/aural-ui/label'
import { Stepper } from '@/components/aural-ui/stepper'
import { Case, SwitchCase } from '@/components/aural-ui/switch-case'
import { Typography } from '@/components/aural-ui/typography'
import LanguageSelector, {
	LLMModelSelector,
} from '@/components/plate-ui/language-selector'
import useAdaptation from '@/providers/adaptation-provider'
import { cn, getSourceLanguage } from '@/lib/utils/helpers'

import { ELanguage } from '@/types/common'

import AdaptationStatus from '../info/adaptation-status'

type AdaptationDialogProps = {
	openDialog?: boolean
	setOpenDialog?: (open: boolean) => void
}

export default function AdaptationDialog({
	openDialog,
	setOpenDialog,
}: AdaptationDialogProps) {
	const {
		currentLanguage,
		mutate,
		selectableLanguages,
		open,
		selectedAdaptingLanguage,
		selectedRowData,
		setOpen,
		sendLS,
		setSelectedAdaptingLanguage,
		step,
		tableData,
		setTableData,
		storyData,
		isEpisodeAdaptation,
		setEpisodeAdaptation,
		llmModel,
		setLLMModel,
		setOpenExitDialog,
	} = useAdaptation()

	if (
		(openDialog !== undefined && setOpenDialog === undefined) ||
		(openDialog === undefined && setOpenDialog !== undefined)
	) {
		console.error(
			'AdaptationDialog: Both openDialog and setOpenDialog must be provided together.'
		)
	}

	const useCustomDialog =
		openDialog !== undefined && setOpenDialog !== undefined
	const adaptOpen = useCustomDialog ? openDialog : open
	const setAdaptDialogOpen = useCustomDialog ? setOpenDialog : setOpen

	const { id } = useParams()

	const selectedEpNo = useMemo(
		() => [
			selectedRowData?.[0]?.seq_number,
			selectedRowData?.[selectedRowData.length - 1]?.seq_number,
		],
		[selectedRowData]
	)

	const projectId = useMemo(
		() => selectedRowData?.[0]?.project,
		[selectedRowData]
	)

	const titleText = useMemo(() => {
		if (selectedEpNo && projectId) {
			return `Adapt: ${selectedRowData.length} Episodes of Project ${storyData?.project_title}`
		}
		return `Adapt all episodes of project ${storyData?.project_title}`
	}, [
		projectId,
		selectedEpNo,
		selectedRowData.length,
		storyData?.project_title,
	])

	const stepLabels = [
		'Select language',
		'Adapt',
		'Edit details',
		'Final adaptation',
	]

	const primaryBtnText = useMemo(() => {
		if (step === 1) {
			return 'Start adaptation'
		}
		if (step === 2) {
			return 'Continue in background'
		}
		if (step === 3) {
			return 'Save & continue'
		}

		return 'Close'
	}, [step])

	const onPrimaryBtnClick = () => {
		if (step === 1) {
			mutate({
				language: selectedAdaptingLanguage,
				selectedRowData,
				storyData,
				currentLanguage,
				llmModel,
			})
			return
		}

		setAdaptDialogOpen(false)
	}

	const handleClose = () => {
		setOpenExitDialog(true)
	}

	if (!adaptOpen && step > 1) {
		return (
			<AdaptationStatus
				step={step}
				onClick={() => {
					setAdaptDialogOpen(true)
				}}
			/>
		)
	}

	return (
		<Dialog open={adaptOpen} onOpenChange={setAdaptDialogOpen}>
			<DialogContent
				variant="neutral"
				glass="high"
				classes={{ content: 'w-full' }}
				className="h-[90vh] w-[90vw] gap-0 p-0 max-2xl:max-w-[60vw]"
				noise="none"
				showCloseButton={false}
			>
				<div className="ml-8 flex min-h-28 items-center justify-center overflow-x-auto px-6">
					<Stepper
						steps={stepLabels.length}
						activeStep={step === -1 ? 3 : step - 1}
						variant="primary"
						className="w-full"
						stepLabels={stepLabels}
					/>
				</div>
				<div className="px-6">
					<Divider variant="dashed" />
				</div>
				<div
					className={cn('h-full overflow-y-auto pt-5', {
						'mb-4 py-10': step !== 3,
					})}
				>
					<DialogHeader>
						<DialogTitle className="sr-only">Ai Adaptation Dialog</DialogTitle>
						<DialogDescription className="sr-only">
							{titleText}
						</DialogDescription>
					</DialogHeader>
					<SwitchCase value={step}>
						<Case value={-1}>
							<div className="flex h-full flex-col items-center justify-center gap-5 px-6">
								<CircularLoader className="size-12" />
								<div className="animate-gradient-slide bg-clip-text text-transparent">
									Episodes{' '}
									{(storyData?.adapting_seq_nos || []).slice(0, 5).join(',')}...
									are currently getting adapted.
								</div>
							</div>
						</Case>
						<Case value={1}>
							<div className="flex h-full flex-col gap-4 px-6">
								<div className="flex w-full items-center gap-4">
									<div className="flex flex-1 flex-col justify-center gap-3">
										<Label htmlFor="curr_language">Current language</Label>
										<div
											id="curr_language"
											className="border-fm-divider-secondary text-fm-md flex min-h-12 items-center rounded-xs border pl-4"
										>
											{languageToTitle[currentLanguage]}
										</div>
									</div>
									<ArrowRightIcon className="mt-5 size-5" />
									<div className="flex flex-1 flex-col justify-center gap-3">
										<Label htmlFor="adapt_language">Adaptation language</Label>
										<LanguageSelector
											placeholder="Select adaptation language "
											value={selectedAdaptingLanguage}
											onValueChange={setSelectedAdaptingLanguage}
											selectableLanguages={selectableLanguages}
											showSeparator
											classes={{
												trigger: {
													root: 'h-12 border-fm-divider-secondary',
												},
											}}
										/>
									</div>
								</div>
								<div className="flex flex-col justify-center gap-3">
									<Label htmlFor="select_model">Adaptation Mode </Label>
									<div className="mr-13">
										<LLMModelSelector
											value={llmModel}
											onValueChange={setLLMModel}
											className="w-1/2"
											showSeparator
										/>
									</div>
								</div>
							</div>
						</Case>
						<Case value={2}>
							<div className="flex h-full flex-col items-center justify-center gap-5 px-6">
								<CircularLoader className="size-12" />
								<p className="animate-gradient-slide bg-clip-text text-transparent">
									Adaptation in progress...
								</p>
							</div>
						</Case>

						<Case value={3}>
							<LSTableEditor
								tableData={tableData}
								setTableData={setTableData}
								handleClose={handleClose}
								onSubmit={(inputls) =>
									sendLS(
										{
											inputls,
											projectId: Number(id),
											sourceLang: getSourceLanguage(currentLanguage),
											language:
												(isEpisodeAdaptation
													? selectedAdaptingLanguage
													: storyData?.parent_language) || ELanguage.GERMAN,
											selectedRowData,
											llmModel,
										},
										{ onSuccess: () => setEpisodeAdaptation(false) }
									)
								}
							/>
						</Case>
						<Case value={4}>
							<div className="flex h-full flex-col items-center justify-center gap-4 px-6">
								<TickCircleIcon className="size-10" />
								<Typography>
									Selected episode&apos;s adaptation is registered successfully
								</Typography>
							</div>
						</Case>
					</SwitchCase>
				</div>
				<If condition={step !== 3}>
					<div className="px-6">
						<Divider variant="dashed" />
					</div>
					<DialogFooter
						className={cn('mt-5 flex-row !justify-between px-6 pb-6', {
							'!justify-end': step === -1,
						})}
					>
						<If condition={step !== -1}>
							<Button
								variant="text"
								onClick={handleClose}
								innerClassName="!px-0"
							>
								Exit & Discard
							</Button>
						</If>
						<Button onClick={onPrimaryBtnClick} innerClassName="h-11">
							{primaryBtnText}
						</Button>
					</DialogFooter>
				</If>
			</DialogContent>
		</Dialog>
	)
}
