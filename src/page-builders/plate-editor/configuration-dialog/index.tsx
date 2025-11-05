'use client'

import React from 'react'
import ConfigurationDialogContent from '@/page-builders/plate-editor/configuration-dialog/content'
import { ConfigurationStore } from 'unified-editor'

import { Dialog } from '@/components/aural-ui/dialog'

export default function ConfigurationDialogGlobal() {
	const { configurationDialogOpen } = ConfigurationStore.useConfigurationStore()
	return (
		<Dialog
			open={configurationDialogOpen}
			onOpenChange={ConfigurationStore.setConfigurationDialogOpen}
		>
			<ConfigurationDialogContent />
		</Dialog>
	)
}
