import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const ImportLeftArrowFolderIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Import Left Arrow Folder Icon">
		<svg
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			stroke="currentColor"
			{...props}
		>
			<path
				d="M1.8335 5.83268V12.8327H14.1668V3.16602H10.5002"
				strokeLinecap="square"
			/>
			<path
				d="M1.8335 3.16602H4.66683C6.50778 3.16602 8.00016 4.6584 8.00016 6.49935V9.99935M8.00016 9.99935L10.5002 7.49935M8.00016 9.99935L5.50016 7.49935"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
