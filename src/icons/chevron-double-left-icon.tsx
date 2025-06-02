import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const ChevronDoubleLeftIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Chevron Double Left icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M18 17L13 12L18 7"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
				strokeLinejoin="round"
			/>
			<path
				d="M11 17L6 12L11 7"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
				strokeLinejoin="round"
			/>
		</svg>
	</AccessibleIcon>
)

export default ChevronDoubleLeftIcon
