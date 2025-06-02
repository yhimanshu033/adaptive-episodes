import React from 'react'

import ForEach from '@/components/ui/for-each'
import { cn } from '@/lib/utils/helpers'

interface IStreamedResponse extends React.ComponentProps<'div'> {
	// can be used in future if any data modification needed
	completed?: boolean
	data: string[]
	// the chunks from socket
	dataConversion?: (data: string[]) => string // can be used in future if any final data flag needed
}

export default function StreamedResponse({
	data,
	...props
}: IStreamedResponse) {
	return (
		<div {...props} className={cn('', props.className)}>
			<ForEach data={data}>
				{(item, idx) => (
					<span
						key={idx}
						dangerouslySetInnerHTML={{ __html: item.replaceAll('\n', '<br/>') }}
						className="animate-fade-in-up"
					/>
				)}
			</ForEach>
		</div>
	)
}
