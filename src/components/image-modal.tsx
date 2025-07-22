/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { DialogTitle } from '@radix-ui/react-dialog'
import { ZoomInIcon } from 'lucide-react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export default function ImageModal(
	props: React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	>
) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="group relative cursor-pointer">
					<img
						src="/placeholder.svg"
						alt="Image"
						className="aspect-3/2 w-full overflow-hidden rounded-lg object-cover transition-all group-hover:scale-105"
						{...props}
					/>
					<div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
						<ZoomInIcon className="size-10 text-white" />
					</div>
				</div>
			</DialogTrigger>
			<DialogContent className="max-w-4xl">
				<DialogTitle className="text-xl font-semibold">View Image</DialogTitle>
				<img
					src={props.src}
					alt="Image"
					className="aspect-4/3 w-full overflow-hidden rounded-lg object-cover"
				/>
			</DialogContent>
		</Dialog>
	)
}
