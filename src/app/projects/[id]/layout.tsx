import React from 'react'

import { EpisodeTableProvider } from '@/providers/episode-table-provider'
import { ProjectIdProvider } from '@/providers/project-id-provider'

export default function ProjectsIdLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<EpisodeTableProvider>
			<ProjectIdProvider>{children}</ProjectIdProvider>
		</EpisodeTableProvider>
	)
}
