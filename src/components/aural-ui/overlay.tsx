import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/aural-ui/utils'

const overlayVariants = cva(
	'fixed inset-0 z-40 data-[state=open]:animate-fm-fadeIn data-[state=closed]:animate-fm-fadeOut',
	{
		variants: {
			opacity: {
				high: 'bg-black/80 ', // 80% opacity
				medium: 'bg-black/60', // 60% opacity
				low: 'bg-black/40', // 40% opacity
				none: 'bg-black',
			},
			glass: {
				high: 'backdrop-blur-lg',
				medium: 'backdrop-blur-md',
				low: 'backdrop-blur-sm',
				none: '',
			},
			noise: {
				high: '[background-image:var(--button-fm-noise-strong)]',
				medium: '[background-image:var(--button-fm-noise)]',
				low: '[background-image:var(--button-fm-noise-low)]',
				none: '',
			},
		},
		defaultVariants: {
			opacity: 'medium',
			glass: 'low',
			noise: 'low',
		},
	}
)

export interface OverlayProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof overlayVariants> {}

const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>(
	({ opacity, glass, noise, className, children, ...props }, ref) => (
		<>
			<div
				ref={ref}
				className={cn(overlayVariants({ opacity, glass, noise }), className)}
				{...props}
			/>
			{children && (
				<div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
					<div className="pointer-events-auto">{children}</div>
				</div>
			)}
		</>
	)
)
Overlay.displayName = 'Overlay'

export { Overlay, overlayVariants }
