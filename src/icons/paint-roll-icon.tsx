import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const PaintRollIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Paint Roll icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			{...props}
		>
			<path
				d="M5.0625 5.25V7.6875H15.1875V2.8125H5.0625V5.25ZM5.0625 5.25H2.8125V9.9375H9.75V11.625M11.4375 15.9375V13.6875C11.4375 12.7555 10.682 12 9.75 12C8.81802 12 8.0625 12.7555 8.0625 13.6875V15.9375"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
