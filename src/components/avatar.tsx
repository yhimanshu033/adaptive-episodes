'use client'

import React, { useState } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/aural-ui/utils'

interface IAvatarProps {
	alt?: string
	fallback?: string
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	src?: string | null
}

const sizeMap: Record<NonNullable<IAvatarProps['size']>, string> = {
	xs: 'w-9 h-9',
	sm: 'w-16 h-16',
	md: 'w-20 h-20',
	lg: 'w-24 h-24',
	xl: 'w-32 h-32',
}

export const Avatar: React.FC<IAvatarProps> = ({
	src,
	alt,
	fallback,
	size = 'xs',
}) => {
	const [imgError, setImgError] = useState(false)
	const shouldShowFallback = !src || imgError
	const fallbackInitial = fallback?.charAt(0) ?? '?'

	return (
		<div
			className={cn(
				'border-fm-divider-secondary bg-fm-surface-secondary relative flex items-center justify-center overflow-hidden rounded-full border p-1 font-semibold',
				sizeMap[size]
			)}
		>
			{shouldShowFallback ? (
				<span className="text-xl" title={fallback}>
					{fallbackInitial}
				</span>
			) : (
				<Image
					src={src}
					alt={alt ?? fallback ?? 'Avatar'}
					width={100}
					height={100}
					className="size-full rounded-full object-cover"
					loading="lazy"
					onError={() => setImgError(true)}
				/>
			)}
		</div>
	)
}
