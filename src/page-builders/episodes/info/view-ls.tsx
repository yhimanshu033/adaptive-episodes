import React, { useMemo } from 'react'
import useLSSheetQuery from '@/hooks/mutation/use-ls-sheet'
import { CrossIcon } from '@/icons/cross-icon'
import LsTabs from '@/page-builders/episodes/dialogs/ls-tabs'
import { Table2 } from 'lucide-react'

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/aural-ui/dialog'
import { iconButtonVariants } from '@/components/aural-ui/icon-button'
import IfElse, { Else, If } from '@/components/if-else'
import { ToolbarButton } from '@/components/plate-ui/toolbar'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { parseInputLSMapping } from '@/lib/utils/helpers'

export default function ViewLS() {
	const { data, isPending } = useLSSheetQuery()
	const { initialStoryData } = useEpisodeTableContext()

	const parsedData = useMemo(() => {
		if (!data) {
			return
		}
		return parseInputLSMapping(data)
	}, [data])

	if (!isPending) {
		return null
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<ToolbarButton tooltip="View LS Sheet">
					<Table2 />
				</ToolbarButton>
			</DialogTrigger>
			<DialogContent
				showCloseButton={false}
				noise="none"
				opacity="high"
				className="bg-fm-divider-secondary-alpha-80/50 h-[80vh] min-w-[90vw] gap-0 overflow-y-auto p-0 pb-6"
			>
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between gap-4 px-6 py-4">
						LS Sheet
						<DialogClose
							className={iconButtonVariants({
								variant: 'ghost',
								size: 'small',
								shape: 'square',
							})}
						>
							<CrossIcon className="h-4 w-4" />
						</DialogClose>
					</DialogTitle>
				</DialogHeader>
				<IfElse condition={!!parsedData?.data}>
					<If>
						<LsTabs
							tableData={parsedData?.data || {}}
							viewOnly
							sequence={parsedData?.sequence || {}}
							story={initialStoryData}
						/>
					</If>
					<Else>
						<DialogDescription>LS sheet not found!</DialogDescription>
					</Else>
				</IfElse>
			</DialogContent>
		</Dialog>
	)
}
