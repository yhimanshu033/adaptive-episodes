'use client'

import React from 'react'
import { setSidebar } from '@/store/plate-store'
import { FileText } from 'lucide-react'

import { ToolbarButton } from './toolbar'

export function OutlineToolbarButton() {
	return (
		<ToolbarButton
			tooltip="Outline"
			onClick={() => setSidebar('outline', true)}
		>
			<FileText />
		</ToolbarButton>
	)
}
