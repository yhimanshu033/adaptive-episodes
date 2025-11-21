export type RequestTimingInfo = {
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

export function getPerformanceTiming(
	url: string,
	startTime: number
): RequestTimingInfo | null {
	const totalDuration = Date.now() - startTime
	const timing: RequestTimingInfo = { totalDuration }

	if (typeof performance === 'undefined' || !performance.getEntriesByType) {
		return timing
	}

	const entries = performance.getEntriesByType(
		'resource'
	) as PerformanceResourceTiming[]

	console.log(entries)

	const entry = entries.find(
		(e) => e.name.includes(url) || url.includes(e.name)
	)

	if (!entry) {
		return timing
	}

	timing.dnsLookup = duration(entry.domainLookupStart, entry.domainLookupEnd)
	timing.tcpConnection = duration(entry.connectStart, entry.connectEnd)
	timing.tlsHandshake = duration(entry.secureConnectionStart, entry.connectEnd)
	timing.timeToFirstByte = duration(entry.requestStart, entry.responseStart)
	timing.contentDownload = duration(entry.responseStart, entry.responseEnd)
	timing.redirectTime = duration(entry.redirectStart, entry.redirectEnd)

	return timing
}
