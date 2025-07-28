import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const TextColorIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Text Color icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			{...props}
		>
			<path
				d="M15.9375 5.57812C15.9375 6.66544 15.0141 7.6875 13.875 7.6875C12.7359 7.6875 11.8125 6.66544 11.8125 5.57812C11.8125 4.17188 13.875 2.0625 13.875 2.0625C13.875 2.0625 15.9375 4.17188 15.9375 5.57812Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M2.0625 15.1875L7.5 3.5625L12.9375 15.1875"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
			<path
				d="M4.5 11.0625H10.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
