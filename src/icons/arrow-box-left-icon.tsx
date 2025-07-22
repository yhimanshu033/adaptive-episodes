import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const ArrowBoxLeftIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Arrow Box Left icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M11.25 20.25H3.75L3.75 3.75L11.25 3.75M9 12L19.5 12M15.75 16.5L20.25 12L15.75 7.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
