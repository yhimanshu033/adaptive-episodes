import React from 'react'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { preProcessData } from '@/lib/utils/explorer'

import { ExplorerType } from '@/types/ai-types'

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
