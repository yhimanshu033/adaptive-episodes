import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const MoonIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => {
	return (
		<AccessibleIcon label="Moon icon">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
			</svg>
		</AccessibleIcon>
	)
}
