'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function BackButton() {
	const router = useRouter()
	return (
		<Button onClick={() => router.back()}>
			<ChevronLeft />
		</Button>
	)
}
