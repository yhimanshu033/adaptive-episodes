import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

import { StoryJsonData } from '@/types/common'

export async function GET(
	req: Request,
	{ params }: { params: { story: string } }
) {
	const { story } = params
	const jsonFile = path.join(process.cwd(), `data/stories/${story}/story.json`)
	// Fetch the image file (assuming it's one of .jpg, .jpeg, .png)
	try {
		const res = await fs.readFile(jsonFile, 'utf-8')
		const jsonData = JSON.parse(res) as StoryJsonData

		if (!jsonData.thumbnail_path) {
			return NextResponse.json({ error: 'Image not found' }, { status: 404 })
		}

		const imageFullPath = path.join(process.cwd(), jsonData.thumbnail_path)
		const imageBuffer = await fs.readFile(imageFullPath)
		const imageFile = path.basename(imageFullPath)

		return new NextResponse(imageBuffer, {
			headers: {
				'Content-Type': `image/${path.extname(imageFile).slice(1)}`,
				'Content-Disposition': `inline; filename="${imageFile}"`,
				'Cache-Control': 'public, max-age=86400, immutable', //1 day cache
			},
		})
	} catch (error) {
		console.error('Error serving image:', error)
		return NextResponse.json({ error: 'Error fetching image' }, { status: 500 })
	}
}
