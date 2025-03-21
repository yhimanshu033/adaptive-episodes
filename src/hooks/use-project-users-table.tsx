import React, { useState } from 'react'
import UserInfo from '@/page-builders/episodes/user-info'
import { setDeleteMemberMail } from '@/store/admin-store'
import {
	ColumnDef,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { EProjectUsersHeaderKeys, ERole, MemberData } from '@/types/admin-types'

export const useProjectUsersTable = (members: MemberData[]) => {
	const [sorting, setSorting] = useState<SortingState>([])

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
			cell: ({ row }) => row.original.role,
		},
		{
			accessorKey: EProjectUsersHeaderKeys.DELETE,
			header: 'Revoke Access',
			cell: ({ row }) =>
				row.original.role !== ERole.ADMIN ? (
					<Button
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
		onSortingChange: setSorting,
		state: {
			sorting,
		},
	})
	return { table, columnSize: columns.length }
}
