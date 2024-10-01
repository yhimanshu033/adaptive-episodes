/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import React, { useMemo, useState } from 'react'
import { withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate-common/react'
import { EmojiInlineIndexSearch, insertEmoji } from '@udecode/plate-emoji'

import {
	InlineCombobox,
	InlineComboboxContent,
	InlineComboboxEmpty,
	InlineComboboxInput,
	InlineComboboxItem,
} from './inline-combobox'

export const EmojiInputElement = withRef<typeof PlateElement>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	({ className, ...props }, ref) => {
		const { children, editor, element } = props
		const [value, setValue] = useState('')
		const debouncedValue = useDebounce(value, 100)
		const isPending = value !== debouncedValue

		const filteredEmojis = useMemo(() => {
			if (debouncedValue.trim().length === 0) return []
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			return (
				EmojiInlineIndexSearch.getInstance()
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					.search(debouncedValue.replace(/:$/, ''))
					.get()
			)
		}, [debouncedValue])

		return (
			<PlateElement
				ref={ref}
				as="span"
				data-slate-value={element.value}
				{...props}
			>
				<InlineCombobox
					value={value}
					element={element}
					filter={false}
					setValue={setValue}
					trigger=":"
					hideWhenNoValue
				>
					<InlineComboboxInput />

					<InlineComboboxContent>
						{!isPending && (
							<InlineComboboxEmpty>No matching emoji found</InlineComboboxEmpty>
						)}

						{filteredEmojis.map((emoji) => (
							<InlineComboboxItem
								key={emoji.id}
								value={emoji.name}
								onClick={() => insertEmoji(editor, emoji)}
							>
								{emoji.skins[0].native} {emoji.name}
							</InlineComboboxItem>
						))}
					</InlineComboboxContent>
				</InlineCombobox>

				{children}
			</PlateElement>
		)
	}
)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDebounce = (value: any, delay = 500) => {
	const [debouncedValue, setDebouncedValue] = React.useState(value)

	React.useEffect(() => {
		const handler: NodeJS.Timeout = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		// Cancel the timeout if value changes (also on delay change or unmount)
		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}
