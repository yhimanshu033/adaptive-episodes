'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import useIndexedDbMutations from '@/hooks/mutation/use-indexed-db-mutations'
import { ColorPicker } from '@/page-builders/settings/color-picker'
import { PromptEditor } from '@/page-builders/settings/prompt-editor'
import { UserInfo } from '@/page-builders/settings/user-info'
import { ArrowLeft, Trash } from 'lucide-react'

import IfElse from '@/components/if-else'
import LogOutButton from '@/components/log-out'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner'

export default function SettingsPage() {
	const router = useRouter()

	const {
		clearDbMutation: { isPending, mutate },
	} = useIndexedDbMutations()
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
				<div className="flex justify-end gap-4">
					<Button
						variant="outline"
						size="icon"
						tooltip="Clear Data"
						onClick={() => mutate()}
					>
						<IfElse condition={isPending} if={<Spinner />} else={<Trash />} />
					</Button>
					<LogOutButton variant="default" className="self-end" />
				</div>
			</div>
		</div>
	)
}
