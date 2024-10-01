import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { story: string } }
) {
	const { searchParams } = new URL(req.url)
	const { story } = params

	const page = parseInt(searchParams.get('page') || '1')
	const limit = 10
	const episodeSearch = searchParams.get('episode_search') || '' // Episode search query
	const episodesDir = path.join(
		process.cwd(),
		`data/stories/${story}/de/episodes`
	)

	try {
		const episodeFiles = await fs.readdir(episodesDir)

		// Create an array of episodes with word count
		const episodes = await Promise.all(
			episodeFiles
				.filter((file) => file.endsWith('.txt'))
				.map(async (file, index) => {
					const filePath = path.join(episodesDir, file)
					const content = await fs.readFile(filePath, 'utf-8')
					const wordcount = content.split(/\s+/).filter((word) => word).length // Count words

					return {
						id: index + 1, // You might want to change this logic based on actual episode IDs
						episode_name: file.replace(/^\d+\s*/, '').replace('.txt', ''),
						status: '1st Draft',
						author: 'Author Name',
						wordcount,
						last_updated: new Date().toISOString(),
					}
				})
		)

		// Fuzzy search: check if episode name contains the search string
		let filteredEpisodes = episodes
		if (episodeSearch) {
			filteredEpisodes = episodes.filter((episode) =>
				episode.episode_name.toLowerCase().includes(episodeSearch.toLowerCase())
			)
		}

		const totalEpisodes = filteredEpisodes.length
		const startIndex = (page - 1) * limit
		const paginatedEpisodes = filteredEpisodes.slice(
			startIndex,
			startIndex + limit
		)
		const hasNext = startIndex + limit < totalEpisodes

		return NextResponse.json({
			status: 1,
			error: null,
			currentPage: page,
			totalPages: Math.ceil(totalEpisodes / limit),
			totalEpisodes,
			hasNext,
			episodes: paginatedEpisodes,
		})
	} catch (error) {
		console.error('Error fetching episodes:', error)
		return NextResponse.json({
			status: 0,
			error: 'Error fetching episodes',
		})
	}
}
