'use client'

import React from 'react'
import usePlateStore, { setSidebar } from '@/store/plate-store'
import { FileText } from 'lucide-react'

import { ToolbarButton } from './toolbar'

export function OutlineToolbarButton() {
	const sidebar = usePlateStore((state) => state.sidebar)
	return (
		<ToolbarButton
			variant={sidebar === 'outline' ? 'active' : 'default'}
			tooltip="Outline"
			onClick={() => setSidebar('outline', true)}
		>
			<FileText />
		</ToolbarButton>
	)
}
