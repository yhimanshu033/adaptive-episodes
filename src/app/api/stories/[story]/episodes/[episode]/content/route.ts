import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { episode: string; story: string } }
) {
	const { story, episode } = params
	const episodeIndex = parseInt(episode) - 1 // Convert episode number to index (0-based)

	const deDir = path.join(process.cwd(), `data/stories/${story}/de/episodes`)
	const usDir = path.join(process.cwd(), `data/stories/${story}/us/episodes`)
	const summaryDir = path.join(
		process.cwd(),
		`data/stories/${story}/de/summary`
	)

	try {
		// Get the list of files in both de and us directories
		const deFiles = await fs.readdir(deDir)
		const usFiles = await fs.readdir(usDir)
		const summaryFiles = await fs.readdir(summaryDir)

		// Ensure the episode index is within the bounds of both directories
		if (
			episodeIndex < 0 ||
			episodeIndex >= deFiles.length ||
			episodeIndex >= usFiles.length ||
			episodeIndex >= summaryFiles.length
		) {
			return NextResponse.json({ error: 'Episode not found', status: 0 })
		}

		// Get the corresponding file names
		const deFile = path.join(deDir, deFiles[episodeIndex])
		const usFile = path.join(usDir, usFiles[episodeIndex])
		const summaryFile = path.join(summaryDir, summaryFiles[episodeIndex])

		// Read the content of both files
		const [deContent, usContent, summaryContent] = await Promise.all([
			fs.readFile(deFile, 'utf-8'),
			fs.readFile(usFile, 'utf-8'),
			fs.readFile(summaryFile, 'utf-8'),
		])

		const deFileName = deFiles[episodeIndex]
			.replace(/^\d+\s*/, '')
			.replace('.txt', '')
			.trim()

		// Determine if there's a next or previous episode
		const hasPrevious = episodeIndex > 0
		const hasNext = episodeIndex < deFiles.length - 1

		return NextResponse.json({
			status: 1,
			error: null,
			episode: episodeIndex + 1,
			episode_name: deFileName,
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
