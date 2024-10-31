import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

import { StoryJsonData } from '@/types/common'

export async function GET() {
	const storiesDir = path.join(process.cwd(), 'data/stories')

	try {
		const storyDirs = await fs.readdir(storiesDir)

		const storyDetails = await Promise.all(
			storyDirs.map(async (storyDir, index) => {
				const storyPath = path.join(storiesDir, storyDir)
				const jsonFile = path.join(storyPath, 'story.json')
				const res = await fs.readFile(jsonFile, 'utf-8')
				const jsonData = JSON.parse(res) as StoryJsonData

				return {
					id: index + 1,
					story_name: jsonData?.story_title,
					episodes_count: jsonData?.totalEpisodes,
					author: jsonData?.author_name,
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
