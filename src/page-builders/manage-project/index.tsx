'use client'

import React, { useCallback } from 'react'
import { LOC_SHEET_SERVICE_ACCOUNT } from '@/constants/user-constants'
import UpdateDriveFolder from '@/page-builders/manage-project/update-gdrive-folder'
import UpdateSlackChannel from '@/page-builders/manage-project/update-slack-channel'
import { Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import ProjectHeader from '@/components/project-header'
import { Button } from '@/components/ui/button'

import { EFolderType } from '@/types/admin-types'

import AdminAlert from './admin-alert'
import BaseScriptExtension from './base-script-extension'
import MembersTable from './members-table'
import UpdateLOCSheet from './update-loc-sheet'

const ManageProject = () => {
	const dict = useTranslations('common')
	const handleCopy = useCallback(() => {
		void navigator.clipboard.writeText(LOC_SHEET_SERVICE_ACCOUNT)
		toast.info(dict('copiedToClipBoard'))
	}, [dict])

	return (
		<main id="edit-roles-page" className="flex flex-1 flex-col">
			<ProjectHeader />
			<div className="container mb-6 space-y-8">
				<section className="mt-3 space-y-1">
					<h1 className="text-3xl font-bold">Project management</h1>
					<p className="text-muted-foreground">
						Manage project members and permissions here. Note: Admin roles
						cannot be modified or removed.
					</p>
				</section>
				<section>
					<MembersTable />
				</section>
				<section className="space-y-4">
					<div className="space-y-1">
						<h1 className="text-xl font-bold">Localization Sheet</h1>
						<p className="text-muted-foreground">
							Provide the Google Sheet link to sync localization data and enable
							sheet updates through the app.
						</p>
					</div>

					<div className="rounded-md bg-muted p-4 text-sm">
						<p className="text-muted-foreground">
							<strong>Note:</strong> Editor access must be granted to
						</p>
						<p className="flex items-center gap-2 font-mono text-xs text-primary">
							{LOC_SHEET_SERVICE_ACCOUNT}
							<Button
								variant="ghost"
								size="icon"
								tooltip="Copy"
								asChild
								className="hover:cursor-pointer"
								onClick={handleCopy}
							>
								<Copy className="size-4" />
							</Button>
						</p>
					</div>

					<UpdateLOCSheet />
				</section>
				<section className="space-y-4">
					<div className="space-y-1">
						<h1 className="text-xl font-bold">Google Drive Folder</h1>
						<p className="text-muted-foreground">
							Provide the Google drive folder link to store the CMS Ready
							Episodes
						</p>
					</div>
					<UpdateDriveFolder folderType={EFolderType.CMS} />
				</section>
				<section className="space-y-4">
					<div className="space-y-1">
						<h1 className="text-xl font-bold">Base Script Extension</h1>
						<p className="text-muted-foreground">
							Provide the Google Drive folder link for base script extension
							reference.
						</p>
					</div>
					<div className="flex gap-2">
						<UpdateDriveFolder folderType={EFolderType.BASE_SCRIPT} />
						<BaseScriptExtension />
					</div>
				</section>
				<section className="space-y-4">
					<div className="space-y-1">
						<h1 className="text-xl font-bold">Slack Notifications</h1>
						<p className="text-muted-foreground">
							Provide the Slack Channel ID to receive notifications.
						</p>
					</div>
					<UpdateSlackChannel />
				</section>
			</div>
			<AdminAlert />
		</main>
	)
}

export default ManageProject
