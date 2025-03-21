import React from 'react'
import useProjectAccessMutation from '@/hooks/mutation/use-project-access-mutation'
import useAdminStore, { setDeleteMemberMail } from '@/store/admin-store'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { EProjectAccessActions } from '@/types/admin-types'

const AdminAlert = () => {
	const deleteMemberMail = useAdminStore((state) => state.deleteMemberMail)
	const projectAccessMutation = useProjectAccessMutation()

	const handleRevoke = () => {
		projectAccessMutation.mutate({
			action: EProjectAccessActions.REVOKE,
			body: { user_email: deleteMemberMail },
		})
		setDeleteMemberMail('')
	}

	return (
		<AlertDialog
			open={!!deleteMemberMail}
			onOpenChange={() => setDeleteMemberMail('')}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm Selection</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					Access of this project to {deleteMemberMail} will be revoked
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleRevoke}>Confirm</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default AdminAlert
