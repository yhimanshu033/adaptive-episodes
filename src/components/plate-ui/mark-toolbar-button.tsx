'use client'

import React from 'react'
import { withRef } from '@udecode/cn'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import {
	useMarkToolbarButton,
	useMarkToolbarButtonState,
} from '@udecode/plate-common/react'

import { ToolbarButton } from '@/components/plate-ui/toolbar'

export const MarkToolbarButton = withRef<
	typeof ToolbarButton,
	{
		clear?: string[] | string
		nodeType: string
	}
>(({ clear, nodeType, ...rest }, ref) => {
	const state = useMarkToolbarButtonState({ clear, nodeType })
	const { props } = useMarkToolbarButton(state)
	const isCommented = props.pressed && nodeType === CommentsPlugin.key

	return <ToolbarButton disabled={isCommented} ref={ref} {...props} {...rest} />
})
