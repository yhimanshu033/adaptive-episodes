'use client'

import React, { useEffect } from 'react'
import { COMMON } from '@/constants/german-constants'
import {
	GDRIVE_BROADCAST_CHANNEL,
	GDRIVE_SUCCESS_MESSAGE,
} from '@/constants/global-constants'

export default function AuthSuccess() {
	useEffect(() => {
		setTimeout(() => {
			const channel = new BroadcastChannel(GDRIVE_BROADCAST_CHANNEL)
			channel.postMessage(GDRIVE_SUCCESS_MESSAGE)
		}, 1000)
	}, [])

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6">
			<h2 className="text-4xl font-semibold">{COMMON.AUTH_SUCCESS}</h2>
			<h4>{COMMON.PUSH_TO_DRIVE}</h4>
		</div>
	)
}
