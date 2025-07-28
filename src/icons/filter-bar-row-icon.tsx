import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const FilterBarRowIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Filter Row Bar Icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			{...props}
		>
			<path
				d="M1.83301 3.16467H14.1663M5.83301 12.8313H10.1663M3.83301 7.99801H12.1663"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
