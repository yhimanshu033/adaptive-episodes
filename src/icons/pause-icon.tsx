import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const PauseIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Pause icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			{...props}
		>
			<path
				d="M4.75 3.75H9.25V20.25H4.75V3.75Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M14.75 3.75H19.25V20.25H14.75V3.75Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
		</svg>
	</AccessibleIcon>
)
