import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const LayoutRightIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Layout Right Icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			{...props}
		>
			<path
				d="M13.5 2.5H14.25V1.75L13.5 1.75V2.5ZM2.5 2.5L2.5 1.75L1.75 1.75L1.75 2.5L2.5 2.5ZM2.5 13.5H1.75L1.75 14.25H2.5V13.5ZM13.5 13.5V14.25H14.25V13.5H13.5ZM13.5 2.5V1.75L2.5 1.75L2.5 2.5L2.5 3.25L13.5 3.25V2.5ZM2.5 2.5L1.75 2.5L1.75 13.5H2.5H3.25L3.25 2.5L2.5 2.5ZM2.5 13.5V14.25H13.5V13.5V12.75H2.5V13.5ZM13.5 13.5H14.25V2.5H13.5H12.75V13.5H13.5Z"
				fill="currentColor"
			/>
			<path
				d="M8.75 13.5V14.25H10.25V13.5H8.75ZM10.25 2.5V1.75H8.75V2.5H10.25ZM9.5 13.5H10.25V2.5H9.5H8.75V13.5H9.5Z"
				fill="currentColor"
			/>
		</svg>
	</AccessibleIcon>
)
