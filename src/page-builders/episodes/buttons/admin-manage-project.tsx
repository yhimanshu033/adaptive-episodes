import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useAccessChecks from '@/hooks/use-access-checks'
import { Settings } from 'lucide-react'

import { TooltipComponent } from '@/components/ui/tooltip-component'
import useProjectId from '@/providers/project-id-provider'
import { buttonVariants, cn } from '@/lib/utils/helpers'

const AdminManageProject = () => {
	const { id } = useParams()
	const { isGerman } = useAccessChecks()
	const { isAdmin } = useProjectId()

	if (!isGerman || !isAdmin) {
		return null
	}
	return (
		<TooltipComponent side="bottom" tooltip="Manage Project">
			<Link
				className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
				href={`/projects/${id as string}/manage-project`}
			>
				<Settings />
			</Link>
		</TooltipComponent>
	)
}

export default AdminManageProject
