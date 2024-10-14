import React from 'react'

import { Button } from '@/components/ui/button'

const Comments = () => {
	return (
		<div className="space-y-4 p-4">
			<h1>Comments</h1>
			<div className="rounded p-2">
				<p className="font-bold">User1:</p>
				<p>Great start to the story! I love the character introduction.</p>
			</div>
			<textarea
				className="w-full rounded border bg-transparent p-2"
				rows={3}
				placeholder="Add a comment..."
			></textarea>
			<Button className="w-full">Post Comment</Button>
		</div>
	)
}

export default Comments
