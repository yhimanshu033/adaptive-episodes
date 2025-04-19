import React from 'react'
import Link from 'next/link'
import { Eye, Search } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { IconLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'

interface IReScanProps {
	handleScanEpisode: () => void
	isFetching: boolean
	isWriter: boolean
	sheetURL: string
	updateLOCPending: boolean
}

export default function ReScan({
	handleScanEpisode,
	isFetching,
	isWriter,
	sheetURL,
	updateLOCPending,
}: IReScanProps) {
	return (
		<div className="flex items-center justify-end gap-2 p-4">
			<If condition={!!sheetURL && isWriter}>
				<Button size="icon" tooltip="Open LOC sheet" asChild>
					<Link href={sheetURL} target="_blank" rel="noopener noreferrer">
						<Eye />
					</Link>
				</Button>
			</If>
			<IfElse condition={updateLOCPending}>
				<If>
					<IconLoader />
				</If>
				<Else>
					<Button
						onClick={() => void handleScanEpisode()}
						disabled={!isWriter || isFetching}
						className="w-fit gap-2"
					>
						<Search size={16} /> Scan
					</Button>
				</Else>
			</IfElse>
		</div>
	)
}
