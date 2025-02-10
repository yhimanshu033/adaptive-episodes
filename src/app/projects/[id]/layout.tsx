import React from 'react'

import { ProjectIdProvider } from '@/providers/project-id-provider'

export default function ProjectsIdLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <ProjectIdProvider>{children}</ProjectIdProvider>
}
