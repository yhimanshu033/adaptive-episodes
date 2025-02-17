import React from 'react'
import { ColorPicker } from '@/page-builders/settings/color-picker'
import { PromptEditor } from '@/page-builders/settings/prompt-editor'
import { UserInfo } from '@/page-builders/settings/user-info'

import LogOutButton from '@/components/log-out'

export default function SettingsPage() {
	return (
		<div id="settings-page" className="container mx-auto space-y-8 p-6">
			<h1 className="mb-6 text-3xl font-bold">User Settings</h1>
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
