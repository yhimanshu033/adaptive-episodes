import React from 'react'
import Image from 'next/image'
import { VIEW_SAVED_NOTES_URL } from '@/constants/editor-constants'
import {
	categories,
	categoryNames,
	currentlyDisabled,
} from '@/constants/story-explorer-constants'
import useIsGerman from '@/hooks/use-is-german'
import useStoryExplorer from '@/hooks/use-story-explorer'
import ChevronRightIcon from '@/icons/chevron-right-icon'
import Content from '@/page-builders/plate-editor/sidebar-sections/story-explorer/content'
import usePlateStore from '@/store/plate-store'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { Else, If, IfElse } from '@/components/aural-ui/if-else'
import Search from '@/components/aural-ui/search'
import { cn } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

import { ExplorerSettings } from './explorer-setting'

const Explorer = ({ start, end }: { end: number; start: number }) => {
	const isGermanUser = useIsGerman()
	const { setSidebar } = usePlateStore()

	const {
		currentAction,
		content,
		inputFocus,
		setInputFocus,
		handleRequest,
		isMetadataLoading,
		isTaskEnded,
		handleTabChange,
		activeExplorerMode,
	} = useStoryExplorer({ start, end })

	return (
		<div className="flex flex-1 flex-col px-5 pt-4">
			<div className="flex w-full justify-between gap-4">
				{categories.map(({ mode, id }, idx) => (
					<Button
						variant="outline"
						key={idx}
						size="sm"
						className="group flex-1"
						innerClassName={cn(
							'font-fm-brand border-fm-divider-secondary group-hover:border-fm-divider-contrast group-disabled:translate-y-0 group-disabled:hover:border-fm-divider-secondary uppercase tracking-widest',
							{
								'border-fm-divider-contrast bg-fm-surface-contrast [color:var(--color-fm-contrast)]':
									activeExplorerMode === id,
							}
						)}
						onClick={() => handleTabChange(id)}
					>
						{mode}
					</Button>
				))}
			</div>

			<div className="my-5 h-full">
				<IfElse condition={!!currentAction}>
					<If>
						<Content
							header={
								categoryNames[currentAction as keyof typeof categoryNames] ??
								currentAction
							}
							explorerData={content}
							isLoading={isMetadataLoading}
							enableNote={isTaskEnded}
							start={start}
							end={end}
						/>
					</If>
					<Else>
						{categories.map(({ id, action }, idx) =>
							activeExplorerMode === id ? (
								<div key={idx} className="flex h-full flex-col gap-5">
									<If condition={isGermanUser}>
										<div className="flex items-center gap-2">
											<Search
												placeholder="Focus (optional)"
												initialValue={inputFocus ?? ''}
												onSearch={setInputFocus}
												className="[&_svg]:size-3.5"
											/>
											<ExplorerSettings />
										</div>
									</If>
									<div className="flex flex-col gap-3">
										{action.map((actionId, actionIdx) => (
											<div
												key={actionIdx}
												className={cn('mt-2 space-y-2', {
													hidden: actionId === currentlyDisabled,
												})}
											>
												<div
													className="group flex cursor-pointer justify-between"
													onClick={() => void handleRequest(actionId)}
												>
													{categoryNames[actionId]}
													<ChevronRightIcon className="text-fm-icon-inactive group-hover:text-fm-icon-active size-5" />
												</div>
												<Divider variant="secondary" />
											</div>
										))}
									</div>
									<div className="flex h-full items-end justify-center">
										<div
											className="cursor-pointer"
											onClick={() => setSidebar(ESidebar.NOTES, true)}
										>
											<Image
												src={VIEW_SAVED_NOTES_URL}
												width={350}
												height={52}
												alt="Notes Banner"
												priority
											/>
										</div>
									</div>
								</div>
							) : null
						)}
					</Else>
				</IfElse>
			</div>
		</div>
	)
}

export default Explorer
