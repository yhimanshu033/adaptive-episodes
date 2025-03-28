'use client'

import React, { useCallback, useState } from 'react'
import NextImage from 'next/image'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'

import { If } from '@/components/if-else'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils/helpers'

interface ImageProps extends React.ComponentProps<typeof NextImage> {
	containerProps?: React.ComponentProps<'div'>
}

export default function Image({
	containerProps,
	width = 200,
	height = 200,
	alt = 'Copilot Image',
	...props
}: ImageProps) {
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(false)

	const handleImageLoad = useCallback(() => {
		setIsLoading(false)
	}, [])

	const handleImageError = useCallback(() => {
		setError(true)
	}, [])

	return (
		<div
			{...containerProps}
			className={cn(
				'relative size-full',
				props.className,
				containerProps?.className
			)}
		>
			<If condition={isLoading}>
				<Skeleton className="absolute inset-0 w-full" />
			</If>
			<If condition={error}>
				<div className="absolute inset-0 flex justify-end bg-neutral-800">
					<NextImage
						src={COPILOT_LOGO_URL}
						height={100}
						width={100}
						alt="copilot-logo"
						className="size-full object-cover opacity-10"
					/>
				</div>
			</If>
			<NextImage
				width={width}
				height={height}
				{...props}
				onLoad={handleImageLoad}
				onError={handleImageError}
				alt={alt}
				className={cn(
					'size-full object-cover transition-opacity',
					isLoading || error ? 'opacity-0' : 'opacity-100',
					props.className
				)}
			/>
		</div>
	)
}
