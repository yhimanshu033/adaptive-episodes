import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const ArrowRightUpIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Arrow Right Up icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M18.25 15.25V5.75H8.75M6 18L17.6002 6.39983"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
