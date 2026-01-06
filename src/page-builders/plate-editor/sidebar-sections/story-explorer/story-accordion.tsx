import React, { useMemo } from 'react'
import useNotes from '@/hooks/use-notes'
import { AngleDownIcon } from '@/icons/angle-down-icon'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { CopyIcon } from '@/icons/copy-icon'
import NotepadIcon from '@/icons/notepad-icon'
import useAIStore from '@/store/ai-store'
import { CircleCheck } from 'lucide-react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTitle,
	CollapsibleTrigger,
} from '@/components/aural-ui/collapsible'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import { cn } from '@/lib/aural-ui/utils'
import { formatExplorerData, preProcessData } from '@/lib/utils/explorer'
import { toPascalCase } from '@/lib/utils/helpers'

import { ExplorerType, PlotExplorerApiResponse } from '@/types/ai-types'
import { TNote } from '@/types/plate-types'

export function ContentActions({
	title,
	content,
	htmlText,
	enableNote = false,
	episodeRange,
	episodeNo,
}: {
	content: Partial<ExplorerType> | string
	enableNote?: boolean
	episodeNo?: number
	episodeRange?: string
	htmlText: string | undefined
	title: string
}) {
	const { handleAddNote, isSuccess, isPending } = useNotes()
	const { store } = useAIStore()
	const inputFocus = store((state) => state.inputFocus)
	const activeExplorerMode = store((state) => state.activeExplorerMode)
	const activeExplorerActions = store((state) => state.activeExplorerActions)

	const addToNote = () => {
		const note: TNote = {
			id: nanoid(),
			title: inputFocus ? `${inputFocus} - ${title}` : title,
			content: content || '',
			episodeNo: episodeNo,
			episodeRange: episodeRange,
			updateTime: new Date().toString(),
			modeAction: `${toPascalCase(activeExplorerMode)} - ${toPascalCase(
				activeExplorerActions[activeExplorerMode]
			)}`,
		}
		handleAddNote(note)
	}

	const handleCopy = () => {
		const formattedText = formatExplorerData(htmlText || '')
		void navigator.clipboard.writeText(formattedText)
		toast.success('Text copied successfully', {
			icon: <BubbleCheckIcon />,
		})
	}

	const { icon: savedIcon, text: savedText } = useMemo(() => {
		if (isPending) {
			return {
				icon: <CircularLoader />,
				text: 'Saving...',
			}
		}
		if (isSuccess) {
			return {
				icon: <CircleCheck className="size-4 stroke-2" />,
				text: 'Saved',
			}
		}
		return {
			icon: <NotepadIcon className="size-4 stroke-2" />,
			text: 'Save to Notes',
		}
	}, [isPending, isSuccess])
	return (
		<div className="mt-6 flex w-full justify-end gap-4">
			<Button
				variant="text"
				onClick={handleCopy}
				className="opacity-80 transition-opacity delay-100 hover:opacity-100"
				disabled={!enableNote}
				isDisabled={!enableNote}
				leftIcon={<CopyIcon className="size-4 stroke-2" />}
				size="sm"
				innerClassName={cn('!p-0', {
					'bg-transparent border-transparent': !enableNote,
				})}
			>
				Copy
			</Button>
			<Button
				variant="text"
				onClick={addToNote}
				disabled={!enableNote}
				isDisabled={!enableNote}
				leftIcon={savedIcon}
				className="opacity-80 transition-opacity delay-100 hover:opacity-100"
				size="sm"
				innerClassName={cn('!p-0', {
					'bg-transparent border-transparent': !enableNote,
				})}
			>
				{savedText}
			</Button>
		</div>
	)
}

export function RenderContent({
	content,
	preContent,
	episodeNo,
	enableNote = false,
}: {
	content: string | ExplorerType[]
	enableNote?: boolean
	episodeNo: number
	preContent?: string
}) {
	const formattedHtml = (text: string) => text?.replace(/\n/g, '<br/>')

	function boldFirstLine(html: string) {
		const [firstLine, ...rest] = html.split('\n')
		const boldedFirst = `<strong>${firstLine}</strong>`
		return [boldedFirst, ...rest].join('<br/>')
	}

	const isEmptyString = (str: string | undefined): boolean =>
		typeof str === 'string' && str.trim() === ''

	if (
		(!content || isEmptyString(content as string)) &&
		(!preContent || isEmptyString(preContent))
	) {
		return (
			<Typography color="tertiary" align="left" variant="body-small">
				Content not found 😭
			</Typography>
		)
	}

	if (typeof content === 'string') {
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: formattedHtml(content),
				}}
			/>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<If condition={!!preContent}>
				<div
					dangerouslySetInnerHTML={{ __html: boldFirstLine(preContent || '') }}
				/>
			</If>

			<If condition={typeof content !== 'string'}>
				{content.map((item, index) => {
					const processedItems = preProcessData(item)
					return processedItems.map(
						(
							{ title, content: nestedContent, preContent: nestedPreContent },
							subIdx
						) => (
							<div
								key={`${title}-${index}-${subIdx}`}
								className="flex flex-col gap-2"
							>
								<If condition={!!title}>
									<h4 className="font-semibold">{title}</h4>
								</If>
								<IfElse condition={typeof nestedContent === 'string'}>
									<If>
										<div
											className="text-fm-md"
											dangerouslySetInnerHTML={{
												__html: formattedHtml(nestedContent as string),
											}}
										/>
									</If>
									<Else>
										<RenderContent
											content={nestedContent}
											preContent={nestedPreContent}
											episodeNo={episodeNo}
											enableNote={enableNote}
										/>
									</Else>
								</IfElse>
							</div>
						)
					)
				})}
			</If>
		</div>
	)
}

export function StoryAccordion({
	explorerData,
	className,
	enableNote = false,
	start,
	end,
}: {
	className?: string
	enableNote?: boolean
	end: number
	explorerData: PlotExplorerApiResponse['data'] | string
	start: number
}) {
	if (typeof explorerData === 'string') {
		return (
			<div className="group flex flex-col gap-4 px-6">
				<div
					dangerouslySetInnerHTML={{
						__html: explorerData.replace(/\n/g, '<br/>'),
					}}
				/>
				<ContentActions
					title={`Episode ${start}-${end}`}
					content={explorerData}
					episodeRange={`${start}-${end}`}
					htmlText={explorerData}
					enableNote={enableNote}
				/>
			</div>
		)
	}

	return (
		<div className={cn('flex flex-col gap-4 px-6 pb-10', className)}>
			{explorerData.map((data, index) => {
				const episodeNo = start + index
				const processedData = preProcessData(data)

				return processedData.map(({ title, content, preContent }, index) => (
					<Collapsible key={`${title}-${index}`}>
						<CollapsibleTrigger asChild>
							<button className="text-fm-icon-active data-[state=open]:[&>.toggle-icon]:text-fm-icon-active hover:[&>.toggle-icon]:text-fm-icon-active flex w-full flex-1 cursor-pointer items-center justify-between text-left outline-none [&>.toggle-icon]:transition-transform [&>.toggle-icon]:duration-50 data-[state=open]:[&>.toggle-icon]:-rotate-180">
								<CollapsibleTitle className="text-fm-md">
									{title}
								</CollapsibleTitle>
								<AngleDownIcon className="toggle-icon text-fm-icon-inactive size-3.5" />
							</button>
						</CollapsibleTrigger>
						<CollapsibleContent className="text-fm-md group !text-fm-tertiary pr-2">
							<RenderContent
								content={content}
								preContent={preContent}
								episodeNo={episodeNo}
								enableNote={enableNote}
							/>
							<ContentActions
								title={title}
								content={{
									preContent: preContent,
									content: content,
								}}
								episodeNo={episodeNo}
								htmlText={formatExplorerData(data)}
								enableNote={enableNote}
							/>
						</CollapsibleContent>
					</Collapsible>
				))
			})}
		</div>
	)
}
