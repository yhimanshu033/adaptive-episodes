import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const SkipForwardIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Skip forward icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="36"
			height="36"
			viewBox="0 0 36 36"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			{...props}
		>
			<path
				d="M6 5.86964V30.1299L25.3696 17.9997L6 5.86964Z"
				fill="currentColor"
			/>
			<path
				d="M30.0002 5.99976H27.7502V29.9997H30.0002V5.99976Z"
				fill="currentColor"
			/>
		</svg>
	</AccessibleIcon>
)
