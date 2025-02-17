'use client'

import React from 'react'
import { cn, withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate-common/react'

export const BlockquoteElement = withRef<typeof PlateElement>(
	({ children, className, ...props }, ref) => {
		return (
			<PlateElement
				ref={ref}
				as="blockquote"
				className={cn(className, 'py-1 pl-6 italic')}
				{...props}
				style={{ paddingLeft: '48px' }}
			>
				{children}
			</PlateElement>
		)
	}
)
