'use client'

import * as React from 'react'
import { useMarkToolbarButton, useMarkToolbarButtonState } from 'platejs/react'

import { ToolbarButton } from './toolbar'

export function MarkToolbarButton({
	clear,
	nodeType,
	manual,
	...props
}: React.ComponentProps<typeof ToolbarButton> & {
	clear?: string[] | string
	manual?: boolean
	nodeType: string
}) {
	const state = useMarkToolbarButtonState({ clear, nodeType })
	const { props: buttonProps } = useMarkToolbarButton(state)

	return (
		<ToolbarButton
			{...props}
			pressed={buttonProps.pressed}
			onClick={manual ? props.onClick : buttonProps.onClick}
			onMouseDown={manual ? props.onMouseDown : buttonProps.onMouseDown}
		/>
	)
}
