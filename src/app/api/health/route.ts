import { NextResponse } from 'next/server'

export function GET() {
	return NextResponse.json(
		{
			status: 'healthy',
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			environment: process.env.NEXT_PUBLIC_DEPLOY_ENV || 'dev',
			version: process.env.npm_package_version || '1.0.0',
		},
		{
			status: 200,
			headers: {
				'Cache-Control': 'no-store, no-cache, must-revalidate',
			},
		}
	)
}
