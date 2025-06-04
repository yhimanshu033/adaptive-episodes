import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const PlusIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Plus icon">
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M12 6.75V12M12 12V17.25M12 12H6.75M12 12H17.25"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
