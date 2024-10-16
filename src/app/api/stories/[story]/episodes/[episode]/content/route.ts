import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

import { StoryJsonData } from '@/types/common'

export async function GET(
	req: Request,
	{ params }: { params: { episode: string; story: string } }
) {
	const { story, episode } = params
	const episodeIndex = parseInt(episode) - 1

	const jsonFile = path.join(process.cwd(), `data/stories/${story}/story.json`)

	try {
		const res = await fs.readFile(jsonFile, 'utf-8')
		const jsonData = JSON.parse(res) as StoryJsonData

		// Ensure the episode index is within the bounds of both directories
		if (episodeIndex < 0 || episodeIndex >= jsonData.totalEpisodes) {
			return NextResponse.json({ error: 'Episode not found', status: 0 })
		}
		const currentEpisode = jsonData.episodes[episodeIndex]
		// Get the corresponding file names
		const deFile = path.join(process.cwd(), currentEpisode.path)
		const usFile = path.join(process.cwd(), currentEpisode.path_us)
		// const summaryFile = path.join(summaryDir, summaryFiles[episodeIndex])

		// Read the content of both files
		const [deContent, usContent, summaryContent] = await Promise.all([
			fs.readFile(deFile, 'utf-8'),
			fs.readFile(usFile, 'utf-8'),
			currentEpisode?.summary_de || currentEpisode.context,
		])

		// Determine if there's a next or previous episode
		const hasPrevious = episodeIndex > 0
		const hasNext = episodeIndex < jsonData.totalEpisodes - 1

		return NextResponse.json({
			status: 1,
			error: null,
			episode: episodeIndex + 1,
			episode_name: currentEpisode.title,
			de: deContent,
			us: usContent,
			summary: summaryContent,
			hasNext,
			hasPrevious,
		})
	} catch (error) {
		console.error('Error fetching episode content:', error)
		return NextResponse.json({
			error: 'Error fetching episode content',
			status: 0,
		})
	}
}
