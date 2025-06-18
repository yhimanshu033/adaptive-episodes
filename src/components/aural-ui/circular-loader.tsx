import React from 'react'

import { SpinnerGradientIcon } from '../../icons/spinner-gradient-icon'
import { SpinnerSolidIcon } from '../../icons/spinner-solid-icon'
import { SpinnerSolidNeutralIcon } from '../../icons/spinner-solid-neutral-icon'
import { cn } from '../../lib/aural-ui/utils'
import { Case, Default, SwitchCase } from './switch-case'

interface CircularLoaderProps {
	/** Accessible label for screen readers when no text is provided */
	'aria-label'?: string
	/** Whether to announce the loading state to screen readers */
	'aria-live'?: 'polite' | 'assertive' | 'off'
	className?: string
	classes?: {
		loader?: string
		root?: string
		text?: string
	}
	/** ID for the loading region */
	id?: string
	/** Custom loading message for screen readers */
	loadingMessage?: string
	/** Size variant for the loader */
	size?: 'sm' | 'md' | 'lg' | 'xl'
	text?: string
	variant?: 'v1' | 'v2' | 'v3'
}

const sizeVariants = {
	sm: 'h-4 w-4',
	md: 'h-6 w-6',
	lg: 'h-8 w-8',
	xl: 'h-12 w-12',
}

const CircularLoader = ({
	variant = 'v1',
	className,
	text,
	classes,
	'aria-label': ariaLabel,
	id,
	'aria-live': ariaLive = 'polite',
	loadingMessage,
	size = 'md',
	...props
}: React.JSX.IntrinsicAttributes &
	React.HTMLAttributes<HTMLDivElement> &
	CircularLoaderProps) => {
	// Determine the accessible label
	const accessibleLabel = text || loadingMessage || ariaLabel || 'Loading'

	// Determine if we should show visual text
	const showVisualText = text !== undefined

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center gap-2',
				classes?.root
			)}
			role="status"
			aria-live={ariaLive}
			aria-label={!showVisualText ? accessibleLabel : undefined}
			id={id}
			{...props}
		>
			<SwitchCase value={variant}>
				<Case value="v1">
					<SpinnerGradientIcon
						className={cn(
							'animate-spin',
							sizeVariants[size],
							className,
							classes?.loader
						)}
						aria-hidden="true"
						focusable="false"
					/>
				</Case>
				<Case value="v2">
					<SpinnerSolidIcon
						className={cn(
							'animate-spin',
							sizeVariants[size],
							className,
							classes?.loader
						)}
						aria-hidden="true"
						focusable="false"
					/>
				</Case>
				<Case value="v3">
					<SpinnerSolidNeutralIcon
						className={cn(
							'animate-spin',
							sizeVariants[size],
							className,
							classes?.loader
						)}
						aria-hidden="true"
						focusable="false"
					/>
				</Case>
				<Default>
					<SpinnerGradientIcon
						className={cn(
							'animate-spin',
							sizeVariants[size],
							className,
							classes?.loader
						)}
						aria-hidden="true"
						focusable="false"
					/>
				</Default>
			</SwitchCase>

			{/* Screen reader text - always present for accessibility */}
			{!showVisualText && <span className="sr-only">{accessibleLabel}</span>}

			{/* Visual text when provided */}
			{showVisualText && (
				<span
					className={cn(
						'text-fm-sm font-fm-brand leading-fm-sm mt-2',
						classes?.text
					)}
					aria-live={ariaLive}
				>
					{text}
				</span>
			)}
		</div>
	)
}

export default CircularLoader
