import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const SpinnerSolidIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Spinner Solid Icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="54"
			height="54"
			viewBox="0 0 54 54"
			fill="none"
			{...props}
		>
			<g
				clipPath="url(#paint0_angular_2078_22300_clip_path)"
				data-figma-skip-parse="true"
			>
				<g transform="matrix(-0.026449 -0.00142322 0.00142322 -0.026449 26.6942 26.8765)">
					<foreignObject
						x="-1013.61"
						y="-1013.61"
						width="2027.21"
						height="2027.21"
					>
						<div
							style={{
								background:
									'conic-gradient(from 90deg,var(--color-fm-neutral-50) 0deg,var(--color-fm-secondary-500) 354.833deg,var(--color-fm-neutral-50) 360deg)',
								height: '100%',
								width: '100%',
								opacity: '1',
							}}
						></div>
					</foreignObject>
				</g>
			</g>
			<circle
				cx="26.6942"
				cy="26.8765"
				r="26.4873"
				transform="rotate(93.0801 26.6942 26.8765)"
				data-figma-gradient-fill='{"type":"GRADIENT_ANGULAR","stops":[{"color":{"r":0.98039215803146362,"g":0.16078431904315948,"b":0.21568627655506134,"a":1.0},"position":0.98564827442169189},{"color":{"r":0.50196081399917603,"g":0.0,"b":1.0,"a":0.0},"position":1.0}],"stopsVar":[{"color":{"r":0.98039215803146362,"g":0.16078431904315948,"b":0.21568627655506134,"a":1.0},"position":0.98564827442169189},{"color":{"r":0.50196081399917603,"g":0.0,"b":1.0,"a":0.0},"position":1.0}],"transform":{"m00":-52.897975921630859,"m01":2.8464403152465820,"m02":51.719966888427734,"m10":-2.8464403152465820,"m11":-52.897975921630859,"m12":54.748744964599609},"opacity":1.0,"blendMode":"NORMAL","visible":true}'
			/>
			<circle cx="26.6948" cy="26.8766" r="21.2681" fill="#0D001A" />
			<defs>
				<clipPath id="paint0_angular_2078_22300_clip_path">
					<circle
						cx="26.6942"
						cy="26.8765"
						r="26.4873"
						transform="rotate(93.0801 26.6942 26.8765)"
					/>
				</clipPath>
			</defs>
		</svg>
	</AccessibleIcon>
)
