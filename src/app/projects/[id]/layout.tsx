import React from 'react'

import { EpisodeTableProvider } from '@/providers/episode-table-provider'
import { ProjectIdProvider } from '@/providers/project-id-provider'

export default function ProjectsIdLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ProjectIdProvider>
			<EpisodeTableProvider>{children}</EpisodeTableProvider>
		</ProjectIdProvider>
	)
}
