import React from 'react'
import ConfigurationDialogContent, {
	ConfigurationDialogContentProps,
} from '@/page-builders/plate-editor/configuration-dialog/content'
import { Settings } from 'lucide-react'

import { Dialog, DialogTrigger } from '@/components/aural-ui/dialog'
import { IconButton } from '@/components/aural-ui/icon-button'

interface ConfigurationDialogTriggerProps
	extends ConfigurationDialogContentProps {
	children?: React.ReactNode
}
export default function ConfigurationDialogTrigger({
	children,
	...dialogContentProps
}: ConfigurationDialogTriggerProps) {
	const trigger = children ?? (
		<IconButton
			label="Configure"
			className="shrink-0"
			size="small"
			variant="outlined"
			tooltip="Configure"
			icon={<Settings />}
		/>
	)

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<ConfigurationDialogContent {...dialogContentProps} />
		</Dialog>
	)
}
