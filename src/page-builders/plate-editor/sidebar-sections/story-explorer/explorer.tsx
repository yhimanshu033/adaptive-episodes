import React from 'react'
import {
	categories,
	categoryNames,
	currentlyDisabled,
} from '@/constants/story-explorer-constants'
import useStoryExplorer from '@/hooks/use-story-explorer'
import Content from '@/page-builders/plate-editor/sidebar-sections/story-explorer/content'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils/helpers'

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
							<>
								<div className="relative mb-5 flex items-center gap-2">
									<label
										htmlFor="focus-input"
										className="w-fit text-sm font-medium text-muted-foreground"
									>
										Fokus (Optional) :
									</label>

									<Input
										id="focus-input"
										type="text"
										placeholder="Enter focus keyword"
										className="w-48"
										value={promptInput}
										onChange={(e) => setPromptInput(e.target.value)}
									/>
								</div>
								<div className="relative flex flex-col items-center gap-3">
									{action.map((id, idx) => (
										<Button
											key={idx}
											variant="outline"
											className={cn('w-48', {
												hidden: id === currentlyDisabled,
											})}
											onClick={() => void handleRequest(id)}
										>
											{categoryNames[id]}
										</Button>
									))}
								</div>
							</>
						)}
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}

export default Explorer
