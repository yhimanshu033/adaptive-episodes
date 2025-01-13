/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'
import { useStoriesData } from '@/hooks/query/use-story-data'
import { StoryGrid } from '@/page-builders/admin/llm-writers/story-grid'
import { ArrowRight, UserCircle2 } from 'lucide-react'

import BackButton from '@/components/back-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import Spinner from '@/components/ui/spinner'
import { trim } from '@/lib/utils'

import { TStory } from '@/types/story-types'

export default function WritersRoom() {
	const { data } = useStoriesData()
	const [selectedStory, setSelectedStory] = useState<TStory | null>(
		data?.[0] || null
	)
	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		if (data) setSelectedStory(data[0])
	}, [data])

	const handleStorySelect = (story: TStory) => {
		setSelectedStory(story)
		setIsModalOpen(false)
	}

	return (
		<div className="container mx-auto space-y-6 p-6">
			<div className="flex gap-6">
				<BackButton />
				<h1 className="text-3xl font-bold tracking-tight">LLM Writers Room</h1>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<div className="space-y-6">
					{/* Story Selection */}
					<Card>
						<CardHeader>
							<CardTitle>Select Story for Spin-Off</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between gap-8">
								<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
									<DialogTrigger asChild>
										<Button variant="ghost" className="h-auto w-48 p-0">
											<div className="relative w-full">
												{selectedStory?.image ? (
													<img
														src={selectedStory?.image || '/placeholder.svg'}
														alt={
															selectedStory?.project_title || 'Select a story'
														}
														className="rounded-lg object-cover"
													/>
												) : (
													<div className="p-8">
														<Spinner size={128} />
													</div>
												)}
											</div>
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-3xl">
										<DialogHeader>
											<DialogTitle>Select a Story</DialogTitle>
										</DialogHeader>
										<StoryGrid
											stories={data || []}
											onSelect={handleStorySelect}
										/>
									</DialogContent>
								</Dialog>
								<Card>
									<CardHeader className="p-4 py-3">
										<CardTitle className="text-xl">Map Alt Paths</CardTitle>
									</CardHeader>
									<CardContent className="p-4 pt-0">
										<div className="rounded-lg">
											<img
												src="/map_plot.webp"
												className="aspect-square w-full max-w-[200px] rounded border bg-white"
												alt="map plot image"
											/>
										</div>
									</CardContent>
								</Card>
							</div>

							{selectedStory && (
								<div className="mt-4">
									<h3 className="font-semibold">
										{selectedStory.project_title}
									</h3>
									<p className="text-sm text-muted-foreground">
										by {selectedStory.author || 'Unknown Author'}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Define Agents */}
					<Card>
						<CardHeader>
							<CardTitle>Define Agents</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-around">
								<div className="space-y-4">
									{/* Showrunner */}
									<div className="flex items-start gap-4 pl-4">
										<UserCircle2 className="size-10" />
										<div>
											<h3 className="font-semibold">Showrunner</h3>
											<div className="text-sm text-muted-foreground">
												<p>Bio:</p>
												<p>Style:</p>
											</div>
										</div>
									</div>

									{/* Writers */}
									<div className="grid grid-cols-2 gap-8">
										{[1, 2].map((writer) => (
											<div key={writer} className="flex items-start gap-2">
												<UserCircle2 className="size-8" />
												<div>
													<h4 className="font-medium">Writer {writer}</h4>
													<div className="text-xs text-muted-foreground">
														<p>Bio:</p>
														<p>Style:</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Editor */}
								<div className="flex items-center justify-end gap-2">
									<ArrowRight className="size-4" />
									<div className="flex items-start gap-2">
										<UserCircle2 className="size-8" />
										<div>
											<h4 className="font-medium">Editor</h4>
											<div className="text-xs text-muted-foreground">
												<p>Bio:</p>
												<p>Style:</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					{/* Review Results */}
					<Card>
						<CardHeader>
							<CardTitle>Review Results</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[400px] rounded-md border p-4">
								<h3 className="mb-2 text-lg font-semibold">
									{selectedStory?.project_title} Ep 1
								</h3>
								<div className="space-y-4 text-sm text-muted-foreground">
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
										do eiusmod tempor incididunt ut labore et dolore magna
										aliqua.
									</p>
									<p>
										Ut enim ad minim veniam, quis nostrud exercitation ullamco
										laboris nisi ut aliquip ex ea commodo consequat.
									</p>
									<p>
										Duis aute irure dolor in reprehenderit in voluptate velit
										esse cillum dolore eu fugiat nulla pariatur.
									</p>
								</div>
							</ScrollArea>
						</CardContent>
					</Card>

					{/* Adjust Variables */}
					<Card>
						<CardHeader>
							<CardTitle>Adjust Variables, Re-Run</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-4">
								{['Plot', 'Characters', 'Theme', 'Structure', 'Style'].map(
									(variable) => (
										<Button
											key={variable}
											tooltip={variable}
											variant="outline"
											className="size-16 rounded-full"
										>
											{trim(variable, 5)}
										</Button>
									)
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
