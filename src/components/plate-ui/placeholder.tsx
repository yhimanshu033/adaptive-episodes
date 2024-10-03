/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from 'react'
import { cn } from '@udecode/cn'
import {
	createNodeHOC,
	createNodesHOC,
	ParagraphPlugin,
	usePlaceholderState,
	type PlaceholderProps,
} from '@udecode/plate-common/react'
import { HEADING_KEYS } from '@udecode/plate-heading'

export const Placeholder = (props: PlaceholderProps) => {
	const { children, nodeProps, placeholder } = props

	const { enabled } = usePlaceholderState(props)

	const isEmpty = !props.editor.children.find((elem) =>
		elem.children.find((child) => (child.text as string).length > 0)
	)

	return React.Children.map(children, (child) => {
		return React.cloneElement(child, {
			className: child.props.className,
			nodeProps: {
				...nodeProps,
				className: cn(
					enabled &&
						isEmpty &&
						'before:absolute before:cursor-text before:opacity-30 before:content-[attr(placeholder)]'
				),
				placeholder,
			},
		})
	})
}

export const withPlaceholder = createNodeHOC(Placeholder)

export const withPlaceholdersPrimitive = createNodesHOC(Placeholder)

export const withPlaceholders = (components: any) =>
	withPlaceholdersPrimitive(components, [
		{
			key: ParagraphPlugin.key,
			hideOnBlur: true,
			placeholder: 'Type a paragraph',
			query: {
				maxLevel: 1,
			},
		},
		{
			key: HEADING_KEYS.h1,
			hideOnBlur: false,
			placeholder: 'Untitled',
		},
	])
