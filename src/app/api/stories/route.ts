import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
	const storiesDir = path.join(process.cwd(), 'data/stories')

	try {
		const storyDirs = await fs.readdir(storiesDir)

		const storyDetails = await Promise.all(
			storyDirs.map(async (storyDir, index) => {
				const storyPath = path.join(storiesDir, storyDir)

				// Fetching `de` episodes count
				const deEpisodesDir = path.join(storyPath, 'de/episodes')
				const episodes = await fs.readdir(deEpisodesDir)

				// Get episode count based on .txt files
				const episodeCount = episodes.filter((file) =>
					file.endsWith('.txt')
				).length

				return {
					id: index + 1,
					story_name: storyDir,
					episodes_count: episodeCount,
					author: 'Author Name',
				}
			})
		)

		return NextResponse.json({
			status: 1,
			error: null,
			data: storyDetails,
		})
	} catch (error) {
		console.error('Error fetching stories:', error)
		return NextResponse.json({ status: 0, error: 'Error fetching stories' })
	}
}
