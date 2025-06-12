import React from 'react'

import { cn } from '../../lib/aural-ui/utils'

interface DotLoaderProps {
	activeDotColor?: string
	/** Whether to announce loading state to screen readers */
	announceToScreenReader?: boolean
	/** Accessible label for screen readers */
	ariaLabel?: string
	className?: string
	classes?: {
		dot?: string
		root?: string
		text?: string
	}
	color?: string
	/** Custom loading message for screen readers */
	loadingMessage?: string
	text?: React.ReactNode
}

const DotLoader = ({
	text,
	classes,
	className,
	color = 'var(--color-fm-secondary-800)',
	activeDotColor = 'var(--color-fm-secondary-500)',
	ariaLabel = 'Loading',
	announceToScreenReader = true,
	loadingMessage = 'Content is loading, please wait',
}: DotLoaderProps) => {
	return (
		<div
			className={cn('flex flex-col items-center', classes?.root, className)}
			role="status"
			aria-label={ariaLabel}
			aria-live={announceToScreenReader ? 'polite' : undefined}
			aria-busy="true"
			style={{ color: activeDotColor } as React.CSSProperties}
		>
			<span
				className={cn(
					'animate-fm-shadowPulse relative mx-auto my-4 box-border block size-4 rounded-full',
					classes?.dot
				)}
				style={
					{
						backgroundColor: color,
						boxShadow: `-24px 0 ${color}, 24px 0 ${color}`,
						'--dot-color': color,
						'--active-dot-color': activeDotColor,
					} as React.CSSProperties & {
						'--active-dot-color': string
						'--dot-color': string
					}
				}
				aria-hidden="true"
			/>

			{/* Screen reader text */}
			<span className="sr-only">{loadingMessage}</span>

			{text && (
				<span
					className={cn(
						'text-fm-sm font-fm-brand leading-fm-sm mt-2',
						classes?.text
					)}
					aria-hidden={announceToScreenReader ? 'true' : undefined}
				>
					{text}
				</span>
			)}
		</div>
	)
}

export default DotLoader
