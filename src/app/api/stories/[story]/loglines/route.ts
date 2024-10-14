import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { story: string } }
) {
	const { searchParams } = new URL(req.url)
	const { story } = params

	const startEpisode = parseInt(searchParams.get('start') || '1')
	const endEpisode = parseInt(searchParams.get('end') || '1')
	const loglinesPath = path.join(
		process.cwd(),
		`data/stories/${story}/de/loglines.txt`
	)

	try {
		const content = await fs.readFile(loglinesPath, 'utf-8')
		const loglines = content
			.split(/Episode \d+: /)
			.slice(1)
			.map((line) => line.trim())

		const filteredLoglines = loglines
			.map((line) => line.trim())
			.filter(
				(_, index) => index + 1 >= startEpisode && index + 1 <= endEpisode
			)

		return NextResponse.json({
			status: 1,
			error: null,
			loglines: filteredLoglines,
		})
	} catch (error) {
		console.error('Error fetching loglines:', error)
		return NextResponse.json({
			status: 0,
			error: 'Error fetching loglines',
		})
	}
}
