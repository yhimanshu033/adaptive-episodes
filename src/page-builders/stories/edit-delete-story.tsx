import React, { ReactNode } from 'react'
import { SelectItem } from '@radix-ui/react-select'

import {
	Select,
	SelectContent,
	SelectRoot,
	SelectSeparator,
	SelectTrigger,
	SelectWrapper,
} from '@/components/aural-ui/select'

type EditDeleteStoryProps = {
	children: ReactNode
}

const EditDeleteStory: React.FC<EditDeleteStoryProps> = ({ children }) => {
	return (
		<SelectRoot fullWidth className="max-w-md">
			<SelectWrapper>
				<Select>
					<SelectTrigger
						decoration="outline"
						variant="default"
						aria-describedby="custom-select-helper"
					>
						{children}
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="atomic">View</SelectItem>
						<SelectSeparator />
						<SelectItem value="flexible">Delete</SelectItem>
					</SelectContent>
				</Select>
			</SelectWrapper>
		</SelectRoot>
	)
}

export default EditDeleteStory
