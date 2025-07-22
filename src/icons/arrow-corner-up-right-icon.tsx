import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const ArrowCornerUpRightIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Arrow Corner Up Right icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			{...props}
		>
			<path
				d="M2.8125 14.25V6.375H14.4375M12.1875 9.375L15.1875 6.375L12.1875 3.375"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
