import React, { useMemo, useState } from 'react'
import { languages, languageToTitle } from '@/constants/episodes-constants'
import useAdaptationMutation from '@/hooks/mutation/use-adaptation-mutation'
import LSTableEditor from '@/page-builders/episodes/ls-editor'
import { ArrowRight, CheckCircle, Languages } from 'lucide-react'

import LanguageSelector from '@/components/plate-ui/language-selector'
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
	DialogTrigger,
} from '@/components/ui/dialog'
import Spinner from '@/components/ui/spinner'

import { ELanguage } from '@/types/common'
import { TEpisode } from '@/types/episode-type'

interface TAdaptationDialogProps {
	disabled?: boolean
	selectedRowData: TEpisode[]
}
export default function AdaptationDialog({
	disabled,
	selectedRowData,
}: TAdaptationDialogProps) {
	const [selectedAdaptingLanguage, setSelectedAdaptingLanguage] =
		useState<ELanguage>(ELanguage.MEXICAN_SPANISH)
	const currentLanguage = useMemo(
		() => selectedRowData[0]?.language || ELanguage.ENGLISH,
		[selectedRowData]
	)

	const selectableLanguages = useMemo(
		() => languages.filter((lang) => lang !== currentLanguage),
		[currentLanguage]
	)

	const {
		createLSMutation: { mutate, isPending, data, reset },
		sendLSMutation: {
			mutate: sendLS,
			data: sendLSData,
			isPending: sendLSPending,
		},
	} = useAdaptationMutation()

	const step = useMemo(() => {
		return 3
		if (sendLSData) {
			return 4
		}
		if (sendLSPending) {
			return 2
		}
		if (data?.ls_mapping) {
			return 3
		}
		if (isPending) {
			return 2
		}
		return 1
	}, [data, isPending, sendLSData, sendLSPending])

	return (
		<Dialog onOpenChange={() => reset()}>
			<DialogTrigger asChild>
				<Button size="icon" disabled={disabled} title="Adapt episodes">
					<Languages size={16} />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-screen-lg">
				<SwitchCase value={step}>
					<DialogHeader>
						<DialogTitle>Adapt the selected Episodes</DialogTitle>
						<Case value={1}>
							<DialogDescription>
								Please select the language you want to adapt the episodes to.
							</DialogDescription>
						</Case>
						<Case value={2}>
							<DialogDescription>
								Please wait for task registration.
							</DialogDescription>
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
							inputData={data || { ls_mapping: {} }}
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
