import React, { useState } from 'react'
import { rolesArray } from '@/constants/global-constants'
import UserInfo from '@/page-builders/episodes/user-info'
import { setDeleteMemberMail } from '@/store/admin-store'
import {
	ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import {
	EProjectAccessActions,
	EProjectUsersHeaderKeys,
	ERole,
	MemberData,
} from '@/types/admin-types'

import useProjectAccessMutation from './mutation/use-project-access-mutation'

export const useProjectUsersTable = (members: MemberData[]) => {
	const [sorting, setSorting] = useState<SortingState>([])
	const [globalFilter, setGlobalFilter] = useState('')

	const projectAccessMutation = useProjectAccessMutation()

	const handleUpdateRole = (email: string, role: ERole) => {
		projectAccessMutation.mutate({
			action: EProjectAccessActions.GRANT,
			body: { user_email: email, role },
		})
	}

	const columns: ColumnDef<MemberData>[] = [
		{
			accessorKey: EProjectUsersHeaderKeys.SERIAL_NUMBER,
			header: 'S.No',
			cell: ({ row }) => row.index + 1,
		},
		{
			accessorKey: EProjectUsersHeaderKeys.USER,
			header: 'User',
			cell: ({ row }) => <UserInfo user={row.original.user} showFullName />,
		},
		{
			accessorKey: EProjectUsersHeaderKeys.EMAIL,
			header: 'Email',
			cell: ({ row }) => row.original.user.email,
		},
		{
			accessorKey: EProjectUsersHeaderKeys.ROLE,
			header: 'Role',
			cell: ({ row }) =>
				row.original.role === ERole.ADMIN ? (
					row.original.role
				) : (
					<Select
						value={row.original.role}
						onValueChange={(value) => {
							handleUpdateRole(row.original.user.email, value as ERole)
						}}
					>
						<SelectTrigger className="max-w-28">
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent className="bg-background">
							{rolesArray.map((role, index) => (
								<SelectItem key={index} value={role}>
									{role}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				),
		},
		{
			accessorKey: EProjectUsersHeaderKeys.DELETE,
			header: 'Revoke Access',
			cell: ({ row }) =>
				row.original.role !== ERole.ADMIN ? (
					<Button
						tooltip="Revoke access"
						variant="ghost"
						size="icon"
						onClick={() => setDeleteMemberMail(row.original.user.email)}
					>
						<Trash2 size={16} />
					</Button>
				) : null,
		},
	]

	const table = useReactTable({
		data: members,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onGlobalFilterChange: setGlobalFilter,
		onSortingChange: setSorting,
		globalFilterFn: (row, _, filterValue: string) => {
			const userName = row.original.user.fullname.toLowerCase()
			return userName.includes(filterValue.toLowerCase())
		},

		state: {
			sorting,
			globalFilter,
		},
	})
	return { table, columnSize: columns.length, setGlobalFilter }
}
