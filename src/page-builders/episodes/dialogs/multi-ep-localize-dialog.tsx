import React from 'react'
import Link from 'next/link'
import { ArrowRightUpIcon } from '@/icons/arrow-right-up-icon'

import { Button, ButtonProps } from '@/components/aural-ui/button'
import { Typography } from '@/components/aural-ui/typography'
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'

export default function MultiEpLocalizeDialog({
	url,
	...props
}: { url: string } & ButtonProps &
	React.ComponentPropsWithoutRef<typeof Button>) {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button tooltip="View in Full Screen" variant="outline" {...props} />
			</DrawerTrigger>
			<DrawerContent>
				<DrawerTitle className="flex items-center justify-between px-6 pb-4">
					<Typography>Multi-Episode Find and Replace</Typography>
					<Link href={url} target="_blank">
						<ArrowRightUpIcon />
					</Link>
				</DrawerTitle>
				<iframe src={url} className="h-[90svh]" />
			</DrawerContent>
		</Drawer>
	)
}
