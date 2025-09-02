import React from 'react'
import useLSSheetQuery from '@/hooks/mutation/use-ls-sheet'
import { CrossIcon } from '@/icons/cross-icon'
import LSTableEditor from '@/page-builders/episodes/dialogs/ls-editor'
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
import { parseInputLSMapping } from '@/lib/utils/helpers'

export default function ViewLS() {
	const { data } = useLSSheetQuery()
	if (!data) {
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
				className="bg-fm-divider-secondary-alpha-80/50 h-[80vh] w-[90vw] gap-0 p-0 pb-6 max-2xl:max-w-[90vw]"
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
				<IfElse condition={!!data?.ls_mapping}>
					<If>
						<LSTableEditor
							tableData={data ? parseInputLSMapping(data) : []}
							viewOnly
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
