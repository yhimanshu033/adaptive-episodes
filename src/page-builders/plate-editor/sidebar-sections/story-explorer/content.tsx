import React from 'react'
import { ArrowLeft } from 'lucide-react'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

import { ExplorerType, PlotExplorerApiResponse } from '@/types/ai-types'

import { RequestState } from './explorer'

const renderContent = (content: string | ExplorerType[]): JSX.Element => {
	if (content === '' || !content.length) return <p>Content not found 😢</p>
	if (typeof content === 'string') {
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: content.replace(/\n/g, '<br/>'),
				}}
			/>
		)
	}

	if (Array.isArray(content)) {
		return (
			<Accordion type="single" collapsible className="w-full">
				{content.map((item, index) => (
					<AccordionItem
						key={`${item.title}${index}`}
						value={`${item.title}${index}`}
					>
						<AccordionTrigger>{item.title}</AccordionTrigger>
						<AccordionContent>{renderContent(item.content)}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		)
	}

	return <div>Invalid content format</div>
}

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
					<AccordionItem
						key={`${data.title}${index}`}
						value={`${data.title}${index}`}
					>
						<AccordionTrigger>{data.title}</AccordionTrigger>
						<AccordionContent>{renderContent(data.content)}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</>
	)
}

export default Content
