import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

import { StoryJsonData } from '@/types/common'

export async function GET(
	req: Request,
	{ params }: { params: { story: string } }
) {
	const { searchParams } = new URL(req.url)
	const { story } = params

	const page = parseInt(searchParams.get('page') || '1')
	const limit = 10
	const episodeSearch = searchParams.get('episode_search') || ''
	const jsonFile = path.join(process.cwd(), `data/stories/${story}/story.json`)

	try {
		const res = await fs.readFile(jsonFile, 'utf-8')
		const { episodes } = JSON.parse(res) as StoryJsonData

		let episodesRes = await Promise.all(
			episodes.map(async (episode, index) => {
				const filePath = path.join(process.cwd(), episode.path)
				const content = await fs.readFile(filePath, 'utf-8')
				const wordcount = content.split(/\s+/).filter((word) => word).length

				return {
					id: index + 1,
					episode_name: episode.title,
					status: episode.status || '1st Draft',
					author: episode.author || 'John Doe',
					wordcount,
					last_updated: episode.updated_at,
				}
			})
		)

		// Fuzzy search: check if episode name contains the search string
		if (episodeSearch) {
			episodesRes = episodesRes.filter((episode) =>
				episode.episode_name.toLowerCase().includes(episodeSearch.toLowerCase())
			)
		}

		const totalEpisodes = episodesRes.length
		const startIndex = (page - 1) * limit
		const paginatedEpisodes = episodesRes.slice(startIndex, startIndex + limit)
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
