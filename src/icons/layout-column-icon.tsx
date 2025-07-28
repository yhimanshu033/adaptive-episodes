import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const LayoutColumnIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Layout Column Icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			{...props}
		>
			<path
				d="M15.1875 2.8125H15.9375V2.0625H15.1875V2.8125ZM15.1875 15.1875V15.9375H15.9375V15.1875H15.1875ZM2.8125 15.1875H2.0625V15.9375H2.8125V15.1875ZM2.8125 2.8125V2.0625H2.0625V2.8125H2.8125ZM15.1875 2.8125H14.4375V15.1875H15.1875H15.9375V2.8125H15.1875ZM15.1875 15.1875V14.4375H2.8125V15.1875V15.9375H15.1875V15.1875ZM2.8125 15.1875H3.5625V2.8125H2.8125H2.0625V15.1875H2.8125ZM2.8125 2.8125V3.5625H15.1875V2.8125V2.0625H2.8125V2.8125Z"
				fill="currentColor"
			/>
			<path d="M9 2.8125H8.25V15.1875H9H9.75V2.8125H9Z" fill="currentColor" />
		</svg>
	</AccessibleIcon>
)
