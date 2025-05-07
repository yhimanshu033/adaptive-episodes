'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ColorPicker } from '@/page-builders/settings/color-picker'
import { PromptEditor } from '@/page-builders/settings/prompt-editor'
import { UserInfo } from '@/page-builders/settings/user-info'
import { ArrowLeft } from 'lucide-react'

import LogOutButton from '@/components/log-out'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
	const router = useRouter()
	return (
		<div id="settings-page" className="container mx-auto space-y-8 p-6">
			<div className="flex gap-2">
				<Button variant="ghost" onClick={() => router.back()} tooltip="Go back">
					<ArrowLeft />
				</Button>
				<h1 className="mb-6 text-3xl font-bold">User Settings</h1>
			</div>
			<UserInfo />
			<div className="space-y-6">
				<PromptEditor />
				<ColorPicker />
				<div className="flex justify-end">
					<LogOutButton variant="default" className="self-end" />
				</div>
			</div>
		</div>
	)
}
