'use client'

import * as React from 'react'
import {
	flip,
	offset,
	useFloatingToolbar,
	useFloatingToolbarState,
	type FloatingToolbarState,
} from '@platejs/floating'
import { KEYS } from 'platejs'
import {
	useComposedRef,
	useEditorId,
	useEventEditorValue,
	usePluginOption,
} from 'platejs/react'

import { cn } from '@/lib/utils/helpers'

import { Toolbar } from './toolbar'

export const FloatingToolbar = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<typeof Toolbar> & {
		state?: FloatingToolbarState
	}
>(({ children, className, state, ...props }, forwardedRef) => {
	const editorId = useEditorId()
	const focusedEditorId = useEventEditorValue('focus')
	const isFloatingLinkOpen = !!usePluginOption({ key: KEYS.link }, 'mode')
	const isAIChatOpen = usePluginOption({ key: KEYS.aiChat }, 'open') as boolean

	const floatingToolbarState = useFloatingToolbarState({
		editorId,
		focusedEditorId,
		hideToolbar: isFloatingLinkOpen || isAIChatOpen,
		...state,
		floatingOptions: {
			middleware: [
				offset(12),
				flip({
					fallbackPlacements: [
						'top-start',
						'top-end',
						'bottom-start',
						'bottom-end',
					],
					padding: 12,
				}),
			],
			placement: 'top',
			...state?.floatingOptions,
		},
	})

	const {
		hidden,
		props: rootProps,
		ref: floatingRef,
	} = useFloatingToolbar(floatingToolbarState)

	const ref = useComposedRef<HTMLDivElement>(forwardedRef, floatingRef)

	if (hidden) {
		return null
	}

	return (
		<div>
			<Toolbar
				{...props}
				{...rootProps}
				ref={ref}
				className={cn(
					'bg-fm-surface-secondary border-fm-divider-secondary rounded-fm-l absolute z-50 overflow-hidden border whitespace-nowrap shadow-md backdrop-blur-md print:hidden',
					'max-w-[80vw]',
					className
				)}
			>
				{children}
			</Toolbar>
		</div>
	)
})

FloatingToolbar.displayName = 'FloatingToolbar'
