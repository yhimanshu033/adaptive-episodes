// 'use client'

// import React, { useEffect, useRef, useState } from 'react'
// import {
// 	Bold,
// 	BookOpen,
// 	Bot,
// 	Italic,
// 	List,
// 	MessageSquare,
// 	Palette,
// 	Type,
// 	Underline,
// } from 'lucide-react'

// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from '@/components/ui/popover'
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from '@/components/ui/select'

// const COLORS = [
// 	'black',
// 	'red',
// 	'orange',
// 	'yellow',
// 	'green',
// 	'blue',
// 	'indigo',
// 	'violet',
// ]

// const useContentEditable = (initialContent: string) => {
// 	const [content, setContent] = useState(initialContent)
// 	const contentRef = useRef<HTMLDivElement>(null)
// 	const lastCursorPosition = useRef<number | null>(null)

// 	useEffect(() => {
// 		const saveCursorPosition = () => {
// 			const selection = window.getSelection()
// 			if (selection && selection.rangeCount > 0) {
// 				const range = selection.getRangeAt(0)
// 				lastCursorPosition.current = range.startOffset
// 			}
// 		}

// 		const restoreCursorPosition = () => {
// 			if (lastCursorPosition.current !== null && contentRef.current) {
// 				const selection = window.getSelection()
// 				const range = document.createRange()
// 				const currentNode = contentRef.current
// 				let currentOffset = 0

// 				const traverseNodes = (node: Node) => {
// 					if (node.nodeType === Node.TEXT_NODE) {
// 						if (
// 							currentOffset + node.textContent!.length >=
// 							lastCursorPosition?.current
// 						) {
// 							range.setStart(node, lastCursorPosition?.current - currentOffset)
// 							return true
// 						}
// 						currentOffset += node.textContent!.length
// 					} else {
// 						for (const childNode of Array.from(node.childNodes)) {
// 							if (traverseNodes(childNode)) {
// 								return true
// 							}
// 						}
// 					}
// 					return false
// 				}

// 				traverseNodes(currentNode)
// 				range.collapse(true)
// 				selection?.removeAllRanges()
// 				selection?.addRange(range)
// 			}
// 		}

// 		contentRef.current?.addEventListener('input', saveCursorPosition)
// 		return () =>
// 			contentRef.current?.removeEventListener('input', saveCursorPosition)
// 	}, [])

// 	const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
// 		const newContent = e.currentTarget.innerHTML
// 		setContent(newContent)
// 		setTimeout(restoreCursorPosition, 0)
// 	}

// 	return { content, setContent, contentRef, handleChange }
// }

// const Editor = () => {
// 	const { content, setContent, contentRef, handleChange } = useContentEditable(
// 		'This is the sample text'
// 	)
// 	const [editorMode, setEditorMode] = useState('writing')
// 	const [activePanel, setActivePanel] = useState<string | null>(null)
// 	const [selectedText, setSelectedText] = useState('')
// 	const [selectionPosition, setSelectionPosition] = useState({
// 		top: 0,
// 		left: 0,
// 	})
// 	const [showTextPopup, setShowTextPopup] = useState(false)
// 	const [showAIPopup, setShowAIPopup] = useState(false)
// 	const [activeColorPicker, setActiveColorPicker] = useState<string | null>(
// 		null
// 	)

// 	useEffect(() => {
// 		const handleSelectionChange = () => {
// 			const selection = window.getSelection()
// 			if (selection && selection.rangeCount > 0) {
// 				const range = selection.getRangeAt(0)
// 				const selectedText = range.toString().trim()
// 				setSelectedText(selectedText)

// 				if (selectedText) {
// 					const rect = range.getBoundingClientRect()
// 					setSelectionPosition({
// 						top: rect.bottom + window.scrollY,
// 						left: rect.left + window.scrollX,
// 					})
// 					setShowTextPopup(true)
// 					setShowAIPopup(false)
// 				} else {
// 					setShowTextPopup(false)
// 					setShowAIPopup(false)
// 				}
// 			}
// 		}

// 		document.addEventListener('selectionchange', handleSelectionChange)
// 		return () =>
// 			document.removeEventListener('selectionchange', handleSelectionChange)
// 	}, [])

// 	const applyFormatting = (
// 		command: string,
// 		value: string | undefined = undefined
// 	) => {
// 		document.execCommand(command, false, value)
// 		contentRef.current?.focus()
// 	}

// 	const togglePanel = (panel: string) => {
// 		setActivePanel(activePanel === panel ? null : panel)
// 	}

// 	const handleAIAction = (action: string) => {
// 		console.log(`AI action: ${action} for text: "${selectedText}"`)
// 		setShowAIPopup(false)
// 	}

// 	const toggleColorPicker = (pickerType: string) => {
// 		setActiveColorPicker(activeColorPicker === pickerType ? null : pickerType)
// 	}

// 	const handleColorPick = (color: string, isHighlight: boolean) => {
// 		applyFormatting(isHighlight ? 'hiliteColor' : 'foreColor', color)
// 		setActiveColorPicker(null)
// 	}

// 	return (
// 		<div>
// 			<main className="mx-auto flex-1 px-4 py-8">
// 				<div className="rounded-lg p-6 shadow-lg">
// 					<div className="mb-4 flex items-center space-x-2">
// 						<Select
// 							value={editorMode}
// 							onValueChange={(value) => setEditorMode(value)}
// 						>
// 							<SelectTrigger className="w-[180px]">
// 								<SelectValue placeholder="Mode" />
// 							</SelectTrigger>
// 							<SelectContent>
// 								<SelectItem value="writing">Writing</SelectItem>
// 								<SelectItem value="suggesting">Suggesting</SelectItem>
// 								<SelectItem value="analyzing">Analyzing</SelectItem>
// 							</SelectContent>
// 						</Select>
// 						<Button
// 							variant="outline"
// 							size="icon"
// 							onClick={() => applyFormatting('bold')}
// 						>
// 							<Bold className="size-4" />
// 						</Button>
// 						<Button
// 							variant="outline"
// 							size="icon"
// 							onClick={() => applyFormatting('italic')}
// 						>
// 							<Italic className="size-4" />
// 						</Button>
// 						<Button
// 							variant="outline"
// 							size="icon"
// 							onClick={() => applyFormatting('underline')}
// 						>
// 							<Underline className="size-4" />
// 						</Button>
// 						<Select
// 							onValueChange={(value) => applyFormatting('fontSize', value)}
// 						>
// 							<SelectTrigger className="w-[100px]">
// 								<SelectValue placeholder="12" />
// 							</SelectTrigger>
// 							<SelectContent>
// 								{[1, 2, 3, 4, 5, 6, 7].map((size) => (
// 									<SelectItem key={size} value={size.toString()}>
// 										{size * 8}
// 									</SelectItem>
// 								))}
// 							</SelectContent>
// 						</Select>
// 						<Popover
// 							open={activeColorPicker === 'font'}
// 							onOpenChange={() => toggleColorPicker('font')}
// 						>
// 							<PopoverTrigger asChild>
// 								<Button variant="outline" size="icon">
// 									<Type className="size-4" />
// 								</Button>
// 							</PopoverTrigger>
// 							<PopoverContent className="w-40">
// 								<div className="grid grid-cols-4 gap-2">
// 									{COLORS.map((color) => (
// 										<Button
// 											key={color}
// 											className="size-8 rounded-full p-0"
// 											style={{ backgroundColor: color }}
// 											onClick={() => handleColorPick(color, false)}
// 										/>
// 									))}
// 								</div>
// 							</PopoverContent>
// 						</Popover>
// 						<Popover
// 							open={activeColorPicker === 'highlight'}
// 							onOpenChange={() => toggleColorPicker('highlight')}
// 						>
// 							<PopoverTrigger asChild>
// 								<Button variant="outline" size="icon">
// 									<Palette className="size-4" />
// 								</Button>
// 							</PopoverTrigger>
// 							<PopoverContent className="w-40">
// 								<div className="grid grid-cols-4 gap-2">
// 									{COLORS.map((color) => (
// 										<Button
// 											key={color}
// 											className="size-8 rounded-full p-0"
// 											style={{ backgroundColor: color }}
// 											onClick={() => handleColorPick(color, true)}
// 										/>
// 									))}
// 								</div>
// 							</PopoverContent>
// 						</Popover>
// 						<Button
// 							variant="outline"
// 							size="icon"
// 							onClick={() => togglePanel('germanTranslation')}
// 						>
// 							<BookOpen className="size-4" />
// 						</Button>
// 						<Button
// 							variant="outline"
// 							size="icon"
// 							onClick={() => togglePanel('aiAssistant')}
// 						>
// 							<Bot className="size-4" />
// 						</Button>
// 						<Button
// 							variant="outline"
// 							size="icon"
// 							onClick={() => togglePanel('outline')}
// 						>
// 							<List className="size-4" />
// 						</Button>
// 						<Button
// 							variant="outline"
// 							size="icon"
// 							onClick={() => togglePanel('comments')}
// 						>
// 							<MessageSquare className="size-4" />
// 						</Button>
// 					</div>
// 					<div className="flex space-x-4">
// 						<div
// 							ref={contentRef}
// 							contentEditable
// 							className="h-[calc(100vh-200px)] flex-1 overflow-auto rounded-md border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
// 							onInput={handleChange}
// 							dangerouslySetInnerHTML={{ __html: content }}
// 						/>
// 						{activePanel && (
// 							<Card className="w-1/2">
// 								<CardHeader>
// 									<CardTitle>
// 										{activePanel === 'germanTranslation' &&
// 											'German Translation'}
// 										{activePanel === 'aiAssistant' && 'AI Assistant'}
// 										{activePanel === 'outline' && 'Episode Outline'}
// 										{activePanel === 'comments' && 'Comments'}
// 									</CardTitle>
// 								</CardHeader>
// 								<CardContent>
// 									{activePanel === 'germanTranslation' && (
// 										<p>Dies ist der Beispieltext</p>
// 									)}
// 									{activePanel === 'aiAssistant' && (
// 										<p>AI Assistant functionality goes here...</p>
// 									)}
// 									{activePanel === 'outline' && (
// 										<p>Outline functionality goes here...</p>
// 									)}
// 									{activePanel === 'comments' && (
// 										<p>Comments functionality goes here...</p>
// 									)}
// 								</CardContent>
// 							</Card>
// 						)}
// 					</div>
// 				</div>
// 			</main>
// 			{showTextPopup && (
// 				<div
// 					className="absolute flex space-x-2 rounded-md border border-gray-300 bg-white p-2 shadow-lg"
// 					style={{ top: selectionPosition.top, left: selectionPosition.left }}
// 				>
// 					<Button
// 						variant="outline"
// 						size="icon"
// 						onClick={() => applyFormatting('bold')}
// 					>
// 						<Bold className="size-4" />
// 					</Button>
// 					<Button
// 						variant="outline"
// 						size="icon"
// 						onClick={() => applyFormatting('italic')}
// 					>
// 						<Italic className="size-4" />
// 					</Button>
// 					<Button
// 						variant="outline"
// 						size="icon"
// 						onClick={() => applyFormatting('underline')}
// 					>
// 						<Underline className="size-4" />
// 					</Button>
// 					<Button
// 						variant="outline"
// 						size="icon"
// 						onClick={() => setShowAIPopup(true)}
// 					>
// 						<Bot className="size-4" />
// 					</Button>
// 				</div>
// 			)}
// 			{showAIPopup && (
// 				<div
// 					className="absolute flex flex-col space-y-2 rounded-md border border-gray-300 bg-white p-2 shadow-lg"
// 					style={{ top: selectionPosition.top, left: selectionPosition.left }}
// 				>
// 					<Button variant="outline" onClick={() => handleAIAction('improve')}>
// 						Improve
// 					</Button>
// 					<Button variant="outline" onClick={() => handleAIAction('shorten')}>
// 						Shorten
// 					</Button>
// 					<Button variant="outline" onClick={() => handleAIAction('lengthen')}>
// 						Lengthen
// 					</Button>
// 					<Button variant="outline" onClick={() => handleAIAction('simplify')}>
// 						Simplify
// 					</Button>
// 					<Button variant="outline" onClick={() => handleAIAction('stylize')}>
// 						Stylize
// 					</Button>
// 					<Button
// 						variant="outline"
// 						onClick={() => handleAIAction('promptInChat')}
// 					>
// 						Prompt in Chat
// 					</Button>
// 				</div>
// 			)}
// 		</div>
// 	)
// }

// export default Editor
