'use client'

import React, { useEffect, useState } from 'react'
import Script from 'next/script'

export default function ExternalScripts() {
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setLoaded(true), 1000)
		return () => clearTimeout(timer)
	}, [])

	if (
		!loaded ||
		process.env.NODE_ENV !== 'production' ||
		process.env.NEXT_PUBLIC_DEPLOY_ENV !== 'production'
	) {
		return null
	}

	return (
		<>
			<Script
				strategy="afterInteractive"
				defer
				src="https://t.contentsquare.net/uxa/bd6a74947e8be.js"
			/>
		</>
	)
}
