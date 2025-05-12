import React from 'react'
import useLSSheetQuery from '@/hooks/mutation/use-ls-sheet'
import LSTableEditor from '@/page-builders/episodes/dialogs/ls-editor'
import { Sheet } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { ToolbarButton } from '@/components/plate-ui/toolbar'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { parseInputLSMapping } from '@/lib/utils/helpers'

export default function ViewLS() {
	const { data } = useLSSheetQuery()
	if (!data) {
		return null
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<ToolbarButton>
					<Sheet />
				</ToolbarButton>
			</DialogTrigger>
			<DialogContent className="max-w-screen-lg">
				<DialogHeader>
					<DialogTitle>LS Sheet</DialogTitle>
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
