import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { LocalizationType } from '@/constants/ai-constants'
import useLocalizeHook from '@/hooks/mutation/use-localize-hook'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	useEditorPlugin,
	useEditorRef,
	useEditorState,
} from '@udecode/plate-common/react'
import { TElement, TText } from '@udecode/slate'
import {
	CaseSensitive,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	ReplaceAllIcon,
	ReplaceIcon,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import Spinner from '@/components/ui/spinner'
import { Toggle } from '@/components/ui/toggle'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { cn, replaceNthInsensitive } from '@/lib/utils'

import { TLocalizeArrayItem } from '@/types/ai-types'

const formSchema = z.object({
	original: z.string(),
	replace_with: z.string(),
	type: z.string(),
})

const types = Object.keys(LocalizationType)

function AddForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			original: '',
			replace_with: '',
			type: types[0],
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values)
		} catch (error) {
			console.error('Form submission error', error)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					void form.handleSubmit(onSubmit)(e)
				}}
				className="space-y-4 pb-6"
			>
				<div className="flex w-full items-center justify-between">
					<h2 className="text-lg font-bold">Add to sheet</h2>
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{types.map((type, idx) => (
											<SelectItem key={idx} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-[4fr_4fr_1fr] gap-4">
					<FormField
						control={form.control}
						name="original"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder="Original"
										type="text"
										className="flex-1 rounded border border-gray-300 p-2"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="replace_with"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder="Replace with"
										type="text"
										className="flex-1 rounded border border-gray-300 p-2"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</div>
			</form>
		</Form>
	)
}

export default function FindAndReplace() {
	const { setOptions, useOption } = useEditorPlugin(FindReplacePlugin)

	const search = useOption('search') || ''
	const replace = useOption('replace') || ''
	const replaceEnabled = useOption('replaceEnabled')
	const caseSensitive = useOption('caseSensitive')
	const [ptr, setPtr] = useState(0)
	const { data, refetch, isFetching } = useLocalizeHook()

	const editor = useEditorRef()
	const { children } = useEditorState()

	const occurrences = useMemo(() => {
		return children.reduce((acc, node) => {
			const getCount = (node: TElement | TText): number => {
				if ('text' in node) {
					const regex = new RegExp(search, caseSensitive ? 'g' : 'gi')
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
	}, [children, search, caseSensitive])

	const records = useMemo(() => {
		const records: number[][] = []
		children.forEach((node, index) => {
			const getCount = (node: TElement | TText, path: number[]): void => {
				if ('text' in node) {
					const regex = new RegExp(search, caseSensitive ? 'g' : 'gi')
					const matches = String(node.text).match(regex)
					matches?.forEach((m, i) => records.push([...path, i]))
				} else if ('children' in node) {
					node.children.forEach((child, childIndex) =>
						getCount(child, [...path, childIndex])
					)
				}
			}
			getCount(node, [index])
		})
		return records
	}, [children, search, caseSensitive])

	useEffect(() => {
		if (!records[ptr]) return
		setOptions({ currentId: records[ptr] })
		const elem = document.getElementById(
			`search-highlight-${records[ptr].join('-')}`
		)
		if (elem) {
			elem.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}, [ptr, children, records, setOptions])

	useEffect(() => {
		setPtr(0)
	}, [search, caseSensitive])

	function toggleReplace() {
		setOptions({ replaceEnabled: !replaceEnabled })
	}
	const onReplaceAll = useCallback(() => {
		if (!search || !replaceEnabled || !editor) return

		const updatedChildren = structuredClone(children)

		function processNode(node: TElement | TText): void {
			if ('text' in node) {
				if (!replaceEnabled || !search) return
				const regex = new RegExp(search, caseSensitive ? 'g' : 'gi')
				node.text = String(node.text).replace(regex, replace)
			} else if ('children' in node) {
				node.children.forEach(processNode)
			}
		}
		updatedChildren.forEach(processNode)
		editor.tf.setValue(updatedChildren)
		setOptions({ search: '', replace: '', replaceEnabled: false })
	}, [
		caseSensitive,
		children,
		editor,
		replace,
		replaceEnabled,
		search,
		setOptions,
	])

	const onReplace = useCallback(() => {
		const path = records[ptr]
		const updatedChildren = structuredClone(children)
		const node = updatedChildren[path[0]].children[path[1]] as TElement
		const text = replaceNthInsensitive(
			node.text as string,
			search,
			replace,
			path[2]
		)
		updatedChildren[path[0]].children[path[1]] = {
			...node,
			text,
		}
		editor.tf.setValue(updatedChildren)
	}, [children, editor.tf, ptr, records, replace, search])

	function handlePrev() {
		setPtr(ptr > 0 ? ptr - 1 : ptr)
	}

	function handleNext() {
		setPtr(ptr < records.length - 1 ? ptr + 1 : ptr)
	}

	function toggleCaseSensitive() {
		setOptions({ caseSensitive: !caseSensitive })
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(updatedChildren)
	}

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setOptions({ search: e.target.value })
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(updatedChildren)
	}

	function handleSuggestionClick(suggestion: TLocalizeArrayItem) {
		setOptions({ search: suggestion.name })
		setOptions({ replace: suggestion.localized_name })
		setOptions({ replaceEnabled: true })
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(updatedChildren)
	}

	const characters = useMemo(
		() =>
			data
				? Object.keys(data.characters).map((key) => {
						return { ...data.characters[key], name: key }
					})
				: [],
		[data]
	)

	const places = useMemo(
		() =>
			data
				? Object.keys(data.places).map((key) => {
						return { ...data.places[key], name: key }
					})
				: [],
		[data]
	)

	const concepts = useMemo(
		() =>
			data
				? Object.keys(data.concepts).map((key) => {
						return { ...data.concepts[key], name: key }
					})
				: [],
		[data]
	)

	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<h2 className="text-lg font-bold">Localization</h2>
			<div className="grid grid-cols-[1fr_10fr_2fr] gap-4">
				<Toggle onClick={toggleReplace} aria-label="Toggle replace">
					<ChevronRight
						className={cn('transition-all', replaceEnabled && 'rotate-90')}
					/>
				</Toggle>
				<div className="relative">
					<Input
						value={search}
						onChange={handleSearchChange}
						type="text"
						placeholder="Find"
						className="flex-1 rounded border border-gray-300 p-2"
					/>
					<Toggle
						onClick={toggleCaseSensitive}
						aria-label="Toggle case-sensitivity"
						className="absolute inset-y-0 right-0 my-auto scale-75"
					>
						<CaseSensitive />
					</Toggle>
				</div>
				<div className="flex gap-2">
					<Button onClick={handlePrev} disabled={ptr < 1}>
						<ChevronUp />
					</Button>
					<Button onClick={handleNext} disabled={ptr === records.length - 1}>
						<ChevronDown />
					</Button>
				</div>
				{replaceEnabled && (
					<>
						<Input
							value={replace}
							onChange={(e) => setOptions({ replace: e.target.value })}
							type="text"
							placeholder="Replace with"
							className="col-start-2 flex-1 rounded border border-gray-300 p-2"
						/>
						<div className="flex gap-2">
							<Button title="replace" onClick={onReplace}>
								<ReplaceIcon />{' '}
							</Button>
							<Button title="replace all" onClick={onReplaceAll}>
								<ReplaceAllIcon />{' '}
							</Button>
						</div>
					</>
				)}
			</div>
			{search && (
				<p className="text-lg text-muted-foreground">
					Found <span className="font-bold text-foreground">{occurrences}</span>{' '}
					occurrences of{' '}
					<span className="font-medium italic text-foreground">{search}</span>
				</p>
			)}

			{isFetching ? (
				<div className="flex items-center justify-center py-12">
					<Spinner size={64} />
				</div>
			) : (
				<>
					<div
						className={cn(
							'flex h-full flex-col'
							// replaceEnabled ? '~h-[30vh]' : '~h-[37vh]'
						)}
					>
						<h4 className="text-lg font-semibold">Characters</h4>
						<div className="flex flex-wrap gap-2 pt-1">
							{characters.map((character, index) => (
								<Button
									onClick={() => handleSuggestionClick(character)}
									key={index}
									variant="outline"
								>
									{character.name}
								</Button>
							))}
						</div>
						<h4 className="pt-2 text-lg font-semibold">Places</h4>
						<div className="flex flex-wrap gap-2 pt-1">
							{places.map((place, index) => (
								<Button
									onClick={() => handleSuggestionClick(place)}
									key={index}
									variant="outline"
								>
									{place.name}
								</Button>
							))}
						</div>
						<h4 className="pt-2 text-lg font-semibold">Concepts</h4>
						<div className="flex flex-wrap gap-2 pt-1">
							{concepts.map((concept, index) => (
								<Button
									onClick={() => handleSuggestionClick(concept)}
									key={index}
									variant="outline"
								>
									{concept.name}
								</Button>
							))}
						</div>
					</div>
					<Button onClick={() => void refetch()} className="w-fit self-end">
						Scan the Episode
					</Button>
				</>
			)}
			<hr />
			<AddForm />
		</div>
	)
}
