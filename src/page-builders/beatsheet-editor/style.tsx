import React from 'react'

import { Button } from '@/components/aural-ui/button'
import TextArea from '@/components/aural-ui/textarea'

const StyleTab = () => {
	return (
		<div className="space-y-4 rounded-md border p-3">
			<div>
				<h4 className="mb-2 text-sm font-bold">Writing Style</h4>
				<TextArea placeholder="Writing Style" />
			</div>

			<div>
				<h4 className="mb-2 text-sm font-bold">Example Writing</h4>
				<TextArea placeholder="Example Writing" />
			</div>
			<Button className="w-full">Save</Button>
		</div>
	)
}

export default StyleTab
