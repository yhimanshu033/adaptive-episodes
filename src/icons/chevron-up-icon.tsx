import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const ChevronUpIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Chevron Up Icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M18 15L12 9L6 15"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
				strokeLinejoin="round"
			/>
		</svg>
	</AccessibleIcon>
)

export default ChevronUpIcon
