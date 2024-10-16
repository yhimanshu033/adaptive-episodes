import React from 'react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { RequestState } from './explorer'

const Content = ({
	header,
	data,
	setRequest,
}: {
	data: string[]
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
			<ul className="container list-disc">
				{data.map((item, index) => (
					<li key={index}>
						{item} <br />
					</li>
				))}
			</ul>
		</>
	)
}

export default Content
