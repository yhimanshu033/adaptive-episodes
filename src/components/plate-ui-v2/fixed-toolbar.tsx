'use client'

import React from 'react'

import { cn } from '@/lib/utils/helpers'

import { Toolbar } from './toolbar'

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
	return (
		<Toolbar
			{...props}
			className={cn(
				'scrollbar-hide bg-fm-surface-primary/95 border-fm-divider-tertiary supports-backdrop-blur:bg-background/60 sticky top-0 left-0 z-50 w-full justify-between overflow-x-auto rounded-none border px-6 py-3 backdrop-blur-sm',
				props.className
			)}
		/>
	)
}
