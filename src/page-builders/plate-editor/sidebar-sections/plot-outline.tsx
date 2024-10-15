'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const StoryExplorer = () => {
	const [startEpisode, setStartEpisode] = useState(1)
	const [endEpisode, setEndEpisode] = useState(5)
	const [customPrompt, setCustomPrompt] = useState('')

	const handleEpisodeChange = (type: 'start' | 'end', value: number) => {
		if (type === 'start') {
			setStartEpisode(Math.min(value, endEpisode))
		} else {
			setEndEpisode(Math.max(value, startEpisode))
		}
	}

	return (
		<div className="min-h-screen p-8">
			<div className="mx-auto max-w-2xl">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-2xl font-bold">Story Explorer</h1>
					<div className="flex items-center space-x-2">
						<span>Episode Range:</span>
						<Input
							type="number"
							min={1}
							max={endEpisode}
							value={startEpisode}
							onChange={(e) =>
								handleEpisodeChange('start', parseInt(e.target.value))
							}
							className="w-16 text-center"
						/>
						<span>-</span>
						<Input
							type="number"
							min={startEpisode}
							value={endEpisode}
							onChange={(e) =>
								handleEpisodeChange('end', parseInt(e.target.value))
							}
							className="w-16 text-center"
						/>
					</div>
				</div>

				<Tabs defaultValue="plot" className="w-full">
					<TabsList className="grid w-full grid-cols-3 bg-background">
						<TabsTrigger
							className="data-[state=active]:bg-primary"
							value="plot"
						>
							Plot
						</TabsTrigger>
						<TabsTrigger
							className="data-[state=active]:bg-primary"
							value="character"
						>
							Character
						</TabsTrigger>
						<TabsTrigger
							className="data-[state=active]:bg-primary"
							value="world"
						>
							World
						</TabsTrigger>
					</TabsList>
					<TabsContent value="plot" className="mt-6">
						<div className="flex flex-col items-center space-y-2">
							<Button variant="outline" className="w-48">
								Summaries
							</Button>
							<Button variant="outline" className="w-48">
								Scenes
							</Button>
							<Button variant="outline" className="w-48">
								Arcs
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="character" className="mt-6">
						<div className="flex flex-col items-center space-y-2">
							<Button variant="outline" className="w-48">
								Bios
							</Button>
							<Button variant="outline" className="w-48">
								Relationships
							</Button>
							<Button variant="outline" className="w-48">
								Arcs
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="world" className="mt-6">
						<div className="flex flex-col items-center space-y-2">
							<Button variant="outline" className="w-48">
								Locations
							</Button>
							<Button variant="outline" className="w-48">
								Props
							</Button>
							<Button variant="outline" className="w-48">
								Rules
							</Button>
						</div>
					</TabsContent>
				</Tabs>

				<div className="mt-6 flex items-center justify-center">
					<div className="relative w-64">
						<Input
							type="text"
							value={customPrompt}
							onChange={(e) => setCustomPrompt(e.target.value)}
							placeholder="Custom Prompt..."
							className="w-full pr-10"
						/>
						<Button
							size="icon"
							variant="ghost"
							className="absolute right-1 top-1/2 -translate-y-1/2"
							onClick={() =>
								console.log('Custom prompt submitted:', customPrompt)
							}
						>
							<Send className="size-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default StoryExplorer
