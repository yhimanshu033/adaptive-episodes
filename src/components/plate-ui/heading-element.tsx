import React from 'react'
import { withRef, withVariants } from '@udecode/cn'
import { PlateElement } from '@udecode/plate-common/react'
import { cva } from 'class-variance-authority'

const headingVariants = cva('', {
	variants: {
		isFirstBlock: {
			false: '',
			true: 'mt-0',
		},
		variant: {
			h1: 'pb-1 pt-[0.6em] font-heading text-4xl font-bold',
			h2: 'pb-px pt-[0.4em] font-heading text-2xl font-semibold tracking-tight',
			h3: 'pb-px pt-[0.2em] font-heading text-xl font-semibold tracking-tight',
			h4: 'pt-[0.75em] font-heading text-lg font-semibold tracking-tight',
			h5: 'pt-[0.75em] text-lg font-semibold tracking-tight',
			h6: 'pt-[0.75em] text-base font-semibold tracking-tight',
		},
	},
})

const HeadingElementVariants = withVariants(PlateElement, headingVariants, [
	'isFirstBlock',
	'variant',
])

export const HeadingElement = withRef<typeof HeadingElementVariants>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	({ children, isFirstBlock, variant = 'h1', ...props }, ref) => {
		const { editor, element } = props

		const Element = variant!

		return (
			<HeadingElementVariants
				ref={ref}
				asChild
				variant={variant}
				isFirstBlock={element === editor.children[0]}
				{...props}
			>
				<Element>{children}</Element>
			</HeadingElementVariants>
		)
	}
)
