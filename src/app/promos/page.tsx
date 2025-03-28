import React from 'react'
import { redirect } from 'next/navigation'
import PromosPage from '@/page-builders/promos'
import { getServerSession } from 'next-auth'

import { SessionData } from '@/types/admin-types'

const TEMP_WHITELISTED_EMAILS = [
	'richard.manning@pocketfm.com',
	'sabine.tascher@pocketfm.com',
	'charlotte.driesen@pocketfm.com',
	'elena.kern@pocketfm.com',
	'varad.prabhu@pocketfm.com',
	'ilan.benjamin@pocketfm.com',
	'thomas.kornmaier@pocketfm.com',
	'himanshu.yadav@pocketfm.com',
]
export default async function Page() {
	const session = (await getServerSession()) as SessionData

	if (!TEMP_WHITELISTED_EMAILS.includes(session.user.email)) {
		redirect('/projects')
	}

	return <PromosPage />
}
