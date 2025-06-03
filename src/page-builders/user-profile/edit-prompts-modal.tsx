'use client'

import React, { ReactNode, useState } from 'react'

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/aural-ui/dialog'

interface IEditPromptsModalProps {
	children: ReactNode
}

const EditPromptsModal = ({ children }: IEditPromptsModalProps) => {
	const [isOpen, setIsOpen] = useState(false)
	// const

	const onOpenChange = (val: boolean) => {
		setIsOpen(val)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="h-181 w-138 px-6 py-8" glass={false}>
				<DialogTitle className="sr-only">
					Edit prompts across editor
				</DialogTitle>
				<div>{/* content of edit prompt */}</div>
			</DialogContent>
		</Dialog>
	)
}

export default EditPromptsModal
