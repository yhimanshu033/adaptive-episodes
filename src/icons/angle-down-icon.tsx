import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const AngleDownIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Arrow Down icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1"
				d="m19 9-7 7-7-7"
			/>
		</svg>
	</AccessibleIcon>
)
