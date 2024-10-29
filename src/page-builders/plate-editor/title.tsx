import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import EditableText from '@/components/editable-text'
import { Button } from '@/components/ui/button'

const Title = ({
	title,
	episodeNumber,
}: {
	episodeNumber: number
	title: string
}) => {
	const router = useRouter()
	const { id } = useParams()
	const handleClick = () => {
		router.replace(
			`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id as string}`
		)
	}
	return (
		<div className="flex items-center gap-2">
			<Button variant="ghost" size="icon" onClick={handleClick}>
				<ArrowLeft size={16} />
			</Button>
			<p className="text-xl">{episodeNumber}.</p>
			<EditableText
				key={title}
				text={decodeURIComponent(title)}
				rootClass="text-xl"
				inputClass="text-xl"
				isEditable
			/>
		</div>
	)
}

export default Title
