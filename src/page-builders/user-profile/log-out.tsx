'use client'

import React, { useState } from 'react'
import { ArrowBoxLeftIcon } from '@/icons/arrow-box-left-icon'
import { FeatureShineIcon } from '@/icons/feature-shine-icon'
import { signOut } from 'next-auth/react'

import { Button } from '@/components/aural-ui/button'

export default function LogOutButton() {
	const [isLoading, setIsLoading] = useState(false)

	const handleLogout = async () => {
		setIsLoading(true)
		try {
			await signOut()
		} catch (error) {
			console.error({ error })
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			variant="text"
			disabled={isLoading}
			onClick={(e: React.MouseEvent) => {
				e.stopPropagation()
				void handleLogout()
			}}
			className="text-fm-primary font-fm-text w-full p-0"
			leftIcon={
				isLoading ? (
					<FeatureShineIcon height={24} width={24} />
				) : (
					<ArrowBoxLeftIcon />
				)
			}
			innerClassName="justify-start !p-0 text-fm-lg"
		>
			Logout
		</Button>
	)
}
