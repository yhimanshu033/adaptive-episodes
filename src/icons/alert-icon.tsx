import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const AlertIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Alert icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="currentColor"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0.789062 13.3335L8.00074 1.1875L15.2125 13.3335H0.789062ZM8.5 6.00016V9.6668H7.5V6.00016H8.5ZM7.5 10.3335H8.5V11.3335H7.5V10.3335Z"
			/>
		</svg>
	</AccessibleIcon>
)
