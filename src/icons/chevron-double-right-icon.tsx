import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const ChevronDoubleRightIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Chevron Double Right icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M6 7L11 12L6 17"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
				strokeLinejoin="round"
			/>
			<path
				d="M13 7L18 12L13 17"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
				strokeLinejoin="round"
			/>
		</svg>
	</AccessibleIcon>
)

export default ChevronDoubleRightIcon
