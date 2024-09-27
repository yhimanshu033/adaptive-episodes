import React from 'react'

import Footer from '@/components/footer'
import Header from '@/components/header'

const ProjectsLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			{children}
			<Footer />
		</div>
	)
}

export default ProjectsLayout
