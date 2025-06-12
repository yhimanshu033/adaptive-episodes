import React, { useState } from 'react'
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
	const [activeTab, setActiveTab] = useState(categories[0]?.id || '')
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
	} = useStoryExplorer({ start, end })

	return (
		<div className="h-full px-5 pt-4">
			<div className="flex w-full justify-between gap-3">
				{categories.map(({ mode, id }, idx) => (
					<Button
						key={idx}
						onClick={() => setActiveTab(id)}
						variant="outline"
						innerClassName={cn('h-8 uppercase', {
							'bg-fm-surface-contrast text-fm-contrast': activeTab === id,
						})}
					>
						{mode}
					</Button>
				))}
			</div>

			<div className="my-5 h-full">
				{categories.map(({ id, action }, idx) =>
					activeTab === id ? (
						<div key={idx} className="h-full">
							<IfElse condition={!!currentAction}>
								<If>
									<Content
										header={
											categoryNames[
												currentAction as keyof typeof categoryNames
											] ?? currentAction
										}
										explorerData={content}
										isLoading={isMetadataLoading}
										enableNote={isTaskEnded}
										start={start}
										end={end}
									/>
								</If>
								<Else>
									<div className="flex h-full flex-col gap-5">
										<If condition={isGermanUser}>
											<div className="flex items-center gap-2">
												<Search
													placeholder="Focus (optional)"
													initialValue={inputFocus ?? ''}
													onSearch={setInputFocus}
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
														className="flex justify-between"
														onClick={() => void handleRequest(actionId)}
													>
														{categoryNames[actionId]}
														<ChevronRightIcon className="text-fm-icon-inactive size-5" />
													</div>
													<Divider variant="secondary" />
												</div>
											))}
										</div>
										<div className="flex h-full items-end justify-center pb-5">
											<div onClick={() => setSidebar(ESidebar.NOTES, true)}>
												<Image
													src={VIEW_SAVED_NOTES_URL}
													width={300}
													height={44}
													alt="Notes Banner"
													priority
												/>
											</div>
										</div>
									</div>
								</Else>
							</IfElse>
						</div>
					) : null
				)}
			</div>
		</div>
	)
}

export default Explorer
