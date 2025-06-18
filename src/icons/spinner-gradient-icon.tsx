import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const SpinnerGradientIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Spinner Gradient Icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="54"
			height="54"
			viewBox="0 0 54 54"
			fill="none"
			{...props}
		>
			<g
				clipPath="url(#paint0_angular_2078_22297_clip_path)"
				data-figma-skip-parse="true"
			>
				<g transform="matrix(0 0.0264873 -0.0264873 0 26.6943 27.2532)">
					<foreignObject
						x="-1013.61"
						y="-1013.61"
						width="2027.21"
						height="2027.21"
					>
						<div
							style={{
								background:
									'conic-gradient(from 90deg,var(--color-fm-primary-500) 0deg,var(--color-fm-secondary-500) 174.808deg,var(--color-fm-neutral-50) 360deg)',
								height: '100%',
								width: '100%',
								opacity: '1',
							}}
						></div>
					</foreignObject>
				</g>
			</g>
			<circle
				cx="26.6943"
				cy="27.2532"
				r="26.4873"
				data-figma-gradient-fill='{"type":"GRADIENT_ANGULAR","stops":[{"color":{"r":0.98039215803146362,"g":0.16078431904315948,"b":0.21568627655506134,"a":1.0},"position":0.0},{"color":{"r":0.50196081399917603,"g":0.0,"b":1.0,"a":1.0},"position":0.48557692766189575},{"color":{"r":0.11372549086809158,"g":0.11372549086809158,"b":0.11372549086809158,"a":1.0},"position":1.0}],"stopsVar":[{"color":{"r":0.98039215803146362,"g":0.16078431904315948,"b":0.21568627655506134,"a":1.0},"position":0.0},{"color":{"r":0.50196081399917603,"g":0.0,"b":1.0,"a":1.0},"position":0.48557692766189575},{"color":{"r":0.11372549086809158,"g":0.11372549086809158,"b":0.11372549086809158,"a":1.0},"position":1.0}],"transform":{"m00":3.2437531173335745e-15,"m01":-52.974506378173828,"m02":53.181537628173828,"m10":52.974506378173828,"m11":3.2437531173335745e-15,"m12":0.765930175781250},"opacity":1.0,"blendMode":"NORMAL","visible":true}'
			/>
			<circle cx="26.6948" cy="27.2532" r="21.2681" fill="#0D001A" />
			<defs>
				<clipPath id="paint0_angular_2078_22297_clip_path">
					<circle cx="26.6943" cy="27.2532" r="26.4873" />
				</clipPath>
			</defs>
		</svg>
	</AccessibleIcon>
)
