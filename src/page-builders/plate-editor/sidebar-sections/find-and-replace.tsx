import React, { useMemo } from 'react'
import {
	useEditorPlugin,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'
import { TElement, TText } from '@udecode/slate'
import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { cn } from '@/lib/utils'

export default function FindAndReplace() {
	const { setOptions, useOption } = useEditorPlugin(FindReplacePlugin)

	const search = useOption('search') || ''
	const replace = useOption('replace') || ''
	const replaceEnabled = useOption('replaceEnabled')

	const editor = useEditorRef()
	const { children } = useEditorState()

	function toggleReplace() {
		setOptions({ replaceEnabled: !replaceEnabled })
	}
	function onReplace() {
		if (!search || !replaceEnabled || !editor) return

		const updatedChildren = structuredClone(children)

		function processNode(node: TElement | TText): void {
			if ('text' in node) {
				if (!replaceEnabled || !search) return
				const regex = new RegExp(search, 'gi')
				node.text = String(node.text).replace(regex, replace)
			} else if ('children' in node) {
				node.children.forEach(processNode)
			}
		}
		updatedChildren.forEach(processNode)
		editor.tf.setValue(updatedChildren)
		setOptions({ search: '', replace: '', replaceEnabled: false })
	}

	const occurences = useMemo(() => {
		return children.reduce((acc, node) => {
			const getCount = (node: TElement | TText): number => {
				if ('text' in node) {
					const regex = new RegExp(search, 'gi')
					const matches = String(node.text).match(regex)
					return matches ? matches.length : 0
				} else if ('children' in node) {
					return node.children.reduce(
						(childAcc, child) => childAcc + getCount(child),
						0
					)
				}
				return 0
			}

			return acc + getCount(node)
		}, 0)
	}, [children, search])

	return (
		<div className="flex flex-col gap-4 p-4">
			<h2 className="text-lg font-bold">Find and Replace</h2>
			<div className="grid grid-cols-[1fr_10fr_2fr] gap-4">
				<Toggle onClick={toggleReplace} aria-label="Toggle replace">
					<ChevronRight
						className={cn('transition-all', replaceEnabled && 'rotate-90')}
					/>
				</Toggle>
				<Input
					value={search}
					onChange={(e) => {
						setOptions({ search: e.target.value })
						const updatedChildren = structuredClone(children)
						editor.tf.setValue(updatedChildren)
					}}
					type="text"
					placeholder="Find"
					className="col-span-2 flex-1 rounded border border-gray-300 p-2"
				/>

				{replaceEnabled && (
					<>
						<Input
							value={replace}
							onChange={(e) => setOptions({ replace: e.target.value })}
							type="text"
							placeholder="Replace with"
							className="col-start-2 flex-1 rounded border border-gray-300 p-2"
						/>
						<Button onClick={onReplace}>Replace</Button>
					</>
				)}
			</div>
			{search && (
				<p className="text-lg text-muted-foreground">
					Found <span className="font-bold text-foreground">{occurences}</span>{' '}
					occurences of{' '}
					<span className="font-medium italic text-foreground">{search}</span>
				</p>
			)}
		</div>
	)
}
