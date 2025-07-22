import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const MessageIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Message Icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			{...props}
		>
			<path
				d="M2.8125 2.81055H15.1875V13.6855H11.2616L8.99844 15.5605L6.76163 13.6855H2.8125V2.81055Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M6.12598 7.82324C6.41077 7.88153 6.625 8.13352 6.625 8.43555C6.625 8.78072 6.34518 9.06055 6 9.06055C5.65482 9.06055 5.375 8.78072 5.375 8.43555L5.3877 8.30957C5.44598 8.02478 5.69797 7.81055 6 7.81055L6.12598 7.82324ZM9 7.81055C9.34518 7.81055 9.625 8.09037 9.625 8.43555C9.625 8.78072 9.34518 9.06055 9 9.06055C8.65482 9.06055 8.375 8.78072 8.375 8.43555C8.375 8.09037 8.65482 7.81055 9 7.81055ZM12 7.81055C12.3452 7.81055 12.625 8.09037 12.625 8.43555C12.625 8.78072 12.3452 9.06055 12 9.06055C11.6548 9.06055 11.375 8.78072 11.375 8.43555C11.375 8.09037 11.6548 7.81055 12 7.81055Z"
				fill="currentColor"
				stroke="currentColor"
				strokeWidth="0.5"
				strokeLinecap="square"
			/>
		</svg>
	</AccessibleIcon>
)
