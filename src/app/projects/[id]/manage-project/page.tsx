import React from 'react'
import { redirect } from 'next/navigation'
import ManageProject from '@/page-builders/manage-project'
import { getServerSession } from 'next-auth'

import { isInternalUser } from '@/lib/utils/helpers'

export default async function Page() {
	const session = await getServerSession()

	if (!isInternalUser(session)) redirect('/projects')
	return <ManageProject />
}
