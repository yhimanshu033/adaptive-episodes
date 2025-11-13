import * as Sentry from '@sentry/nextjs'

export async function getGCSContent({ url }: { url?: string | null }) {
	if (!url) {
		return ''
	}
	const resp = await fetch(url)

	if (!resp.ok) {
		Sentry.captureException(new Error(`GCS file fetching failed!`), {
			extra: {
				url,
				status: resp.status,
				statusText: resp.statusText,
			},
		})
		return ''
	}

	const text = await resp.text()
	return text
}
