import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const FileChartIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="File Chart icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M8.5 17.25V15.75M12 17.25V12.75M15.5 17.25V14.75M12.75 3.25068V9.25H18.7475M4.75 2.75H12.75L19.25 9.25V21.25H4.75V2.75Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
