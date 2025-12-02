import {
	DEFAULT_PERFORMANCE_ENTRY_MAX_TIME_DIFFERENCE,
	DEFAULT_PERFORMANCE_ENTRY_TIMEOUT,
	GZIP_THRESHOLD,
} from '@/constants/global-constants'

export type RequestTimingInfo = {
	cachedRedirect?: boolean
	contentDownload?: number
	dnsLookup?: number
	redirectTime?: number
	tcpConnection?: number
	timeToFirstByte?: number
	tlsHandshake?: number
	totalDuration: number
}

const precise = (value?: number) => {
	return value !== undefined ? Number(value.toFixed(2)) : undefined
}

const duration = (start?: number, end?: number) => {
	return start !== undefined && end !== undefined
		? precise(end - start)
		: undefined
}
const tlsDuration = (secureConnectionStart?: number, connectEnd?: number) => {
	return secureConnectionStart !== undefined &&
		secureConnectionStart > 0 &&
		connectEnd !== undefined
		? precise(connectEnd - secureConnectionStart)
		: undefined
}

function normalizeUrl(url: string): string {
	try {
		const urlObj = new URL(url)
		return `${urlObj.host}${urlObj.pathname.replace(/\/$/, '')}${urlObj.search}`
	} catch {
		return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
	}
}

function findPerformanceEntry(
	url: string,
	startTime: number,
	maxTimeDifference: number = DEFAULT_PERFORMANCE_ENTRY_MAX_TIME_DIFFERENCE
): PerformanceResourceTiming | null {
	if (typeof performance === 'undefined' || !performance.getEntriesByType) {
		return null
	}

	const normalizedUrl = normalizeUrl(url)

	const entries = performance.getEntriesByType(
		'resource'
	) as PerformanceResourceTiming[]

	const matchingEntries = entries.filter((entry) => {
		const normalizedEntryUrl = normalizeUrl(entry.name)
		const urlMatches = normalizedEntryUrl === normalizedUrl

		const entryStartTime = performance.timeOrigin + entry.startTime
		const timeDiff = Math.abs(entryStartTime - startTime)

		const timeMatches = timeDiff <= maxTimeDifference

		return urlMatches && timeMatches
	})

	if (matchingEntries.length > 0) {
		return matchingEntries[matchingEntries.length - 1]
	}

	return null
}

function waitForPerformanceEntry(
	url: string,
	startTime: number,
	timeout: number = DEFAULT_PERFORMANCE_ENTRY_TIMEOUT
): Promise<PerformanceResourceTiming | null> {
	return new Promise((resolve) => {
		const normalizedUrl = normalizeUrl(url)
		let timeoutId: NodeJS.Timeout | undefined

		const existingEntry = findPerformanceEntry(url, startTime)
		if (existingEntry) {
			resolve(existingEntry)
			return
		}

		if (
			typeof PerformanceObserver === 'undefined' ||
			typeof performance === 'undefined'
		) {
			resolve(null)
			return
		}

		try {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries() as PerformanceResourceTiming[]

				for (const entry of entries) {
					const normalizedEntryUrl = normalizeUrl(entry.name)
					if (normalizedEntryUrl === normalizedUrl) {
						observer.disconnect()
						if (timeoutId) {
							clearTimeout(timeoutId)
						}
						resolve(entry)
						return
					}
				}
			})

			observer.observe({ entryTypes: ['resource'], buffered: true })

			timeoutId = setTimeout(() => {
				observer.disconnect()
				const entry = findPerformanceEntry(url, startTime)
				resolve(entry)
			}, timeout)
		} catch (error) {
			console.warn('PerformanceObserver failed:', error)
			resolve(findPerformanceEntry(url, startTime))
		}
	})
}

export async function getPerformanceTiming(
	url: string,
	startTime: number
): Promise<RequestTimingInfo> {
	const totalDuration = Date.now() - startTime
	const timing: RequestTimingInfo = { totalDuration }

	if (typeof performance === 'undefined' || !performance.getEntriesByType) {
		console.warn('Performance API not available')
		return timing
	}

	const entry = await waitForPerformanceEntry(url, startTime)

	if (!entry) {
		console.warn('Performance entry not found for URL:', url)
		return timing
	}
	const isCachedRedirect =
		entry.responseStatus === 200 &&
		entry.transferSize === 0 &&
		entry.requestStart === 0 &&
		entry.responseStart === 0 &&
		entry.nextHopProtocol === ''

	if (isCachedRedirect) {
		console.warn('Cached redirect detected for:', url)
		timing.cachedRedirect = true
		return timing
	}

	timing.dnsLookup = duration(entry.domainLookupStart, entry.domainLookupEnd)
	timing.tcpConnection = duration(entry.connectStart, entry.connectEnd)
	timing.tlsHandshake = tlsDuration(
		entry.secureConnectionStart,
		entry.connectEnd
	)
	timing.timeToFirstByte = duration(entry.requestStart, entry.responseStart)
	timing.contentDownload = duration(entry.responseStart, entry.responseEnd)
	timing.redirectTime = duration(entry.redirectStart, entry.redirectEnd)

	return timing
}

/**
 * Synchronous version for cases where we can't use async
 */
export function getPerformanceTimingSync(
	url: string,
	startTime: number
): RequestTimingInfo {
	const totalDuration = Date.now() - startTime
	const timing: RequestTimingInfo = { totalDuration }

	if (typeof performance === 'undefined' || !performance.getEntriesByType) {
		return timing
	}

	const entry = findPerformanceEntry(url, startTime)

	if (!entry) {
		return timing
	}

	const isCachedRedirect =
		entry.responseStatus === 200 &&
		entry.transferSize === 0 &&
		entry.requestStart === 0 &&
		entry.responseStart === 0 &&
		entry.nextHopProtocol === ''

	if (isCachedRedirect) {
		timing.cachedRedirect = true
		return timing
	}

	timing.dnsLookup = duration(entry.domainLookupStart, entry.domainLookupEnd)
	timing.tcpConnection = duration(entry.connectStart, entry.connectEnd)
	timing.tlsHandshake = tlsDuration(
		entry.secureConnectionStart,
		entry.connectEnd
	)
	timing.timeToFirstByte = duration(entry.requestStart, entry.responseStart)
	timing.contentDownload = duration(entry.responseStart, entry.responseEnd)
	timing.redirectTime = duration(entry.redirectStart, entry.redirectEnd)

	return timing
}

function getPayloadSize(payloadString: string): number {
	return new TextEncoder().encode(payloadString).length
}

async function compressWithStreams(data: string): Promise<Uint8Array> {
	const encoder = new TextEncoder()
	const encoded = encoder.encode(data)

	const cs = new CompressionStream('gzip')

	const blob = new Blob([encoded])
	const stream = blob.stream().pipeThrough(cs)

	const arrayBuffer = await new Response(stream).arrayBuffer()
	return new Uint8Array(arrayBuffer)
}

/**
 * Compresses payload using gzip if it exceeds the size threshold
 * @param payload - The request payload (object, string, or FormData)
 * @param threshold - Size threshold in bytes (default: 5KB)
 * @returns Object containing the processed payload and compression metadata
 */
export async function compressPayload(
	payload: string | FormData,
	threshold: number = GZIP_THRESHOLD
): Promise<{
	body: BodyInit
	headers: Record<string, string>
}> {
	const shouldBypassCompression =
		payload instanceof FormData || getPayloadSize(payload) < threshold

	if (shouldBypassCompression) {
		return {
			body: payload,
			headers: {},
		}
	}

	try {
		const compressed = await compressWithStreams(payload)
		return {
			body: compressed as BodyInit,
			headers: {
				'Content-Encoding': 'gzip',
			},
		}
	} catch (error) {
		console.error('Failed to compress payload:', error)
		return {
			body: payload,
			headers: {},
		}
	}
}
