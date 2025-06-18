import React from 'react'

import { Button } from '@/components/aural-ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'

import { TButtonWithTooltipProps } from '@/types/common'

export default function MultiEpLocalizeDialog({
	url,
	...props
}: { url: string } & TButtonWithTooltipProps) {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline" {...props} />
			</DrawerTrigger>
			<DrawerContent>
				<DrawerTitle />
				<iframe src={url} className="h-[90svh]" />
			</DrawerContent>
		</Drawer>
	)
}
