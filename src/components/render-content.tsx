import React from 'react'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { preProcessData } from '@/lib/utils/explorer'
import { cn } from '@/lib/utils/helpers'

import { ExplorerType, PlotExplorerApiResponse } from '@/types/ai-types'

export default function RenderContent({
	content,
	preContent,
}: {
	content: string | ExplorerType[]
	preContent?: string
}) {
	if (!content || content === '' || !content?.length) {
		return <p>Content not found 😢</p>
	}

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
				<Accordion type="multiple" className="w-full">
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
										<RenderContent
											content={subContent}
											preContent={preContent}
										/>
									</AccordionContent>
								</AccordionItem>
							)
						)
					})}
				</Accordion>
			</>
		)
	}
}

export function StoryAccordion({
	explorerData,
	className,
}: {
	className?: string
	explorerData: PlotExplorerApiResponse['data'] | string
}) {
	return typeof explorerData === 'string' ? (
		<div
			dangerouslySetInnerHTML={{
				__html: explorerData.replace(/\n/g, '<br/>'),
			}}
		/>
	) : (
		<Accordion type="multiple" className={cn('w-full', className)}>
			{explorerData.map((data, index) => {
				const processedData = preProcessData(data)
				return processedData.map(({ title, content, preContent }, subIndex) => (
					<AccordionItem
						key={`${title}${index}-${subIndex}`}
						value={`${title}${index}-${subIndex}`}
					>
						<AccordionTrigger>{title}</AccordionTrigger>
						<AccordionContent>
							<RenderContent content={content} preContent={preContent} />
						</AccordionContent>
					</AccordionItem>
				))
			})}
		</Accordion>
	)
}
