import React from 'react'

import { Button, ButtonProps } from '@/components/ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'

export default function MultiEpLocalizeDialog({
	url,
	...props
}: { url: string } & ButtonProps) {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button {...props} />
			</DrawerTrigger>
			<DrawerContent>
				<DrawerTitle />
				<iframe src={url} className="h-[90svh]" />
			</DrawerContent>
		</Drawer>
	)
}
