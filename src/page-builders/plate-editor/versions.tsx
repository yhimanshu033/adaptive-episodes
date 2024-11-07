import React, { useState } from 'react'
import { statuses } from '@/constants/episodes-constants'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const Versions = () => {
	const [currentStage, setCurrentStage] = useState<number>(1)
	const [selectedStage, setSelectedStage] = useState<number | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const handleSelect = (value: string) => {
		setSelectedStage(parseInt(value))
		setIsDialogOpen(true)
	}

	const handleConfirm = () => {
		if (selectedStage !== null) {
			setCurrentStage(selectedStage)
			console.log('Changed to episode version', selectedStage)
		}
		setIsDialogOpen(false)
	}

	const handleCancel = () => {
		setSelectedStage(null)
		setIsDialogOpen(false)
	}

	return (
		<>
			<Select value={currentStage.toString()} onValueChange={handleSelect}>
				<SelectTrigger className="gap-2">
					<SelectValue placeholder="Version" />
				</SelectTrigger>
				<SelectContent>
					{statuses.map((status, index) => (
						<SelectItem
							disabled={index < currentStage - 1 || index > currentStage}
							key={index}
							value={(index + 1).toString()}
						>
							{status}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogTitle>Confirm Selection</DialogTitle>
					<p>
						Are you sure you want to switch to{' '}
						{selectedStage && statuses[selectedStage - 1]}?
					</p>
					<DialogFooter>
						<Button variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
						<Button onClick={handleConfirm}>Confirm</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default Versions
