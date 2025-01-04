/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
	categories,
	CharacterAction,
	currentlyDisabled,
	defaultMode,
	ExplorerModeId,
	PlotAction,
	WorldAction,
} from '@/constants/story-explorer-constants'
import usePlotOutlineHook from '@/hooks/mutation/use-plotoutline-hook'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { getMetadata } from '@/server-action/metadata-action'
import { useEditorState } from '@udecode/plate-common/react'
import { parse } from 'best-effort-json-parser'
import { jsonrepair } from 'jsonrepair'
import { Send } from 'lucide-react'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useEpisodeId from '@/providers/episode-id-provider'
import {
	extractFromMetadata,
	extractScenesFromBeatsheet,
	getText,
} from '@/lib/utils'

import { PlotExplorerApiResponse } from '@/types/ai-types'

import Content from './content'

export interface RequestState {
	action: PlotAction | CharacterAction | WorldAction | ''
	mode: ExplorerModeId
	name: string
}

const Explorer = ({ start, end }: { end: number; start: number }) => {
	const { id } = useParams()
	const episodeId = useEpisodeId()
	const [content, setContent] = useState<
		PlotExplorerApiResponse['data'] | undefined
	>([])
	const [promptInput, setPromptInput] = useState<string>('')
	const [taskId, setTaskId] = useState<string>('')
	const [isLoading, setLoading] = useState<boolean>(false)
	const [request, setRequest] = useState<RequestState>({
		mode: defaultMode,
		action: '',
		name: '',
	})
	const { children } = useEditorState()
	const {
		plotlineMutation: { mutateAsync, reset },
	} = usePlotOutlineHook()

	const { responses, taskEnded } = useSocketStreaming()

	const handleTabChange = (mode: RequestState['mode']) => {
		if (request.mode === mode) return
		reset()
		setRequest({ mode, action: '', name: '' })
		setLoading(false)
	}

	const handleRequest = async (
		action: RequestState['action'],
		name: string,
		instruction: string = ''
	) => {
		setLoading(true)
		setRequest({ ...request, action, name })
		const { data: metadata } = await getMetadata(
			Number(id),
			Math.max(start - 1, 1),
			end
		)
		const metadataEntries = Object.values(metadata?.data || {})
		if (action === PlotAction.Summary) {
			setContent(
				metadataEntries.slice(start > 1 ? 1 : 0).map((data, index) => ({
					title: `${index + start}. ${data.chapter_title || ''}`,
					preContent: `Synopsis:\n${data.loglines.replace(/\d+:/, '')}`,
					content: [
						{
							title: 'Summary',
							content: data.summary,
						},
					],
				}))
			)
		} else if (action === PlotAction.Scenes) {
			setContent(
				metadataEntries.slice(start > 1 ? 1 : 0).map((data, index) => {
					return {
						title: `${index + start}. ${data.chapter_title || ''}`,
						content: extractScenesFromBeatsheet(data.beatsheet),
					}
				})
			)
		} else {
			const { beatsheets_array: beatsheet_array, ...extractedData } =
				extractFromMetadata(metadata, start - 1)
			const result = await mutateAsync({
				action,
				ep_from: start,
				ep_to: end,
				mode: request.mode,
				ep_number: String(episodeId),
				beatsheet_array,
				...extractedData,
				current_ep: getText(children) || ' ',
				instruction,
			})
			if (result) {
				setContent([])
				setTaskId(result)
			}
		}
		setLoading(false)
	}

	useEffect(() => {
		if (!taskId) return
		if (taskEnded[taskId]) {
			setTaskId('')
			return
		}
		if (responses[taskId]) {
			const jsonStr = responses[taskId].join('')
			try {
				const data = parse(
					jsonrepair(jsonStr)
				) as PlotExplorerApiResponse['data']
				setContent(data)
			} catch (error) {
				console.log(error)
			}
		}
	}, [taskId, responses[taskId], taskEnded[taskId]])

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
						{isLoading || (taskId && !taskEnded[taskId] && !content?.length) ? (
							<div className="mt-5 flex w-full justify-center">
								<Loader />
							</div>
						) : request.action && content?.length ? (
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
										disabled={id === currentlyDisabled}
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
													handleRequest('', promptInput, promptInput)
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
