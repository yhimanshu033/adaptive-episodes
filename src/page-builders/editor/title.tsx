import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import EditableText from '@/components/editable-text'
import { Button } from '@/components/ui/button'

const Title = ({ title }: { title: string }) => {
	const router = useRouter()
	const handleClick = () => {
		router.back()
	}
	return (
		<div className="mb-5 flex gap-2">
			<Button variant="ghost" size="icon" onClick={handleClick}>
				<ArrowLeft size={16} />
			</Button>
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
