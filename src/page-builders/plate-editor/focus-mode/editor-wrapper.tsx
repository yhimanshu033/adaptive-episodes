import React from 'react'
import usePlateStore from '@/store/plate-store'
import { useShallow } from 'zustand/react/shallow'

import { cn } from '@/lib/utils/helpers'

export default function FocusEditorWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	const { store: usePlateContextStore } = usePlateStore()
	const focusMode = usePlateContextStore(useShallow((state) => state.focusMode))

	return (
		<div
			className={cn(
				'focus-container transition-discrete transition-all *:transition-all',
				focusMode
					? 'bg-background *:max-w-(--breakpoint-lg) fixed right-0 top-0 z-50 h-svh w-svw items-center justify-center overflow-y-auto'
					: 'unfocused-editor-container'
			)}
		>
			{focusMode && (
				// eslint-disable-next-line react/no-unknown-property
				<style jsx global>
					{`
						.unfocused-editor-container {
							overflow: hidden;
							height: 0px;
						}
						.focus-container {
							@starting-style {
							}
						}
					`}
				</style>
			)}
			{children}
		</div>
	)
}
