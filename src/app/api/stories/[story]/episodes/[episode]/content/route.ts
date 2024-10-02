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

	try {
		// Get the list of files in both de and us directories
		const deFiles = await fs.readdir(deDir)
		const usFiles = await fs.readdir(usDir)

		// Ensure the episode index is within the bounds of both directories
		if (
			episodeIndex < 0 ||
			episodeIndex >= deFiles.length ||
			episodeIndex >= usFiles.length
		) {
			return NextResponse.json({ error: 'Episode not found', status: 0 })
		}

		// Get the corresponding file names
		const deFile = path.join(deDir, deFiles[episodeIndex])
		const usFile = path.join(usDir, usFiles[episodeIndex])

		// Read the content of both files
		const [deContent, usContent] = await Promise.all([
			fs.readFile(deFile, 'utf-8'),
			fs.readFile(usFile, 'utf-8'),
		])

		const deFileName = deFiles[episodeIndex]
			.replace(/^\d+\s*/, '')
			.replace('.txt', '')
			.trim()

		return NextResponse.json({
			status: 1,
			error: null,
			episode: episodeIndex + 1,
			episode_name: deFileName,
			de: deContent,
			us: usContent,
		})
	} catch (error) {
		console.error('Error fetching episode content:', error)
		return NextResponse.json({
			error: 'Error fetching episode content',
			status: 0,
		})
	}
}
