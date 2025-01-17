import React from 'react'
import RenderContent from '@/page-builders/plate-editor/sidebar-sections/story-explorer/render-content'
import useAIStore from '@/store/ai-store'
import { ArrowLeft } from 'lucide-react'

import { Loader } from '@/components/loader'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { preProcessData } from '@/lib/utils/explorer'

import { PlotExplorerApiResponse } from '@/types/ai-types'

const Content = ({
	header,
	explorerData,
	isLoading,
}: {
	explorerData?: PlotExplorerApiResponse['data']
	header: string
	isLoading: boolean
}) => {
	const { store, setActiveExplorerActions } = useAIStore()
	const activeExplorerMode = store((state) => state.activeExplorerMode)
	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-xl font-bold">{header}</h1>
				<Button
					variant="outline"
					size="icon"
					onClick={() => {
						setActiveExplorerActions(activeExplorerMode, null)
					}}
				>
					<ArrowLeft size={16} />
				</Button>
			</div>
			{explorerData?.length && !isLoading ? (
				<Accordion type="single" collapsible className="w-full">
					{explorerData.map((data, index) => {
						const processedData = preProcessData(data)
						return processedData.map(
							({ title, content, preContent }, subIndex) => (
								<AccordionItem
									key={`${title}${index}-${subIndex}`}
									value={`${title}${index}-${subIndex}`}
								>
									<AccordionTrigger>{title}</AccordionTrigger>
									<AccordionContent>
										<RenderContent content={content} preContent={preContent} />
									</AccordionContent>
								</AccordionItem>
							)
						)
					})}
				</Accordion>
			) : (
				<div className="mt-5 flex w-full justify-center">
					<Loader />
				</div>
			)}
		</>
	)
}

export default Content
