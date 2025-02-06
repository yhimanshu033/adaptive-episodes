import React from 'react'

import { ERole } from '@/types/admin-types'

export default function AuthWrapper({
	children,
}: {
	children: React.ReactNode
	role?: ERole
}) {
	return children
}
