'use client'

import React from 'react'
import ConfigurationDialogContent from '@/page-builders/plate-editor/configuration-dialog/content'
import useConfigurationStore, {
	setConfigurationDialogOpen,
} from '@/store/configuration-store'

import { Dialog } from '@/components/aural-ui/dialog'

export default function ConfigurationDialogGlobal() {
	const { configurationDialogOpen } = useConfigurationStore()
	return (
		<Dialog
			open={configurationDialogOpen}
			onOpenChange={setConfigurationDialogOpen}
		>
			<ConfigurationDialogContent />
		</Dialog>
	)
}
