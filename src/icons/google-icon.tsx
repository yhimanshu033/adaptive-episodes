import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const GoogleIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Google icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M13.76 8.13665C13.76 7.7112 13.7218 7.30211 13.6509 6.90938H8V9.23029H11.2291C11.09 9.98029 10.6673 10.6157 10.0318 11.0412V12.5467H11.9709C13.1055 11.5021 13.76 9.96392 13.76 8.13665Z"
				fill="#4285F4"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.99854 14.0006C9.61854 14.0006 10.9767 13.4634 11.9694 12.547L10.0304 11.0415C9.49308 11.4015 8.80581 11.6143 7.99854 11.6143C6.43581 11.6143 5.11308 10.5588 4.64126 9.14062H2.63672V10.6952C3.62399 12.6561 5.65308 14.0006 7.99854 14.0006Z"
				fill="#34A853"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.64273 9.13923C4.52273 8.77923 4.45455 8.39469 4.45455 7.99923C4.45455 7.60378 4.52273 7.21923 4.64273 6.85923V5.30469H2.63818C2.23182 6.11469 2 7.03105 2 7.99923C2 8.96741 2.23182 9.88378 2.63818 10.6938L4.64273 9.13923Z"
				fill="#FBBC05"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.99854 4.38636C8.87944 4.38636 9.67035 4.68909 10.2922 5.28364L12.0131 3.56273C10.974 2.59455 9.61581 2 7.99854 2C5.65308 2 3.62399 3.34455 2.63672 5.30545L4.64126 6.86C5.11308 5.44182 6.43581 4.38636 7.99854 4.38636Z"
				fill="#EA4335"
			/>
		</svg>
	</AccessibleIcon>
)
