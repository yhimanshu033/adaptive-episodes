import React from 'react'
import { SpinnerGradientIcon } from '@/icons/spinner-gradient-icon'
import { SpinnerSolidIcon } from '@/icons/spinner-solid-icon'

import { cn } from '@/lib/aural-ui/utils'

interface CircularLoaderProps {
	variant?: 'v1' | 'v2'
}

const CircularLoader = ({
	variant = 'v1',
	className,
}: React.JSX.IntrinsicAttributes &
	React.SVGProps<SVGSVGElement> &
	CircularLoaderProps) => {
	return (
		<div className="flex items-center justify-center">
			{variant === 'v1' ? (
				<SpinnerGradientIcon className={cn('animate-spin', className)} />
			) : (
				<SpinnerSolidIcon className={cn('animate-spin', className)} />
			)}
		</div>
	)
}

export default CircularLoader
