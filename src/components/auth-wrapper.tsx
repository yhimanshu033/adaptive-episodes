'use client'

import React from 'react'

import useProjectId from '@/providers/project-id-provider'

import { ERole } from '@/types/admin-types'

export default function AuthWrapper({
	children,
	role = ERole.READER,
}: {
	children: React.ReactNode
	role?: ERole
}) {
	const { isAccessible } = useProjectId()
	if (!isAccessible(role)) {
		return null
	}
	return children
}
