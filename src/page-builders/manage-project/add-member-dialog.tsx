import React from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import AddMemberForm from './add-member-form'

const AddMemberDialog = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm">
					<Plus size={16} /> Add User
				</Button>
			</DialogTrigger>
			<DialogContent
				className="flex h-[85vh] w-2/3 max-w-none flex-col items-start"
				autoFocus={false}
			>
				<DialogHeader>
					<DialogTitle>Add User</DialogTitle>
					<DialogDescription>
						Select users who are not part of this project and assign them a
						role.
					</DialogDescription>
				</DialogHeader>
				<Separator />
				<AddMemberForm />
			</DialogContent>
		</Dialog>
	)
}

export default AddMemberDialog
