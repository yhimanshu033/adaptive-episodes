import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const FilterBarRowIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Filter Row Bar Icon">
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			stroke="currentColor"
			{...props} // Accepts className, strokeWidth, etc.
		>
			<path
				d="M2.75 4.75H21.25M8.75 19.25H15.25M5.75 12H18.25"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
