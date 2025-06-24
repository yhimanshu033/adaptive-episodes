import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const CircleCrossIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Circle Cross Icon">
		<svg
			viewBox="0 0 18 19"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			stroke="currentColor"
			{...props}
		>
			<path
				d="M11.25 7.25L6.75 11.75M11.25 11.75L6.75 7.25M15.9375 9.5C15.9375 13.3315 12.8315 16.4375 9 16.4375C5.16852 16.4375 2.0625 13.3315 2.0625 9.5C2.0625 5.66852 5.16852 2.5625 9 2.5625C12.8315 2.5625 15.9375 5.66852 15.9375 9.5Z"
				strokeLinecap="square"
				strokeWidth="1.5"
			/>
		</svg>
	</AccessibleIcon>
)
