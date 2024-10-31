/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { categories, defaultMode } from '@/constants/story-explorer-constants'
import usePlotOutlineHook from '@/hooks/mutation/use-plotoutline-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { getMetadata } from '@/server-action/episode-action'
import { Send } from 'lucide-react'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { PlotExplorerApiResponse } from '@/types/ai-types'

import Content from './content'

export interface RequestState {
	action: string
	mode: 'plot' | 'character' | 'world'
	name: string
}

const Explorer = ({ start, end }: { end: string; start: string }) => {
	const { id, episodeId } = useParams()
	const [content, setContent] = useState<PlotExplorerApiResponse['data']>([])
	const [promptInput, setPromptInput] = useState<string>('')
	const [isLoading, setLoading] = useState<boolean>(false)
	const [request, setRequest] = useState<RequestState>({
		mode: defaultMode,
		action: '',
		name: '',
	})
	const {
		plotlineMutation: { mutateAsync, reset },
	} = usePlotOutlineHook()
	const { data: currentEpisodeContent } = useEpisodeContent()

	const handleTabChange = (mode: RequestState['mode']) => {
		if (request.mode === mode) return
		reset()
		setRequest({ mode, action: '', name: '' })
		setLoading(false)
	}

	const handleRequest = async (
		action: string,
		name: string,
		instruction: string = ''
	) => {
		setLoading(true)
		setRequest({ ...request, action, name })
		const res = await getMetadata(id as string, episodeId as string, start, end)

		if (action === 'summary') {
			setContent(
				res.metadata.map((data, index) => ({
					title: `Episode ${index + 1}`,
					content: data.loglines,
				}))
			)
		} else {
			const result = await mutateAsync({
				action,
				ep_from: parseInt(start),
				ep_to: parseInt(end),
				mode: request.mode,
				ep_number: episodeId as string,
				beatsheet_array: res.metadata.map((data) => data.beatsheets),
				logline_array: res.metadata.map((data) => data.loglines),
				context: res.context,
				current_ep: currentEpisodeContent?.de || ' ',
				instruction,
			})
			if (result) setContent(result)
		}
		setLoading(false)
	}

	useEffect(() => {
		if (request.action && request.name && start && end) {
			void handleRequest(request.action, request.name)
		}
	}, [start, end])

	return (
		<div>
			<Tabs defaultValue={defaultMode}>
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
						{isLoading ? (
							<div className="mt-5 flex w-full justify-center">
								<Loader />
							</div>
						) : request.action && content.length ? (
							<Content
								header={request.name}
								explorerData={content}
								setRequest={setRequest}
							/>
						) : (
							<div className="flex flex-col items-center space-y-3">
								{action.map(({ name, id }, idx) => (
									<Button
										key={idx}
										variant="outline"
										className="w-48"
										onClick={() => handleRequest(id, name)}
									>
										{name}
									</Button>
								))}
								<div className="mt-8 flex items-center justify-center">
									<div className="relative w-64">
										<Input
											type="text"
											placeholder="Custom Prompt..."
											className="w-full"
											value={promptInput}
											onChange={(e) => setPromptInput(e.target.value)}
										/>
										<Button
											size="icon"
											variant="ghost"
											className="absolute right-1 top-1/2 -translate-y-1/2"
										>
											<Send
												className="size-4"
												onClick={() =>
													handleRequest('custom', promptInput, promptInput)
												}
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
