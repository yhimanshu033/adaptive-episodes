import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

import { StoryJsonData } from '@/types/common'

export async function GET(
	req: Request,
	{ params }: { params: { episode: string; story: string } }
) {
	const { searchParams } = new URL(req.url)
	const { story, episode } = params

	const startEpisode = parseInt(searchParams.get('start') || '1')
	const endEpisode = parseInt(searchParams.get('end') || '1')
	const currentEpisode = parseInt(episode) - 1
	const jsonFile = path.join(process.cwd(), `data/stories/${story}/story.json`)

	try {
		const res = await fs.readFile(jsonFile, 'utf-8')
		const { episodes } = JSON.parse(res) as StoryJsonData
		const rangedMetaData = episodes
			.slice(startEpisode - 1, endEpisode)
			.map(({ loglines, beatsheets }) => ({ loglines, beatsheets }))

		return NextResponse.json({
			status: 1,
			error: null,
			metadata: rangedMetaData,
			context: episodes?.[currentEpisode]?.context || '',
		})
	} catch (error) {
		console.error('Error fetching loglines:', error)
		return NextResponse.json({
			status: 0,
			error: 'Error fetching loglines',
		})
	}
}
