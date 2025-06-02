import React from 'react'
import { ImportStoryType } from '@/constants/episodes-constants'

import '@/hooks/form-resolvers/story-import-resolver'

import { CI_DIALOG_TITLE } from '@/constants/story-constants'
import { BubbleSparkleIcon } from '@/icons/bubble-sparkle-icon'
import { ImportFolderIcon } from '@/icons/import-folder-icon'
import useStoryStore from '@/store/story-store'

import { Button } from '@/components/aural-ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/aural-ui/radio'
import ForEach from '@/components/ui/for-each'

import { IconComponent } from '@/types/common'

const storyTypesInfoRecord: Record<
	ImportStoryType,
	{ desc: string; icon: IconComponent; title: string }
> = {
	[ImportStoryType.EMPTY]: {
		title: 'Create new series',
		desc: 'Start writing from the beginning',
		icon: (props) => <BubbleSparkleIcon {...props} />,
	},
	[ImportStoryType.IMPORT]: {
		title: 'Import content for series',
		desc: 'Already have a story? Just upload.',
		icon: (props) => <ImportFolderIcon {...props} />,
	},
}

const storyTypesInfo = Object.keys(storyTypesInfoRecord).map((k) => ({
	...storyTypesInfoRecord[k as ImportStoryType],
	type: k as ImportStoryType,
}))

interface IChooseStoryPropsType {
	buttonText: React.JSX.Element | 'Create' | 'Continue'
	nextStep: () => true | undefined
	storyType: ImportStoryType
	updateStoryType: (type: ImportStoryType) => void
}
const ChooseStoryTypes = ({
	storyType,
	updateStoryType,
	buttonText,
	nextStep,
}: IChooseStoryPropsType) => {
	const { setTitle } = useStoryStore()

	const handleButtonClick = () => {
		if (storyType === ImportStoryType.EMPTY) {
			setTitle(CI_DIALOG_TITLE.CREATE)
		}
		nextStep()
	}
	return (
		<div className="flex h-full flex-col overflow-y-auto">
			<div className="text-fm-tertiary pb-5">
				{
					'Tell the world your story with creative tools, advanced AI features, insights, and more'
				}
			</div>
			<RadioGroup
				value={storyType}
				onValueChange={(v) => updateStoryType(v as ImportStoryType)}
				className="gap-5"
			>
				<ForEach data={storyTypesInfo}>
					{(item, idx) => (
						<div
							key={idx}
							className="bg-fm-surface-frosted/20 border-fm-divider-primary/50 flex min-h-24 items-center justify-between rounded border pl-2"
						>
							<div className="flex items-center gap-2">
								<RadioGroupItem value={item.type} id={item.type} />
								<label htmlFor={item.type} className="flex flex-col">
									<span className="text">{item.title}</span>
									<span className="text-fm-tertiary text-sm">{item.desc}</span>
								</label>
							</div>
							<div className="flex h-full items-end">
								<item.icon className="text-fm-tertiary/20 size-15 stroke-1" />
							</div>
						</div>
					)}
				</ForEach>
			</RadioGroup>
			<div className="flex grow items-end">
				<Button className="mx-auto w-full" onClick={handleButtonClick}>
					{buttonText}
				</Button>
			</div>
		</div>
	)
}

export default ChooseStoryTypes
