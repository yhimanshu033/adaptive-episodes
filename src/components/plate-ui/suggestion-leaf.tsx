/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { memo, useCallback, useMemo } from 'react'
import usePlateStore from '@/store/plate-store'
import { CommentsPlugin } from '@udecode/plate-comments/react'
import {
	PlateLeaf,
	PlateLeafProps,
	useEditorPlugin,
} from '@udecode/plate-common/react'
import { TSuggestionText } from '@udecode/plate-suggestion'
import { SuggestionPlugin } from '@udecode/plate-suggestion/react'

import { cn } from '@/lib/utils/helpers'

import { ESidebar } from '@/types/plate-types'

const SuggestionLeaf = memo(function SuggestionLeaf({
	className,
	...props
}: PlateLeafProps<TSuggestionText>) {
	const { children, leaf, nodeProps } = props
	const { setOptions: setCommentOptions } = useEditorPlugin(CommentsPlugin)
	const { setOption: set } = useEditorPlugin(SuggestionPlugin)
	const { setSidebar, setResolved } = usePlateStore()

	// Memoize the computed className to avoid recalculation on every render
	const computedClassName = useMemo(() => {
		return cn(
			'text-fm-tag-emerald relative bg-transparent hover:bg-transparent',
			leaf.suggestionDeletion &&
				'text-fm-primary decoration-fm-emerald-300 border-fm-emerald-200 border-2 border-x-0 border-y line-through',
			className
		)
	}, [leaf.suggestionDeletion, className])

	// Memoize the ID to avoid string concatenation on every render
	const leafId = useMemo(
		() => `suggestion-leaf-${leaf.suggestionId}`,
		[leaf.suggestionId]
	)

	// Memoize the click handler to prevent unnecessary re-renders
	const handleClick = useCallback(() => {
		setCommentOptions({ activeCommentId: null })
		set('activeSuggestionId', leaf.suggestionId || '')
		setSidebar(ESidebar.COMMENTS)
		setResolved(false)
	}, [setCommentOptions, set, setSidebar, setResolved, leaf.suggestionId])

	// Memoize nodeProps to avoid object recreation
	const memoizedNodeProps = useMemo(() => ({ ...nodeProps }), [nodeProps])

	return (
		<PlateLeaf
			{...props}
			id={leafId}
			className={computedClassName}
			onClick={handleClick}
			nodeProps={memoizedNodeProps}
		>
			{children}
		</PlateLeaf>
	)
})

export default SuggestionLeaf
