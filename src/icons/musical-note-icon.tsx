import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const MusicalNoteIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => {
	return (
		<AccessibleIcon label="Musical Note Icon">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="13"
				height="12"
				viewBox="0 0 13 12"
				fill="none"
				{...props}
			>
				<path
					d="M5.375 9.375C5.375 10.0654 4.70343 10.625 3.875 10.625C3.04657 10.625 2.375 10.0654 2.375 9.375C2.375 8.68464 3.04657 8.125 3.875 8.125C4.70343 8.125 5.375 8.68464 5.375 9.375ZM5.375 9.375V2.875L10.6261 1.375V7.875M10.6261 7.875C10.6261 8.56536 9.95453 9.125 9.1261 9.125C8.29767 9.125 7.6261 8.56536 7.6261 7.875C7.6261 7.18464 8.29767 6.625 9.1261 6.625C9.95453 6.625 10.6261 7.18464 10.6261 7.875Z"
					stroke="currentColor"
					strokeWidth="1.125"
				/>
			</svg>
		</AccessibleIcon>
	)
}
