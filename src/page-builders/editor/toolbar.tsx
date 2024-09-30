import React, { useState } from 'react'
import { fontSizes, sidebarSections, tools } from '@/constants/editor-constants'
import useEditorStore, {
	handleToolStates,
	toggleTranslation,
	updateActiveSidebar,
} from '@/store/editor-store'
import { Book } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

const Toolbar = ({
	editorRef,
}: {
	editorRef: React.RefObject<HTMLDivElement>
}) => {
	const { toolsState, isTranslationOpen, activeSidebar, isSidebarOpen } =
		useEditorStore()
	const [toolValue, setToolValue] = useState({ fontSize: '3' })

	const handleFormat = (command: string, value?: string) => {
		document.execCommand(command, false, value)
		if (value) {
			setToolValue((prev) => ({
				...prev,
				[command]: value,
			}))
		} else handleToolStates()
		editorRef.current?.focus()
	}

	return (
		<div className="flex gap-2 rounded-md border-b bg-background-editor p-2 shadow-editor">
			{tools.map(({ icon: Icon, type }) => (
				<Button
					key={type}
					variant={toolsState[type] ? 'default' : 'outline'}
					size="icon"
					onClick={() => handleFormat(type)}
				>
					<Icon className="size-4" />
				</Button>
			))}
			<Select
				value={toolValue.fontSize}
				onValueChange={(val) => handleFormat('fontSize', val)}
			>
				<SelectTrigger className="w-[80px]">
					<SelectValue placeholder="Font size" />
				</SelectTrigger>
				<SelectContent>
					{fontSizes.map((size) => (
						<SelectItem key={size} value={size}>
							{size}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<div>
				<Separator orientation="vertical" />
			</div>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button
							variant={isTranslationOpen ? 'default' : 'outline'}
							size="icon"
							onClick={toggleTranslation}
						>
							<Book className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Translation</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			{sidebarSections.map(({ name, icon: Icon, desc }) => (
				<TooltipProvider key={name}>
					<Tooltip>
						<TooltipTrigger>
							<Button
								variant={
									activeSidebar === name && isSidebarOpen
										? 'default'
										: 'outline'
								}
								onClick={() => updateActiveSidebar(name)}
								size="icon"
							>
								<Icon className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{desc}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			))}
		</div>
	)
}

export default Toolbar
