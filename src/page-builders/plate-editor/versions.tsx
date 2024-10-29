import React from 'react'
import useVersionData from '@/hooks/query/use-version-data'
import { Plus } from 'lucide-react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const Versions = ({ activeVersionId }: { activeVersionId: string }) => {
	const { data: allVersionIds } = useVersionData()

	const handleSelect = (value: string) => {
		if (value === 'add') {
			console.log('add')
		} else {
			console.log('change version')
		}
	}

	if (!allVersionIds) return null
	return (
		<Select value={activeVersionId} onValueChange={handleSelect}>
			<SelectTrigger className="gap-2">
				<SelectValue placeholder="Version" />
			</SelectTrigger>
			<SelectContent>
				{allVersionIds.map((id, index) => (
					<SelectItem key={index} value={id}>{`v${index + 1}`}</SelectItem>
				))}
				<SelectItem value="add">
					<Plus size={16} />
				</SelectItem>
			</SelectContent>
		</Select>
	)
}

export default Versions
