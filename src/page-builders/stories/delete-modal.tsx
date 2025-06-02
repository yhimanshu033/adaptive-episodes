'use client'

import React, { ReactNode, useState } from 'react'
import { TrashIcon } from '@/icons/trash-icon'

import { Button } from '@/components/aural-ui/button'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/aural-ui/dialog'

interface IDeleteModalProps {
	children: ReactNode
	onPrimaryClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	subTitle: string
	title: string
}

const DeleteModal = ({
	onPrimaryClick,
	children,
	title,
	subTitle,
}: IDeleteModalProps) => {
	const [isOpen, setIsOpen] = useState(false)

	const onOpenChange = (val: boolean) => {
		setIsOpen(val)
	}

	const handlePrimaryClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		setIsOpen(false)
		onPrimaryClick(e)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				variant="negative"
				className="flex flex-col items-center px-6 py-8 text-center"
				glass={false}
			>
				<DialogTitle className="sr-only">Delete</DialogTitle>
				<div className="flex flex-col items-center gap-8">
					<TrashIcon height={44} width={44} className="text-fm-negative" />
					<div className="space-y-2">
						<h1 className="text-xl">{title}</h1>
						<p className="text-fm-tertiary">{subTitle}</p>
					</div>
					<div className="flex w-full flex-col gap-5">
						<Button variant="secondary" onClick={handlePrimaryClick}>
							Delete
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setIsOpen(false)
							}}
						>
							Cancel
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default DeleteModal
