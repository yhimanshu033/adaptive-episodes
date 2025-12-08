import React, { useEffect, useMemo } from 'react'
import { ImportStoryType } from '@/constants/episodes-constants'

import '@/hooks/form-resolvers/story-import-resolver'

import { useRouter } from 'next/navigation'
import { CI_DIALOG_TITLE } from '@/constants/story-constants'
import useUserAccess from '@/hooks/query/use-user-access'
import { BubbleSparkleIcon } from '@/icons/bubble-sparkle-icon'
import { ImportFolderIcon } from '@/icons/import-folder-icon'
import { MagicBookIcon } from '@/icons/magic-book-icon'
import useStoryStore from '@/store/story-store'

import { Button } from '@/components/aural-ui/button'
import Label from '@/components/aural-ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/aural-ui/radio'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Typography } from '@/components/aural-ui/typography'
import ForEach from '@/components/ui/for-each'

import { IconComponent } from '@/types/common'

const storyTypesInfoRecord: Partial<
	Record<ImportStoryType, { desc: string; icon: IconComponent; title: string }>
> = {
	[ImportStoryType.IMPORT]: {
		title: 'Import content for series',
		desc: 'Already have a story? Just upload.',
		icon: (props) => <ImportFolderIcon {...props} />,
	},
	[ImportStoryType.EMPTY]: {
		title: 'Start with blank page',
		desc: 'Start writing from the beginning',
		icon: (props) => <BubbleSparkleIcon {...props} />,
	},
}

const brainStormStoryItem: typeof storyTypesInfoRecord = {
	[ImportStoryType.BRAINSTORM]: {
		title: 'Brainstorm with Copilot',
		desc: 'Collaborate with AI to create the core outline.',
		icon: (props) => <MagicBookIcon {...props} />,
	},
}

const storyTypesInfo = Object.keys(storyTypesInfoRecord).map((k) => ({
	...storyTypesInfoRecord[k as ImportStoryType],
	type: k as ImportStoryType,
}))

const storyTypesInfoWithBrainstorm = Object.keys(brainStormStoryItem).map(
	(k) => ({
		...brainStormStoryItem[k as ImportStoryType],
		type: k as ImportStoryType,
	})
)

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
	const setTitle = useStoryStore((state) => state.setTitle)
	const setFormOpen = useStoryStore((state) => state.setFormOpen)
	const router = useRouter()
	const { data: accessData } = useUserAccess()

	const displayedStoryTypes = useMemo(() => {
		if (accessData?.survey_onboarding) {
			return [...storyTypesInfoWithBrainstorm, ...storyTypesInfo]
		}
		return storyTypesInfo
	}, [accessData])

	useEffect(() => {
		updateStoryType(displayedStoryTypes[0].type)
	}, [displayedStoryTypes, updateStoryType])

	const handleButtonClick = () => {
		if (storyType === ImportStoryType.BRAINSTORM) {
			router.push('/projects/create')
			setFormOpen(false)
			return
		}
		if (storyType === ImportStoryType.EMPTY) {
			setTitle(CI_DIALOG_TITLE.CREATE)
		}
		nextStep()
	}
	return (
		<div className="flex h-full flex-col">
			<ScrollArea className="h-full px-8">
				<div className="flex h-full flex-col">
					<Typography
						align="left"
						color="tertiary"
						variant="body-medium"
						weight="regular"
						className="pb-5"
					>
						{
							'Tell the world your story with creative tools, advanced AI features, insights, and more'
						}
					</Typography>
					<RadioGroup
						value={storyType}
						onValueChange={(v) => updateStoryType(v as ImportStoryType)}
						className="gap-5"
					>
						<ForEach data={displayedStoryTypes}>
							{(item, idx) => (
								<div
									key={idx}
									className="bg-fm-surface-frosted/20 border-fm-divider-primary/50 flex min-h-24 items-center justify-between rounded border pl-2"
								>
									<div className="flex items-center gap-2">
										<RadioGroupItem
											value={item.type}
											id={item.type}
											className="cursor-pointer"
										/>
										<Label
											htmlFor={item.type}
											className="font-fm-text! flex cursor-pointer flex-col items-start gap-1 normal-case"
										>
											<Typography
												align="left"
												color="primary"
												variant="body-small"
												weight="regular"
											>
												{item.title}
											</Typography>
											<Typography
												align="left"
												color="tertiary"
												variant="body-small"
												weight="regular"
											>
												{item.desc}
											</Typography>
										</Label>
									</div>
									<Label
										htmlFor={item.type}
										className="flex h-full cursor-pointer items-end normal-case"
									>
										{item.icon && (
											<item.icon className="text-fm-secondary/50 size-15 stroke-1" />
										)}
									</Label>
								</div>
							)}
						</ForEach>
					</RadioGroup>
				</div>
			</ScrollArea>
			<div className="mt-5 px-8">
				<Button className="mx-auto w-full" onClick={handleButtonClick}>
					{buttonText}
				</Button>
			</div>
		</div>
	)
}

export default ChooseStoryTypes
