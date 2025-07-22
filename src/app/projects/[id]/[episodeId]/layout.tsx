import React from 'react'

export default function EpisodeLayout({
	children,
	preview,
}: {
	children: React.ReactNode
	preview: React.ReactNode
}) {
	return (
		<>
			{children}
			{preview}
		</>
	)
}
