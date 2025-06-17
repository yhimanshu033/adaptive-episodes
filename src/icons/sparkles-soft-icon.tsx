import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const SparklesSoftIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Sparkles Soft Icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M16.666 10.8334C11.4577 10.8334 9.16602 13.125 9.16602 18.3334C9.16602 13.125 6.87435 10.8334 1.66602 10.8334C6.87435 10.8334 9.16602 8.54171 9.16602 3.33337C9.16602 8.54171 11.4577 10.8334 16.666 10.8334Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M17.2056 2.80227C16.7057 2.29319 16.4937 1.53272 16.4937 0.833374H16.0076C16.0076 1.52983 15.7976 2.29082 15.2945 2.79391C14.7914 3.297 14.0304 3.50699 13.334 3.50699V3.9931C14.0333 3.9931 14.7938 4.20513 15.3029 4.70501C15.8192 5.21198 16.0076 5.96253 16.0076 6.66671H16.4937C16.4937 5.95967 16.6842 5.2097 17.1973 4.69666C17.7103 4.18362 18.4603 3.9931 19.1673 3.9931V3.50699C18.4631 3.50699 17.7126 3.31858 17.2056 2.80227Z"
				fill="currentColor"
			/>
		</svg>
	</AccessibleIcon>
)
