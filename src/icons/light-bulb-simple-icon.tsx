import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const LightBulbSimpleIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Light bulb icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M8.74775 17.75V16.4838C8.33524 16.2765 7.94523 16.031 7.58239 15.7519C5.85882 14.4264 4.74805 12.3433 4.74805 10.0009C4.74805 5.99633 7.99438 2.75 11.9989 2.75C16.0035 2.75 19.2498 5.99633 19.2498 10.0009C19.2498 12.3433 18.139 14.4264 16.4155 15.7519C16.0526 16.031 15.6626 16.2765 15.2501 16.4838V17.75M8.74775 17.75V18.9988C8.74775 20.7944 10.2034 22.25 11.9989 22.25C13.7945 22.25 15.2501 20.7944 15.2501 18.9988V17.75M8.74775 17.75H15.2501"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
