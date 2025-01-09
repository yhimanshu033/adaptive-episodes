import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import {
	LocalizationType,
	localizationTypes,
	typeToKey,
	typeToLocalizedKey,
} from '@/constants/ai-constants'
import useLocalizeHook, {
	useLocalizeDownloadMutation,
	useLocalizeMutation,
} from '@/hooks/mutation/use-localize-hook'
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
	Download,
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
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { TooltipComponent } from '@/components/ui/tooltip-component'
import { FindReplacePlugin } from '@/lib/plate/plugins/find-replace'
import { cn, replaceNthInsensitive } from '@/lib/utils'

import {
	TLocalizeCharacterArrayItem,
	TLocalizeConceptArrayItem,
	TLocalizeObjectArrayItem,
	TLocalizePlaceArrayItem,
	TLocalizeResponse,
} from '@/types/ai-types'

const formSchema = z.object({
	original: z.string(),
	replace_with: z.string(),
	type: z.string(),
	description: z.string(),
})

function AddForm({
	setData,
}: {
	setData: Dispatch<SetStateAction<TLocalizeResponse['result'] | undefined>>
}) {
	const { mutate, isPending } = useLocalizeMutation()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			original: '',
			replace_with: '',
			type: localizationTypes[0],
			description: '',
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setData((prev) => ({
				...(prev || {}),
				[typeToKey[values.type as keyof typeof LocalizationType]]: {
					...(prev?.[typeToKey[values.type as keyof typeof LocalizationType]] ||
						{}),
					[values.original]: {
						[typeToLocalizedKey[values.type as keyof typeof LocalizationType]]:
							values.replace_with,
					},
				},
			}))
			mutate({
				ls_mapping: {
					[values.original]: {
						type: LocalizationType[
							values.type as keyof typeof LocalizationType
						],
						localized_name: values.replace_with,
						description: values.description,
					},
				},
			})
			form.reset()
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
								<TooltipComponent tooltip="Change Type">
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
											{localizationTypes.map((type, idx) => (
												<SelectItem key={idx} value={type}>
													{type}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TooltipComponent>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-[4fr_4fr] gap-4">
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
				</div>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									placeholder="Description"
									className="flex-1 rounded border border-gray-300 p-2"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<div className="flex justify-end">
					<Button disabled={isPending} type="submit">
						Submit
					</Button>
				</div>
			</form>
		</Form>
	)
}

export default function FindAndReplace() {
	const { setOptions, useOption } = useEditorPlugin(FindReplacePlugin)

	function downloadFile(url: string, filename: string) {
		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				return response.blob()
			})
			.then((blob) => {
				const link = document.createElement('a')
				const objectURL = URL.createObjectURL(blob)
				link.href = objectURL
				link.download = filename
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				URL.revokeObjectURL(objectURL)
			})
			.catch((error) => {
				console.error('There was a problem with the download operation:', error)
			})
	}

	const search = useOption('search') || ''
	const replace = useOption('replace') || ''
	const replaceEnabled = useOption('replaceEnabled')
	const caseSensitive = useOption('caseSensitive')
	const [ptr, setPtr] = useState(0)
	const { data: fetchedData, refetch, isFetching } = useLocalizeHook()
	const { isPending, mutateAsync } = useLocalizeDownloadMutation()
	const [data, setData] = useState<TLocalizeResponse['result'] | undefined>(
		fetchedData
	)

	console.log({ data })

	useEffect(() => {
		setData(fetchedData)
	}, [fetchedData])

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
	}, [ptr, records, setOptions])

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

	function handleSuggestionClick(
		suggestion:
			| TLocalizeCharacterArrayItem
			| TLocalizeConceptArrayItem
			| TLocalizePlaceArrayItem
			| TLocalizeObjectArrayItem
	) {
		const replace =
			'localized_name' in suggestion
				? suggestion.localized_name
				: 'localized_concept' in suggestion
					? suggestion.localized_concept
					: 'localized_object' in suggestion
						? suggestion.localized_object
						: suggestion.localized_place
		setOptions({ search: suggestion.name })
		setOptions({ replace })
		setOptions({ replaceEnabled: true })
		const updatedChildren = structuredClone(children)
		editor.tf.setValue(updatedChildren)
	}

	const characters = useMemo(
		() =>
			Object.keys(data?.characters || {}).reduce((acc, key) => {
				const obj = data?.characters?.[key]
				if (obj) {
					acc.push({ ...obj, name: key })
				}
				return acc
			}, [] as Array<TLocalizeCharacterArrayItem>),
		[data]
	)

	const places = useMemo(
		() =>
			Object.keys(data?.places || {}).reduce((acc, key) => {
				const obj = data?.places?.[key]
				if (obj) {
					acc.push({ ...obj, name: key })
				}
				return acc
			}, [] as Array<TLocalizePlaceArrayItem>),
		[data]
	)

	const concepts = useMemo(
		() =>
			Object.keys(data?.concepts || {}).reduce((acc, key) => {
				const obj = data?.concepts?.[key]
				if (obj) {
					acc.push({ ...obj, name: key })
				}
				return acc
			}, [] as Array<TLocalizeConceptArrayItem>),
		[data]
	)

	const objects = useMemo(
		() =>
			Object.keys(data?.objects || {}).reduce((acc, key) => {
				const obj = data?.objects?.[key]
				if (obj) {
					acc.push({ ...obj, name: key })
				}
				return acc
			}, [] as Array<TLocalizeObjectArrayItem>),
		[data]
	)

	async function handleDownload() {
		const url = await mutateAsync()
		if (!url?.csv_sheet_url) return
		downloadFile(url.csv_sheet_url, `LOC_sheet.csv`)
	}
	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<h2 className="text-2xl font-bold">Localization</h2>
			<div className="grid grid-cols-[1fr_10fr_2fr] gap-4">
				<TooltipComponent tooltip="Enable Replace">
					<Toggle onClick={toggleReplace} aria-label="Toggle replace">
						<ChevronRight
							className={cn('transition-all', replaceEnabled && 'rotate-90')}
						/>
					</Toggle>
				</TooltipComponent>

				<div className="relative">
					<Input
						value={search}
						onChange={handleSearchChange}
						type="text"
						placeholder="Find"
						className="flex-1 rounded border border-gray-300 p-2"
					/>
					<TooltipComponent
						tooltip={
							caseSensitive ? 'Make Case Insensitive' : 'Make Case Sensitive'
						}
					>
						<Toggle
							onClick={toggleCaseSensitive}
							aria-label="Toggle case-sensitivity"
							className={cn(
								'absolute inset-y-0 right-0 my-auto scale-75',
								caseSensitive && 'border'
							)}
						>
							<CaseSensitive />
						</Toggle>
					</TooltipComponent>
				</div>
				<div className="flex gap-2">
					<Button
						tooltip="Select Previous Node"
						onClick={handlePrev}
						disabled={ptr < 1}
					>
						<ChevronUp />
					</Button>
					<Button
						tooltip="Select Next Node"
						onClick={handleNext}
						disabled={ptr === records.length - 1}
					>
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
							<Button
								tooltip="Replace Current Selection"
								title="replace"
								onClick={onReplace}
							>
								<ReplaceIcon />{' '}
							</Button>
							<Button
								tooltip="Replace All"
								title="replace all"
								onClick={onReplaceAll}
							>
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
				<div className="flex flex-col items-center justify-center space-y-2 py-12">
					<Spinner size={64} />
					<p>Finding localized name suggestions—please wait.</p>
				</div>
			) : (
				<>
					<div
						className={cn(
							'flex h-full flex-col'
							// replaceEnabled ? '~h-[30vh]' : '~h-[37vh]'
						)}
					>
						{!!characters.length && (
							<>
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
							</>
						)}
						{!!places.length && (
							<>
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
							</>
						)}
						{!!concepts.length && (
							<>
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
							</>
						)}
						{!!objects.length && (
							<>
								<h4 className="pt-2 text-lg font-semibold">Objects</h4>
								<div className="flex flex-wrap gap-2 pt-1">
									{objects.map((object, index) => (
										<Button
											onClick={() => handleSuggestionClick(object)}
											key={index}
											variant="outline"
										>
											{object.name}
										</Button>
									))}
								</div>
							</>
						)}
					</div>
					<div className="flex items-center justify-end gap-2">
						<Button onClick={() => void refetch()} className="w-fit self-end">
							Scan the Episode
						</Button>
						<TooltipComponent tooltip="Download Localization sheet">
							<Button
								onClick={() => void handleDownload()}
								className="w-fit self-end"
							>
								{isPending ? <Spinner size={24} /> : <Download />}
							</Button>
						</TooltipComponent>
					</div>
				</>
			)}
			<hr />
			<AddForm setData={setData} />
		</div>
	)
}
