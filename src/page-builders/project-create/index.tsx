'use client'

import React, { useState } from 'react'
import { SOURCE_TO_TARGET_LANGUAGE_MAP } from '@/constants/ai-constants'
import { ArrowRightUpIcon } from '@/icons/arrow-right-up-icon'
import useCreateScratchProject from '@/page-builders/project-create/hooks/use-create-scratch-project'

import { Button } from '@/components/aural-ui/button'
import DotLoader from '@/components/aural-ui/dot-loader'
import LanguageSelector from '@/components/plate-ui/language-selector'

import { ELanguage } from '@/types/common'

const selectableLanguages = Object.keys(
	SOURCE_TO_TARGET_LANGUAGE_MAP
) as ELanguage[]

export default function ProjectCreate() {
	const { mutate, isPending, data } = useCreateScratchProject()
	const [language, setSelectedLanguage] = useState(selectableLanguages[0])

	if (isPending || data) {
		return (
			<div className="flex h-full min-h-[70vh] items-center justify-center">
				<DotLoader />
			</div>
		)
	}

	return (
		<div className="container mx-auto flex flex-col gap-6 py-12">
			<h2 className="font-fm-brand animate-fade-in-up text-4xl font-semibold">
				{'What language are we creating content in?'}
			</h2>

			<div className="animate-fm-fadeIn flex flex-col items-end gap-6 [animation-delay:0.5s] md:flex-row">
				<LanguageSelector
					classes={{
						trigger: {
							root: 'p-6 *:text-xl h-auto',
						},
					}}
					selectableLanguages={selectableLanguages}
					onValueChange={setSelectedLanguage}
					value={language}
				/>
				<Button
					onClick={() => mutate({ language })}
					size="lg"
					className="animate-fm-fadeIn [animation-delay:1s]"
					rightIcon={<ArrowRightUpIcon className="size-6" />}
				>
					Proceed
				</Button>
			</div>
		</div>
	)
}
