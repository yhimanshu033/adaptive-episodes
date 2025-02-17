import React from 'react'
import {
	categories,
	categoryNames,
	currentlyDisabled,
} from '@/constants/story-explorer-constants'
import useStoryExplorer from '@/hooks/use-story-explorer'
import { CheckboxDropdown } from '@/page-builders/plate-editor/sidebar-sections/story-explorer/checkbox-dropdown'
import Content from '@/page-builders/plate-editor/sidebar-sections/story-explorer/content'
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Explorer = ({ start, end }: { end: number; start: number }) => {
	const {
		activeExplorerMode,
		handleTabChange,
		currentAction,
		content,
		promptInput,
		setPromptInput,
		handleRequest,
		isMetadataLoading,
		isTaskEnded,
	} = useStoryExplorer({ start, end })

	return (
		<div>
			<Tabs defaultValue={activeExplorerMode}>
				<TabsList className="grid w-full grid-cols-3 bg-background">
					{categories.map(({ mode, id }, idx) => (
						<TabsTrigger
							className="data-[state=active]:bg-primary"
							key={idx}
							value={id}
							onClick={() => handleTabChange(id)}
						>
							{mode}
						</TabsTrigger>
					))}
				</TabsList>
				{categories.map(({ id, action }, idx) => (
					<TabsContent value={id} key={idx} className="mt-6">
						{currentAction ? (
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
						) : (
							<div className="relative flex flex-col items-center gap-3">
								{action.map((id, idx) => (
									<Button
										key={idx}
										variant="outline"
										className="w-48"
										onClick={() => void handleRequest(id)}
										disabled={id === currentlyDisabled}
									>
										{categoryNames[id]}
									</Button>
								))}
								<CheckboxDropdown />
								<div className="flex items-center justify-center">
									<div className="relative w-64">
										<Input
											disabled
											type="text"
											placeholder="Custom Prompt..."
											className="w-full"
											value={promptInput}
											onChange={(e) => setPromptInput(e.target.value)}
										/>
										<Button
											disabled
											size="icon"
											variant="ghost"
											className="absolute right-1 top-1/2 -translate-y-1/2"
										>
											<Send
												className="size-4"
												onClick={() => void handleRequest(promptInput)}
											/>
										</Button>
									</div>
								</div>
							</div>
						)}
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}

export default Explorer
