import React, { useMemo } from 'react'
import { languageToTitle } from '@/constants/episodes-constants'
import LSTableEditor from '@/page-builders/episodes/dialogs/ls-editor'
import { ArrowRight, CheckCircle } from 'lucide-react'

import LanguageSelector from '@/components/plate-ui/language-selector'
import { Case, SwitchCase } from '@/components/switch-case'
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

export default function AdaptationDialog() {
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
	} = useAdaptation()

	const selectedEpNo = useMemo(
		() => [
			selectedRowData?.[0]?.seq_number,
			selectedRowData?.[selectedRowData.length - 1]?.seq_number,
		],
		[selectedRowData]
	)

	const project = useMemo(
		() => selectedRowData?.[0]?.project,
		[selectedRowData]
	)

	if (!open && step > 1) {
		return (
			<Button
				tooltip="Adaptation working..."
				onClick={() => setOpen(true)}
				size="icon"
				className="fixed bottom-5 left-5 rounded-full"
			>
				<Spinner size={24} className="text-background" />
			</Button>
		)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-(--breakpoint-lg)">
				<SwitchCase value={step}>
					<DialogHeader>
						<DialogTitle>
							Adapt: Episodes {selectedEpNo.join('-')} of Project {project}
						</DialogTitle>
						<Case value={1}>
							<DialogDescription>
								Please select the language you want to adapt the episodes to.
							</DialogDescription>
						</Case>
						<Case value={2}>
							<DialogDescription>Please wait for processing.</DialogDescription>
						</Case>
						<Case value={3}>
							<DialogDescription>
								Please check/edit the LS sheet!
							</DialogDescription>
						</Case>
					</DialogHeader>
					<Case value={1}>
						<div className="flex w-full items-center gap-4">
							<h4>{languageToTitle[currentLanguage]}</h4>
							<ArrowRight size={24} />
							<LanguageSelector
								value={selectedAdaptingLanguage}
								onValueChange={setSelectedAdaptingLanguage}
								selectableLanguages={selectableLanguages}
							/>
						</div>
						<DialogFooter className="flex justify-end">
							<Button
								onClick={() =>
									mutate({
										language: selectedAdaptingLanguage,
										selectedRowData,
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
								sendLS({
									inputls,
									language: selectedAdaptingLanguage,
									selectedRowData,
								})
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
