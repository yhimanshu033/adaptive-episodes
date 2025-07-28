import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const ArrowCornerUpLeftIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Arrow Corner Up Left icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			{...props}
		>
			<path
				d="M15.1875 14.25V6.375H3.5625M5.8125 9.375L2.8125 6.375L5.8125 3.375"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
