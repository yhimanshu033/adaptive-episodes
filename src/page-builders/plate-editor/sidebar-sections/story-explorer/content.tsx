import React from 'react'
import { ArrowLeft } from 'lucide-react'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

import { PlotExplorerApiResponse } from '@/types/ai-types'

import { RequestState } from './explorer'

const Content = ({
	header,
	explorerData,
	setRequest,
}: {
	explorerData: PlotExplorerApiResponse['data']
	header: string
	setRequest: React.Dispatch<React.SetStateAction<RequestState>>
}) => {
	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-xl font-bold">{header}</h1>
				<Button
					variant="outline"
					size="icon"
					onClick={() => {
						setRequest((prev) => ({ ...prev, action: '', name: '' }))
					}}
				>
					<ArrowLeft size={16} />
				</Button>
			</div>
			<Accordion type="single" collapsible className="w-full">
				{explorerData.map((data, index) => (
					<AccordionItem key={index} value={data.title}>
						<AccordionTrigger>{data.title}</AccordionTrigger>
						<AccordionContent>
							<div
								dangerouslySetInnerHTML={{
									__html: data.content.replace(/\n/g, '<br/>'),
								}}
							/>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</>
	)
}

export default Content
