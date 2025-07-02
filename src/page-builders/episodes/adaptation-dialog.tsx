import React, { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { SOURCE_TO_TARGET_LANGUAGE_MAP } from '@/constants/ai-constants'
import { languageToTitle } from '@/constants/episodes-constants'
import { INDEXED_DB_KEYS } from '@/constants/global-constants'
import LSTableEditor from '@/page-builders/episodes/ls-editor'
import { ArrowRight, CheckCircle, Info } from 'lucide-react'

import LanguageSelector, {
	LLMModelSelector,
} from '@/components/plate-ui/language-selector'
import SwitchCase, { Case } from '@/components/switch-case'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import Spinner from '@/components/ui/spinner'
import useAdaptation from '@/providers/adaptation-provider'
import { getSourceLanguage } from '@/lib/utils/helpers'
import { setRecentStore } from '@/lib/utils/indexed-db'

import { ELanguage } from '@/types/common'

type AdaptationDialogProps = {
	// Both must be provided together or neither should be provided
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
	} = useAdaptation()

	// Validate props: Either both custom dialog props must be provided or neither
	if (
		(openDialog !== undefined && setOpenDialog === undefined) ||
		(openDialog === undefined && setOpenDialog !== undefined)
	) {
		console.error(
			'AdaptationDialog: Both openDialog and setOpenDialog must be provided together. ' +
				'Falling back to useAdaptation hook values.'
		)
	}

	// Use props if both are provided, otherwise use hook values
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

	if (!adaptOpen && step > 1) {
		return (
			<Button
				tooltip="Adaptation working..."
				onClick={() => setAdaptDialogOpen(true)}
				size="icon"
				className="fixed bottom-5 left-5 rounded-full"
			>
				<Spinner size={24} className="text-background" />
			</Button>
		)
	}

	return (
		<Dialog open={adaptOpen} onOpenChange={setAdaptDialogOpen}>
			<DialogContent className="max-w-[80vw]">
				<SwitchCase value={step}>
					<DialogHeader>
						<DialogTitle>{titleText}</DialogTitle>
						<Case value={-1}>
							<DialogDescription>
								Episodes{' '}
								{(storyData?.adapting_seq_nos || []).slice(0, 5).join(',')}...
								are currently getting adapted.
							</DialogDescription>
						</Case>
						<Case value={1}>
							<DialogDescription>
								Please select the language you want to adapt the episodes to.
							</DialogDescription>
						</Case>
						<Case value={2}>
							<DialogDescription>
								{
									'Please wait for processing. Do not refresh the page; however, you can close this dialog.'
								}
							</DialogDescription>
						</Case>
						<Case value={3}>
							<DialogDescription>
								Please check/edit the LS sheet!
							</DialogDescription>
						</Case>
					</DialogHeader>

					<Case value={-1}>
						<Info className="mx-auto size-48 p-6" />
					</Case>
					<Case value={1}>
						<div className="flex w-full items-center gap-4">
							<h4>{languageToTitle[currentLanguage]}</h4>
							<ArrowRight size={24} />
							<LanguageSelector
								value={selectedAdaptingLanguage}
								onValueChange={setSelectedAdaptingLanguage}
								selectableLanguages={
									SOURCE_TO_TARGET_LANGUAGE_MAP[selectedAdaptingLanguage]
								}
							/>
						</div>
						<DialogFooter>
							<LLMModelSelector
								value={llmModel}
								onValueChange={(model) => {
									setLLMModel(model)
									void setRecentStore(INDEXED_DB_KEYS.LLM_MODEL, model)
								}}
								className="w-fit"
							/>
							<Button
								onClick={() =>
									mutate({
										language: selectedAdaptingLanguage,
										selectedRowData,
										storyData,
										currentLanguage,
										llmModel,
									})
								}
							>
								Start Adaptation
							</Button>
						</DialogFooter>
					</Case>
					<Case value={2}>
						<Spinner size={48} className="mx-auto my-10" />
					</Case>
					<Case value={3}>
						<LSTableEditor
							tableData={tableData}
							setTableData={setTableData}
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
						<CheckCircle size={48} className="mx-auto my-4 text-green-500" />
						<DialogFooter className="flex justify-end">
							<DialogClose asChild>
								<Button>Close</Button>
							</DialogClose>
						</DialogFooter>
					</Case>
				</SwitchCase>
			</DialogContent>
		</Dialog>
	)
}
