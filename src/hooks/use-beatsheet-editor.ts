import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SOCKET_STREAMING_TIMEOUT } from '@/constants/global-constants'
import useCountdownTimer from '@/hooks/use-countdown-timer'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { useUndoRedo } from '@/hooks/use-undo-redo'
import { TrashIcon } from '@/icons/trash-icon'
import useBeatsheetStore from '@/store/beatsheet-store'
import { popup } from '@/store/popup-store'
import {
	CollisionDetection,
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	rectIntersection,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { LucideIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useEditorRef } from 'platejs/react'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import {
	isStringifiedJsonArray,
	shouldTriggerContentReorder,
} from '@/lib/utils/helpers'
import {
	reorderChildrenBasedOnScenes,
	reorderScenesBasedOnChildren,
} from '@/lib/utils/plate'

import {
	TGenerateBeatsheetResponse,
	TGenerateBeatsheetResponseItem,
} from '@/types/beatsheet-editor-types'

const useBeatSheetEditorUtil = () => {
	const editor = useEditorRef()
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)
	const {
		beatsheetStore,
		updateScene,
		deleteScene,
		setActiveDragItem,
		setScenes,
		setOpenSceneIds,
		setOldScenes,
	} = useBeatsheetStore()

	const scenes = beatsheetStore(useShallow((state) => state.scenes))
	const oldScenes = beatsheetStore(useShallow((state) => state.oldScenes))
	const activeDragItem = beatsheetStore(
		useShallow((state) => state.activeDragItem)
	)
	const openSceneIds = beatsheetStore(useShallow((state) => state.openSceneIds))
	const { redo, undo, reset, canRedo, canUndo } = useUndoRedo(scenes, {
		startIndex: 1,
	})
	const [generatingSceneTaskId, setGeneratingSceneTaskId] = useState<
		Record<string, string>
	>({})
	const [generatedContent, setGeneratedContent] = useState<
		Record<string, TGenerateBeatsheetResponseItem>
	>({})
	const [generationLogs, setGeneratedLogs] = useState<Record<string, string[]>>(
		{}
	)

	const { taskEnded, tasksTimedOut, responses } = useSocketStreaming()

	const { start: startCountdown, getTimeLeft } = useCountdownTimer()

	const isInitiallyReorderedRef = useRef(false)

	const currentlyGeneratingSceneTaskId = useMemo(() => {
		const newGeneratingSceneTaskId = Object.fromEntries(
			Object.entries(generatingSceneTaskId).filter(([, taskId]) => {
				return !taskEnded[taskId]
			})
		)
		return newGeneratingSceneTaskId
	}, [taskEnded, generatingSceneTaskId])

	const tasksConsumed = useMemo(() => {
		const taskSceneIdMap = Object.fromEntries(
			Object.entries(generatingSceneTaskId).map(([sceneId, taskId]) => [
				taskId,
				sceneId,
			])
		)

		return new Set(
			Object.keys(taskSceneIdMap).filter(
				(taskId) => generatedContent[taskSceneIdMap[taskId]]
			)
		)
	}, [generatingSceneTaskId, generatedContent])

	const getSceneRemainingTime = useCallback(
		(sceneId: string) => {
			return Math.round((getTimeLeft(sceneId) || 0) / 1000)
		},
		[getTimeLeft]
	)

	const getSceneTimedOut = useCallback(
		(sceneId: string) => {
			const taskId = generatingSceneTaskId[sceneId]
			return tasksTimedOut.has(taskId)
		},
		[tasksTimedOut, generatingSceneTaskId]
	)

	const handleInput = (sceneId: string, beatId: string, input: string) => {
		const scene = scenes.find((s) => s.id === sceneId)
		if (!scene) {
			return
		}

		const updatedBeats = scene.beats.map((beat) =>
			beat.id === beatId ? { ...beat, content: input } : beat
		)

		const updatedScene = { ...scene, beats: updatedBeats }
		updateScene(sceneId, updatedScene)
	}

	const handleDelete = (sceneId: string) => {
		const newChildren = structuredClone(editor.children)
		const deleteNodeIndex = newChildren.findIndex(
			(ele) => (ele.scene_id as string) === sceneId
		)
		if (deleteNodeIndex > -1) {
			newChildren.splice(deleteNodeIndex, 1)
			editor.tf.setValue(newChildren)
		}
		deleteScene(sceneId)
	}

	const handleGenerateScenes = (
		generatedContent: TGenerateBeatsheetResponseItem,
		sceneId?: string
	) => {
		const newChildren = structuredClone(editor.children)
		if (!sceneId) {
			return
		}

		const existingNodeIndex = newChildren.findIndex(
			(node) => node.scene_id === sceneId
		)

		const newNode = {
			type: 'p',
			children: [
				{
					text: generatedContent.content || `Generated Content for ${sceneId}`,
				},
			],
			id: existingNodeIndex >= 0 ? newChildren[existingNodeIndex].id : nanoid(),
			scene_id: sceneId,
		}

		if (existingNodeIndex >= 0) {
			newChildren[existingNodeIndex] = newNode
		} else {
			const currentSceneIndex = scenes.findIndex(
				(scene) => scene.id === sceneId
			)
			let insertIndex = newChildren.length

			for (let i = 0; i < newChildren.length; i++) {
				const node = newChildren[i]
				const nodeSceneId = node.scene_id as string | undefined
				if (!nodeSceneId) {
					continue
				}

				const nodeSceneIndex = scenes.findIndex((s) => s.id === nodeSceneId)

				if (nodeSceneIndex > currentSceneIndex) {
					insertIndex = i
					break
				}
			}

			newChildren.splice(insertIndex, 0, newNode)
		}
		approveContent(sceneId)
		editor.tf.setValue(newChildren)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) {
			setActiveDragItem(null)
			return
		}

		// Handle SCENE reorder
		if (activeDragItem?.type === 'scene') {
			const oldIndex = scenes.findIndex((scene) => scene.id === active.id)
			const newIndex = scenes.findIndex((scene) => scene.id === over.id)

			const newSceneOrder = arrayMove(scenes, oldIndex, newIndex)
			setScenes(newSceneOrder)

			const sortedEditorChildren = reorderChildrenBasedOnScenes({
				children: editor.children,
				scenes: newSceneOrder,
			})
			editor.tf.setValue(sortedEditorChildren)
		}

		// Handle BEAT reorder
		if (activeDragItem?.type === 'beat') {
			const fromSceneId = activeDragItem.sceneId!
			const toSceneId = scenes.find((scene) =>
				scene.beats.some((beat) => beat.id === over.id)
			)?.id

			if (!toSceneId) {
				return
			}

			const newScenes = structuredClone(scenes)

			const fromScene = newScenes.find((scene) => scene.id === fromSceneId)!
			const toScene = newScenes.find((scene) => scene.id === toSceneId)!

			const draggedBeatIndex = fromScene.beats.findIndex(
				(beat) => beat.id === active.id
			)
			const draggedBeat = fromScene.beats[draggedBeatIndex]
			const targetIndex = toScene.beats.findIndex((beat) => beat.id === over.id)

			fromScene.beats.splice(draggedBeatIndex, 1)
			toScene.beats.splice(targetIndex, 0, draggedBeat)

			setScenes(newScenes)
		}

		setActiveDragItem(null)
	}

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event
		const sceneId = scenes.find((scene) =>
			scene.beats.some((b) => b.id === active.id)
		)?.id

		setActiveDragItem({
			type: sceneId ? 'beat' : 'scene',
			id: active.id as string,
			sceneId,
		})
	}

	const handleDragOver = (event: DragOverEvent) => {
		const overId = event.over?.id
		if (!overId || activeDragItem?.type !== 'beat') {
			return
		}

		const isScene = scenes.some((s) => s.id === overId)
		if (!isScene) {
			return
		}

		if (!openSceneIds.includes(String(overId))) {
			setOpenSceneIds([String(overId)])
		}
	}

	const fixCursorSnapOffset: CollisionDetection = (args) => {
		if (!args.pointerCoordinates) {
			return rectIntersection(args)
		}
		const { x, y } = args.pointerCoordinates
		const { width, height } = args.collisionRect
		const updated = {
			...args,
			collisionRect: {
				width,
				height,
				bottom: y + height / 2,
				left: x - width / 2,
				right: x + width / 2,
				top: y - height / 2,
			},
		}
		return rectIntersection(updated)
	}

	const getSceneText = (sceneId: string) => {
		const nodeEntry = editor.api.node({
			at: [],
			match: (n) => n.scene_id === sceneId,
		})

		if (!nodeEntry) {
			return ''
		}

		const text = editor.api.string(nodeEntry[0])
		return text
	}

	const handleHistoryScenes = useCallback(
		(newScenes: typeof scenes) => {
			const shouldReorder = shouldTriggerContentReorder(scenes, newScenes)
			if (shouldReorder) {
				const sortedEditorChildren = reorderChildrenBasedOnScenes({
					children: editor.children,
					scenes: newScenes,
				})
				editor.tf.setValue(sortedEditorChildren)
			}
			setScenes(newScenes)
		},
		[scenes, setScenes, editor.children, editor.tf]
	)

	const handleUndo = useCallback(() => {
		const previousScenes = undo()
		handleHistoryScenes(previousScenes)
	}, [undo, handleHistoryScenes])

	const handleRedo = useCallback(() => {
		const nextScenes = redo()
		handleHistoryScenes(nextScenes)
	}, [redo, handleHistoryScenes])

	const handleReset = useCallback(() => {
		popup({
			title: 'Do you want to undo all your changes in the Beat Sheet Editor?',
			description:
				'All the reordering, edits, deletes, and inserts will be lost!',
			icon: TrashIcon as LucideIcon,
			type: 'negative',
			onConfirm: () => {
				const resetScenes = reset()
				handleHistoryScenes(resetScenes)
			},
		})
	}, [reset, handleHistoryScenes])

	const handleStartBeatSheetGeneration = useCallback(
		({ sceneIds, taskId }: { sceneIds: string[]; taskId: string }) => {
			const newRecords = sceneIds.reduce(
				(acc, curr) => {
					return {
						...acc,
						[curr]: taskId,
					}
				},
				{} as Record<string, string>
			)
			setGeneratingSceneTaskId((prev) => {
				return {
					...prev,
					...newRecords,
				}
			})
			sceneIds.forEach((id) =>
				startCountdown(
					id,
					sceneIds.length > 1
						? 3 * SOCKET_STREAMING_TIMEOUT
						: SOCKET_STREAMING_TIMEOUT
				)
			)
		},
		[startCountdown]
	)

	const handleCompleteBeatSheetGeneration = useCallback(
		({ params }: { params?: TGenerateBeatsheetResponse }) => {
			if (!params || !Array.isArray(params)) {
				return
			}
			const newContent = params.reduce((acc, curr) => {
				return {
					...acc,
					[curr.id]: curr,
				}
			}, {})
			setGeneratedContent((prev) => {
				return {
					...prev,
					...newContent,
				}
			})
		},
		[]
	)

	const handleStreamedBeatSheetResponse = useCallback(
		({ params, taskId }: { params: string[]; taskId: string }) => {
			setGeneratedLogs((prev) => {
				return {
					...prev,
					[taskId]: params,
				}
			})
		},
		[]
	)

	const getSceneLogs = useCallback(
		(sceneId: string) => {
			const taskId = generatingSceneTaskId[sceneId]
			const logs = generationLogs[taskId]

			return logs || []
		},
		[generatingSceneTaskId, generationLogs]
	)

	const approveContent = (sceneId: string) => {
		setGeneratedContent((prev) => {
			const newMap = { ...prev }
			delete newMap[sceneId]
			return newMap
		})
		setGeneratingSceneTaskId((prev) => {
			const newMap = { ...prev }
			delete newMap[sceneId]
			return newMap
		})
		toast.success('Generated content accepted!')
	}

	const rejectContent = (sceneId: string) => {
		setGeneratedContent((prev) => {
			const newMap = { ...prev }
			delete newMap[sceneId]
			return newMap
		})
		setGeneratingSceneTaskId((prev) => {
			const newMap = { ...prev }
			delete newMap[sceneId]
			return newMap
		})
		toast.info('Generated content rejected')
	}

	useEffect(() => {
		const nodeEntries = [
			...editor.api.nodes({
				at: [],
				match: (n) => !!n.scene_id,
			}),
		]

		for (const [node] of nodeEntries) {
			const domNode = editor.api.toDOMNode(node)
			if (domNode) {
				const shouldHavePrimaryColor =
					openSceneIds.length === 0 ||
					openSceneIds.includes(node.scene_id as string)
				domNode.style.opacity = shouldHavePrimaryColor ? '1' : '0.3'
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [openSceneIds])

	useEffect(() => {
		if (oldScenes.length) {
			return
		}
		setOldScenes(scenes)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scenes, oldScenes])

	useEffect(() => {
		const taskIds = new Set(Object.values(generatingSceneTaskId))

		for (const taskId of taskIds) {
			if (
				tasksTimedOut.has(taskId) ||
				tasksConsumed.has(taskId) ||
				!responses[taskId]
			) {
				continue
			}
			handleStreamedBeatSheetResponse({
				params: responses[taskId],
				taskId,
			})
			if (taskEnded[taskId]) {
				const lastChunk = responses[taskId].pop()
				if (!lastChunk || !isStringifiedJsonArray(lastChunk)) {
					return
				}
				handleCompleteBeatSheetGeneration({
					params: JSON.parse(lastChunk) as TGenerateBeatsheetResponse,
				})
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [taskEnded, responses, tasksTimedOut])

	useEffect(() => {
		const taskIds = new Set(Object.values(generatingSceneTaskId))

		const timedOutTaskIds = new Set<string>([])
		for (const taskId of taskIds) {
			if (
				tasksConsumed.has(taskId) ||
				taskEnded[taskId] ||
				!tasksTimedOut.has(taskId)
			) {
				continue
			}
			timedOutTaskIds.add(taskId)
		}

		setGeneratingSceneTaskId((prev) => {
			const newMap = { ...prev }
			for (const sceneId of Object.keys(prev)) {
				if (timedOutTaskIds.has(prev[sceneId])) {
					delete newMap[sceneId]
				}
			}
			return newMap
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [taskEnded, tasksTimedOut])

	useEffect(() => {
		if (isInitiallyReorderedRef.current || !scenes.length) {
			return
		}
		const newScenes = reorderScenesBasedOnChildren({
			children: editor.children,
			scenes,
		})
		setScenes(newScenes)
		isInitiallyReorderedRef.current = true

		return () => {
			isInitiallyReorderedRef.current = false
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scenes])

	return {
		sensors,
		handleInput,
		handleDelete,
		handleGenerateScenes,
		handleDragEnd,
		handleDragStart,
		handleDragOver,
		fixCursorSnapOffset,
		getSceneText,
		handleUndo,
		handleRedo,
		handleReset,
		canRedo,
		canUndo,
		oldScenes,
		setOldScenes,
		generatedContent,
		setGeneratedContent,
		generatingSceneTaskId,
		setGeneratingSceneTaskId,
		handleCompleteBeatSheetGeneration,
		handleStartBeatSheetGeneration,
		getSceneRemainingTime,
		getSceneTimedOut,
		currentlyGeneratingSceneTaskId,
		rejectContent,
		generationLogs,
		getSceneLogs,
	}
}

export default useBeatSheetEditorUtil
