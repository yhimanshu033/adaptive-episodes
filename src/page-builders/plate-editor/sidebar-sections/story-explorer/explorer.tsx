/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { categories, defaultMode } from '@/constants/story-explorer-constants'
import usePlotOutlineHook from '@/hooks/mutation/use-plotoutline-hook'
import { getMetadata } from '@/server-action/metadata-action'
import { useEditorState } from '@udecode/plate-common/react'
import { Send } from 'lucide-react'

import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { extractFromMetadata, getText } from '@/lib/utils'

import { PlotExplorerApiResponse } from '@/types/ai-types'

import Content from './content'

export interface RequestState {
	action: string
	mode: 'plot' | 'character' | 'world'
	name: string
}

const Explorer = ({ start, end }: { end: number; start: number }) => {
	const { id, episodeId } = useParams()
	const [content, setContent] = useState<PlotExplorerApiResponse['data']>([])
	const [promptInput, setPromptInput] = useState<string>('')
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
		const { data: metadata } = await getMetadata(
			Number(id),
			Math.max(start - 1, 1),
			end
		)
		if (action === 'summary') {
			const metadataEntries = Object.values(metadata?.data || {})
			setContent(
				metadataEntries.map((data, index) => ({
					title: `Episode ${index + start}`,
					content: data.summary,
				}))
			)
		} else {
			const { beatsheets_array: beatsheet_array, ...extractedData } =
				extractFromMetadata(metadata, start - 1)
			const result = await mutateAsync({
				action,
				ep_from: start,
				ep_to: end,
				mode: request.mode,
				ep_number: episodeId as string,
				beatsheet_array,
				...extractedData,
				current_ep: getText(children) || ' ',
				instruction,
			})
			if (result) setContent(result as PlotExplorerApiResponse['data'])
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
