import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

export const SpinnerSolidNeutralIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
	<AccessibleIcon label="Spinner Solid Neutral Icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="64"
			height="64"
			viewBox="0 0 64 64"
			fill="none"
			{...props}
		>
			<g
				clipPath="url(#paint0_angular_3367_6316_clip_path)"
				data-figma-skip-parse="true"
			>
				<g transform="matrix(0 0.032 -0.032 0 32 32)">
					<foreignObject
						x="-1018.42"
						y="-1018.42"
						width="2036.83"
						height="2036.83"
					>
						<div
							style={{
								background:
									'conic-gradient(from 90deg,rgba(255, 255, 255, 1) 0deg,rgba(217, 217, 217, 0) 360deg)',
								height: '100%',
								width: '100%',
								opacity: 1,
							}}
						></div>
					</foreignObject>
				</g>
			</g>
			<circle
				cx="32"
				cy="32"
				r="32"
				data-figma-gradient-fill='{"type":"GRADIENT_ANGULAR","stops":[{"color":{"r":1.0,"g":1.0,"b":1.0,"a":1.0},"position":0.0},{"color":{"r":0.85098040103912354,"g":0.85098040103912354,"b":0.85098040103912354,"a":0.0},"position":1.0}],"stopsVar":[],"transform":{"m00":3.9188699282725371e-15,"m01":-64.0,"m02":64.0,"m10":64.0,"m11":3.9188699282725371e-15,"m12":-3.9188699282725371e-15},"opacity":1.0,"blendMode":"NORMAL","visible":true}'
			/>
			<circle cx="32" cy="32" r="26" fill="#1D1D1D" />
			<defs>
				<clipPath id="paint0_angular_3367_6316_clip_path">
					<circle cx="32" cy="32" r="32" />
				</clipPath>
			</defs>
		</svg>
	</AccessibleIcon>
)
