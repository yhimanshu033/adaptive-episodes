import React from 'react'
import { COMMON } from '@/constants/german-constants'

export default function AuthSuccess() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6">
			<h2 className="text-4xl font-semibold">{COMMON.AUTH_SUCCESS}</h2>
			<h4>{COMMON.PUSH_TO_DRIVE}</h4>
		</div>
	)
}
