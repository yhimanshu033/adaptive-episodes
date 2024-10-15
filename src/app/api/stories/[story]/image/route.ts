import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { story: string } }
) {
	const { story } = params
	const imagePath = path.join(process.cwd(), `data/stories/${story}`)

	// Fetch the image file (assuming it's one of .jpg, .jpeg, .png)
	try {
		const files = await fs.readdir(imagePath)
		const imageFile = files.find((file) =>
			/\.(jpg|jpeg|png|gif|webp)$/.test(file)
		)

		if (!imageFile) {
			return NextResponse.json({ error: 'Image not found' }, { status: 404 })
		}

		const imageFullPath = path.join(imagePath, imageFile)
		const imageBuffer = await fs.readFile(imageFullPath)

		return new NextResponse(imageBuffer, {
			headers: {
				'Content-Type': `image/${path.extname(imageFile).slice(1)}`,
				'Content-Disposition': `inline; filename="${imageFile}"`,
			},
		})
	} catch (error) {
		console.error('Error serving image:', error)
		return NextResponse.json({ error: 'Error fetching image' }, { status: 500 })
	}
}
