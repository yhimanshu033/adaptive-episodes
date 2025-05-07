import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useIsGerman from '@/hooks/use-is-german'

import useProjectId from '@/providers/project-id-provider'
import { buttonVariants, cn } from '@/lib/utils/helpers'

const AdminManageProject = () => {
	const { id } = useParams()
	const isGerman = useIsGerman()
	const { isAdmin } = useProjectId()

	if (!isGerman || !isAdmin) {
		return null
	}
	return (
		<Link
			className={cn(buttonVariants({ variant: 'outline' }))}
			href={`/projects/${id as string}/manage-project`}
		>
			Manage Project
		</Link>
	)
}

export default AdminManageProject
