import React from 'react'

import { Button } from '@/components/ui/button'

export default function RenderPageButtons({
	currentPage,
	handlePageChange,
	totalPages,
}: {
	currentPage: number
	handlePageChange: (val: number) => void
	totalPages: number
}) {
	const showEllipsis = totalPages > 7
	if (showEllipsis) {
		if (currentPage <= 4) {
			return (
				<>
					{Array.from({ length: 5 }).map((_, i) => (
						<Button
							key={i + 1}
							variant={currentPage === i + 1 ? 'default' : 'outline'}
							onClick={() => handlePageChange(i + 1)}
							className="size-10"
						>
							{i + 1}
						</Button>
					))}
					<span className="px-2">...</span>
					<Button
						variant="outline"
						onClick={() => handlePageChange(totalPages)}
						className="size-10"
					>
						{totalPages}
					</Button>
				</>
			)
		}

		if (currentPage >= totalPages - 3) {
			return (
				<>
					<Button
						variant="outline"
						onClick={() => handlePageChange(1)}
						className="size-10"
					>
						1
					</Button>
					<span className="px-2">...</span>
					{Array.from({ length: 5 }).map((_, i) => (
						<Button
							key={totalPages - 4 + i}
							variant={
								currentPage === totalPages - 4 + i ? 'default' : 'outline'
							}
							onClick={() => handlePageChange(totalPages - 4 + i)}
							className="size-10"
						>
							{totalPages - 4 + i}
						</Button>
					))}
				</>
			)
		}

		return (
			<>
				<Button
					variant="outline"
					onClick={() => handlePageChange(1)}
					className="size-10"
				>
					1
				</Button>
				<span className="px-2">...</span>
				{[currentPage - 1, currentPage, currentPage + 1].map((page) => (
					<Button
						key={page}
						variant={currentPage === page ? 'default' : 'outline'}
						onClick={() => handlePageChange(page)}
						className="size-10"
					>
						{page}
					</Button>
				))}
				<span className="px-2">...</span>
				<Button
					variant="outline"
					onClick={() => handlePageChange(totalPages)}
					className="size-10"
				>
					{totalPages}
				</Button>
			</>
		)
	}

	return Array.from({ length: totalPages }).map((_, i) => (
		<Button
			key={i + 1}
			variant={currentPage === i + 1 ? 'default' : 'outline'}
			onClick={() => handlePageChange(i + 1)}
			className="size-10"
		>
			{i + 1}
		</Button>
	))
}
