import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const FileTextIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="File Text Icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			{...props}
		>
			<path
				d="M6.5625 7.31055H11.4375M6.5625 10.3105H9.9375M9 3.18555V1.68555M12.1875 3.18555V1.68555M5.8125 3.18555V1.68555M3.1875 2.45638H14.8125V15.5605H3.1875V2.45638Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
