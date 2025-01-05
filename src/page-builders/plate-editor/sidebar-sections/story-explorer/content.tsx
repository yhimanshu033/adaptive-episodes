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

const preProcessData = (data: ExplorerType): ExplorerType => {
	if (typeof data.content === 'string') {
		const regex = /^\s*(?:Name:(.*)|(Episode\s*.*))$/m
		const match = data.content.match(regex)
		const title = match?.[1]?.trim() || match?.[2]?.trim() || data?.title
		const content = data.content.replace(regex, '').trim()

		return { ...data, title, content }
	}
	return data
}

const renderContent = (
	content: string | ExplorerType[],
	preContent?: string
): JSX.Element => {
	if (!content || content === '' || !content?.length)
		return <p>Content not found 😢</p>
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
			<>
				{preContent && (
					<div
						dangerouslySetInnerHTML={{
							__html: preContent.replace(/\n/, '<br/>'),
						}}
					/>
				)}
				<Accordion type="single" collapsible className="w-full">
					{content.map((item, index) => {
						const {
							title,
							content: subContent,
							preContent,
						} = preProcessData(item)
						return (
							<AccordionItem
								key={`${title}${index}`}
								value={`${title}${index}`}
							>
								<AccordionTrigger>{title}</AccordionTrigger>
								<AccordionContent>
									{renderContent(subContent, preContent)}
								</AccordionContent>
							</AccordionItem>
						)
					})}
				</Accordion>
			</>
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
				{explorerData.map((data, index) => {
					const { title, content, preContent } = preProcessData(data)
					return (
						<AccordionItem key={`${title}${index}`} value={`${title}${index}`}>
							<AccordionTrigger>{title}</AccordionTrigger>
							<AccordionContent>
								{renderContent(content, preContent)}
							</AccordionContent>
						</AccordionItem>
					)
				})}
			</Accordion>
		</>
	)
}

export default Content
