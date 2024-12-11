import React, { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

import { ImportStory } from './import-story'

const ImportStoryCard = () => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Card className="w-64 cursor-pointer border-dashed bg-transparent">
					<Button variant="ghost" asChild>
						<CardContent className="flex h-full items-center justify-center gap-2">
							<Plus size={16} /> Add Story
						</CardContent>
					</Button>
				</Card>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Import Story</DialogTitle>
				</DialogHeader>
				<ImportStory />
			</DialogContent>
		</Dialog>
	)
}

export default ImportStoryCard
