'use client'

import React from 'react'

import ProjectHeader from '@/components/project-header'

import AddMember from './add-member'
import AdminAlert from './admin-alert'
import MembersTable from './members-table'

const ManageProject = () => {
	return (
		<main id="edit-roles-page" className="flex flex-1 flex-col">
			<ProjectHeader />
			<div className="container">
				<section className="mt-3 space-y-1">
					<h1 className="text-3xl font-bold">Project management</h1>
					<p className="text-muted-foreground">
						Manage project members and permissions here.
					</p>
				</section>

				<section className="my-6">
					<AddMember />
					<MembersTable />
					<AdminAlert />
				</section>
			</div>
		</main>
	)
}

export default ManageProject
