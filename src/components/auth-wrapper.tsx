'use client'

import React from 'react'

import useProjectId from '@/providers/project-id-provider'
import { isAuthorized } from '@/lib/utils/helpers'

import { ERole } from '@/types/admin-types'

export default function AuthWrapper({
	children,
	role = ERole.READER,
}: {
	children: React.ReactNode
	role?: ERole
}) {
	const { me } = useProjectId()
	if (!isAuthorized({ requiredRole: role, userRole: me.role })) {
		return null
	}
	return children
}
