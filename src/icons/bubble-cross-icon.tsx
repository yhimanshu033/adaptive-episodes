import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const BubbleCrossIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Bubble Cross icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M14.1213 8.85314L12 10.9745M12 10.9745L9.87868 13.0958M12 10.9745L9.87868 8.85314M12 10.9745L14.1213 13.0958M3.75 3.75H20.25V18.25H15.0155L11.9979 20.75L9.0155 18.25H3.75V3.75Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
