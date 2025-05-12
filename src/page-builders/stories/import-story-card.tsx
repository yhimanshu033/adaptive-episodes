import React from 'react'
import { ImportStory } from '@/page-builders/stories/import-story'
import useStoryStore, { setFormOpen } from '@/store/story-store'
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
import { ScrollArea } from '@/components/ui/scroll-area'

const ImportStoryCard = () => {
	const isFormOpen = useStoryStore((state) => state.isFormOpen)
	return (
		<Dialog open={isFormOpen} onOpenChange={setFormOpen}>
			<DialogTrigger asChild>
				<Card className="w-64 cursor-pointer rounded-none border bg-transparent">
					<Button variant="ghost" asChild>
						<CardContent className="flex h-full items-center justify-center gap-2">
							<Plus size={64} className="rounded-full border p-4" />
						</CardContent>
					</Button>
				</Card>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Import Story</DialogTitle>
				</DialogHeader>
				<ScrollArea className="max-h-[80vh]">
					<ImportStory />
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}

export default ImportStoryCard
