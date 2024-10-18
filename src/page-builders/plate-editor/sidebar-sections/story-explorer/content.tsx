import React from 'react'
import { ArrowLeft } from 'lucide-react'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

import { RequestState } from './explorer'

const transformData = (input: string[] | string) => {
	let result: Array<{ content: string; title: string }> = []
	if (typeof input === 'string') {
		const splittedText = input.split(/([A-Z]+\s+\d+)/).filter(Boolean)

		for (let i = 0; i < splittedText.length - 1; i += 2) {
			const title = splittedText[i]
			const content = splittedText[i + 1].trim().replace(/^:\s*/, '')
			if (title && content) {
				result.push({ title, content })
			}
		}
	} else {
		result = input.map((episode, index) => ({
			title: `Episode ${index + 1}`,
			content: episode,
		}))
	}
	return result
}

const Content = ({
	header,
	data,
	setRequest,
}: {
	data: string[] | string
	header: string
	setRequest: React.Dispatch<React.SetStateAction<RequestState>>
}) => {
	const explorerData = transformData(data)
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
						<AccordionContent>{data.content}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</>
	)
}

export default Content
