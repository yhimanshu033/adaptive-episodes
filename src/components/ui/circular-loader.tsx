import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

import { cn } from '@/lib/aural-ui/utils'

interface CircularLoaderProps {
	variant?: 'v1' | 'v2'
}

const SpinnerGradientIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
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
								'conic-gradient(from 90deg,rgba(250, 41, 55, 1) 0deg,rgba(128, 0, 255, 1) 174.808deg,rgba(29, 29, 29, 1) 360deg)',
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
)

const SpinnerSolidIcon = (
	props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
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
								'conic-gradient(from 90deg,rgba(128, 0, 255, 0) 0deg,rgba(250, 41, 55, 1) 354.833deg,rgba(128, 0, 255, 0) 360deg)',
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
)

const CircularLoader = ({
	variant = 'v1',
	className,
}: React.JSX.IntrinsicAttributes &
	React.SVGProps<SVGSVGElement> &
	CircularLoaderProps) => {
	return (
		<AccessibleIcon label="Loading">
			<div className="flex items-center justify-center">
				{variant === 'v1' ? (
					<SpinnerGradientIcon className={cn('animate-spin', className)} />
				) : (
					<SpinnerSolidIcon className={cn('animate-spin', className)} />
				)}
			</div>
		</AccessibleIcon>
	)
}

export default CircularLoader
