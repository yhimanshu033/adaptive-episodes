import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const StopIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Stop icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
		</svg>
	</AccessibleIcon>
)
