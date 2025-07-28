import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const NotesIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Notes Icon">
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			stroke="currentColor"
			strokeLinecap="square"
			{...props}
		>
			<path d="M3.25 12H5.25" />
			<path d="M9.75 12H12.25" />
			<path d="M9.75 8.25H14.25" />
			<path d="M3.25 8.25H5.25" />
			<path d="M3.25 15.75H5.25" />
			<path d="M4.25 3.25H19.75V20.75H4.25V3.25Z" />
		</svg>
	</AccessibleIcon>
)
