import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const VerticalMenuIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Vertical Menu icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M11 2.75H13V4.75H11V2.75Z"
				className="fill-current stroke-current"
			/>
			<path d="M13 11H11V13H13V11Z" className="fill-current stroke-current" />
			<path
				d="M11 19.25H13V21.25H11V19.25Z"
				className="fill-current stroke-current"
			/>
		</svg>
	</AccessibleIcon>
)
