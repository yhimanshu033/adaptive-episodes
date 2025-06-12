import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const ImportFolderIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Import Folder icon">
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			stroke="currentColor"
			{...props}
		>
			<path d="M21.25 8.75V19.25H2.75V4.75H8.25" strokeLinecap="square" />
			<path
				d="M21.25 4.75H17C14.2386 4.75 12 6.98858 12 9.75V15M12 15L8.25 11.25M12 15L15.75 11.25"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
