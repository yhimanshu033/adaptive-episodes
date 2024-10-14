import React from 'react'
import { cn, withRef } from '@udecode/cn'
import { PlateElement, useElement } from '@udecode/plate-common/react'
import type { TLinkElement } from '@udecode/plate-link'
import { useLink } from '@udecode/plate-link/react'

export const LinkElement = withRef<typeof PlateElement>(
	({ children, className, ...props }, ref) => {
		const element = useElement<TLinkElement>()
		const { props: linkProps } = useLink({ element })

		return (
			<PlateElement
				ref={ref}
				asChild
				className={cn(
					'font-medium text-primary underline decoration-primary underline-offset-4',
					className
				)}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				{...(linkProps as any)}
				{...props}
			>
				<a>{children}</a>
			</PlateElement>
		)
	}
)
