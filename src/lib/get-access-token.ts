import { getServerSession as getUserSession } from 'next-auth'

import authOptions from '@/lib/next-auth-options'

const getServerSession = async () => {
	return await getUserSession(authOptions)
}

export default getServerSession
