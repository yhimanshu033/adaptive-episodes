import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useAdmin from '@/hooks/use-admin'

import { Button } from '@/components/ui/button'

const AdminManageProject = () => {
	const { id } = useParams()
	const { isAdmin } = useAdmin()

	if (!isAdmin) return null

	return (
		<Button variant="outline" asChild>
			<Link href={`/projects/${id as string}/manage-project`}>
				Manage Project
			</Link>
		</Button>
	)
}

export default AdminManageProject
