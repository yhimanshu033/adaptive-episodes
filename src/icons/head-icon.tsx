import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const HeadIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => {
	return (
		<AccessibleIcon label="Head Icon">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="17"
				viewBox="0 0 16 17"
				fill="none"
				{...props}
			>
				<path
					d="M12.1667 12.6112H9.5V14.6667H4.5C4.5 12.9371 4.65313 11.5249 3.52284 10.0875C2.88207 9.27259 2.5 8.24564 2.5 7.12967C2.5 4.48075 4.65265 2.33337 7.30808 2.33337C9.26557 2.33337 11.0679 3.2706 11.8108 5.1651C12.3315 6.49261 13.0353 7.47263 13.8333 8.66671L12.1667 9.52782V12.6112Z"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="square"
				/>
			</svg>
		</AccessibleIcon>
	)
}
