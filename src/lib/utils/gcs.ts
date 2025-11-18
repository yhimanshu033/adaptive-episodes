import * as Sentry from '@sentry/nextjs'

export async function getGCSContent({ url }: { url?: string | null }) {
	if (!url) {
		return ''
	}
	try {
		const urlObj = new URL(url)
		urlObj.searchParams.set('v', Date.now().toString())
		const resp = await fetch(urlObj, {
			next: {
				revalidate: 0,
			},
		})

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
	} catch (error) {
		Sentry.captureException(new Error(`GCS file fetching failed!`), {
			extra: {
				url,
				error: JSON.stringify(error),
			},
		})
		return ''
	}
}

export async function uploadTextToPresignedUrl({
	content,
	presignedUrl,
}: {
	content: string
	presignedUrl: string
}) {
	try {
		const res = await fetch(presignedUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: content,
			next: {
				revalidate: 0,
			},
		})

		if (!res.ok) {
			return false
		}

		return true
	} catch (e) {
		console.info(e)
		return false
	}
}
