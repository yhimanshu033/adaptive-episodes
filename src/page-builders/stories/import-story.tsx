/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { ImageIcon, Loader2, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ImportStoryProps {
	onSuccess?: () => void
}

export function ImportStory({ onSuccess }: ImportStoryProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [storyTitle, setStoryTitle] = useState('')
	const [storyAuthor, setStoryAuthor] = useState('')
	const [storyImage, setStoryImage] = useState<File | null>(null)
	const { toast } = useToast()

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
	}

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
		setIsUploading(true)

		const files = Array.from(e.dataTransfer.files)

		try {
			await new Promise((resolve) => setTimeout(resolve, 2000))
			toast({
				title: 'Success',
				description: `Imported ${files.length} stories successfully`,
			})
			onSuccess?.()
		} catch (error) {
			const { message } = error as Error
			toast({
				variant: 'destructive',
				title: 'Error',
				description: message || 'Failed to import stories. Please try again.',
			})
		} finally {
			setIsUploading(false)
		}
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setStoryImage(e.target.files[0])
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsUploading(true)

		try {
			await new Promise((resolve) => setTimeout(resolve, 2000))
			toast({
				title: 'Success',
				description: 'Story imported successfully',
			})
			onSuccess?.()
		} catch (error) {
			const { message } = error as Error
			toast({
				variant: 'destructive',
				title: 'Error',
				description: message || 'Failed to import story. Please try again.',
			})
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<Card className="w-full py-2">
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="title">Story Title</Label>
						<Input
							id="title"
							value={storyTitle}
							onChange={(e) => setStoryTitle(e.target.value)}
							required
						/>
					</div>
					<div>
						<Label htmlFor="author">Author</Label>
						<Input
							id="author"
							value={storyAuthor}
							onChange={(e) => setStoryAuthor(e.target.value)}
							required
						/>
					</div>
					<div>
						<Label htmlFor="image">Story Image (Optional)</Label>
						<div className="flex items-center space-x-2">
							<Input
								id="image"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
							/>
							<Button
								type="button"
								variant="outline"
								onClick={() => document.getElementById('image')?.click()}
							>
								<ImageIcon className="mr-2 size-4" />
								{storyImage ? 'Change Image' : 'Upload Image'}
							</Button>
							{storyImage && (
								<span className="text-sm text-muted-foreground">
									{storyImage.name}
								</span>
							)}
						</div>
					</div>
					<div
						className={`mt-6 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors duration-200 ${isDragging ? 'border-primary bg-primary/10' : 'border-border'} `}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						{isUploading ? (
							<div className="flex flex-col items-center gap-3">
								<Loader2 className="size-8 animate-spin text-primary" />
								<p className="text-sm text-muted-foreground">
									Importing story...
								</p>
							</div>
						) : (
							<>
								<Upload className="size-8 text-muted-foreground" />
								<div className="text-center">
									<p className="text-sm text-muted-foreground">
										Drag and drop your story files here, or
									</p>
									<Button
										type="button"
										variant="link"
										className="mt-2"
										onClick={() =>
											document.getElementById('file-upload')?.click()
										}
									>
										choose files to upload
									</Button>
									<input
										id="file-upload"
										type="file"
										multiple
										className="hidden"
										onChange={(e) => {
											if (e.target.files?.length) {
												setIsUploading(true)
												// Handle file upload here
												setTimeout(() => {
													setIsUploading(false)
													onSuccess?.()
												}, 2000)
											}
										}}
									/>
								</div>
							</>
						)}
					</div>
					<Button type="submit" disabled={isUploading}>
						{isUploading ? 'Importing...' : 'Import Story'}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
