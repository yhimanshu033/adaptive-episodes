import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const PageSearchIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Page Search icon">
		<svg
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			stroke="currentColor"
			{...props}
		>
			<path
				d="M8.54232 17.7083H3.95898V2.29163H16.0423V8.95829M17.084 17.9166L15.9781 16.7751M15.9781 16.7751C16.5332 16.211 16.8757 15.4372 16.8757 14.5833C16.8757 12.8574 15.4765 11.4583 13.7507 11.4583C12.0248 11.4583 10.6257 12.8574 10.6257 14.5833C10.6257 16.3092 12.0248 17.7083 13.7507 17.7083C14.6227 17.7083 15.4113 17.3511 15.9781 16.7751Z"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
