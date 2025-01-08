import React from 'react'
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

import { ExplorerType, PlotExplorerApiResponse } from '@/types/ai-types'

const preProcessData = (data: ExplorerType): ExplorerType[] => {
	const regex = /^\s*(?:Name:(.*)|(Episode\s*.*))$/m
	if (typeof data.content === 'string' && regex.test(data.content)) {
		return data.content.split(/\n{2,}/).map((block) => {
			const match = block.match(regex)
			const title = match?.[1]?.trim() || match?.[2]?.trim() || data?.title
			const content = block
				.replace(/^\s*(?:Name:(.*)|(Episode\s*.*))$/m, '')
				.trim()
			return { title, content }
		})
	}
	return [data]
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
						const processedData = preProcessData(item)
						return processedData.map(
							({ title, content: subContent, preContent }, subIndex) => (
								<AccordionItem
									key={`${title}${index}-${subIndex}`}
									value={`${title}${index}-${subIndex}`}
								>
									<AccordionTrigger>{title}</AccordionTrigger>
									<AccordionContent>
										{renderContent(subContent, preContent)}
									</AccordionContent>
								</AccordionItem>
							)
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
										{renderContent(content, preContent)}
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
