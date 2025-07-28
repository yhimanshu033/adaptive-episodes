import { useEffect, useState } from 'react'

type UseImageFileSizeResult = {
	error: Error | null
	loading: boolean
	size: number | null
}

/**
 * Custom hook to fetch and return the size of an image from a URL.
 * @param url The image URL (must be CORS-accessible if external).
 */
export function useImageFileSize(url: string | null): UseImageFileSizeResult {
	const [size, setSize] = useState<number | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		if (!url) {
			return
		}

		const fetchSize = async () => {
			setLoading(true)
			try {
				const response = await fetch(url)
				const blob = await response.blob()
				setSize(blob.size)
				setError(null)
			} catch (err) {
				setError(err as Error)
				setSize(null)
			} finally {
				setLoading(false)
			}
		}

		void fetchSize()
	}, [url])

	return { size, loading, error }
}
