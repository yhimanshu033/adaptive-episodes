import React from 'react'
import { Copy } from 'lucide-react'

import ForEach from '@/components/ui/for-each'
import { cn } from '@/lib/utils/helpers'

import { IconButton } from '../aural-ui/icon-button'

interface IStreamedResponse extends React.ComponentProps<'div'> {
	// can be used in future if any data modification needed
	completed?: boolean
	data: string[]
	// the chunks from socket
	dataConversion?: (data: string[]) => string // can be used in future if any final data flag needed
	showCopyButton?: boolean // if true, will show copy button
}

export default function StreamedResponse({
	data,
	showCopyButton,
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
			{showCopyButton && (
				<div className="text-right">
					<IconButton
						label=""
						icon={<Copy />}
						variant="ghost"
						className="text-fm-icon-inactive group-hover:text-fm-icon-active hover:text-fm-icon-active"
					/>
				</div>
			)}
		</div>
	)
}
