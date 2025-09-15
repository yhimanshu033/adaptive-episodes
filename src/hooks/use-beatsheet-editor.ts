import { useEffect } from 'react'
import useBeatsheetStore from '@/store/beatsheet-store'
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
import { nanoid } from 'nanoid'
import { useEditorRef } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import { TGenerateBeatsheetResponse } from '@/types/beatsheet-editor-types'

const useBeatSheetEditor = () => {
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
	} = useBeatsheetStore()

	const scenes = beatsheetStore(useShallow((state) => state.scenes))
	const activeDragItem = beatsheetStore(
		useShallow((state) => state.activeDragItem)
	)
	const openSceneIds = beatsheetStore(useShallow((state) => state.openSceneIds))

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
		generatedContent: TGenerateBeatsheetResponse,
		sceneIds?: string[]
	) => {
		const newChildren = structuredClone(editor.children)
		if (!sceneIds) {
			return
		}

		for (const sceneId of sceneIds) {
			const existingNodeIndex = newChildren.findIndex(
				(node) => node.scene_id === sceneId
			)

			const newNode = {
				type: 'p',
				children: [
					{
						text:
							generatedContent.find((ele) => ele.id === sceneId)?.content ||
							`Generated Content for ${sceneId}`,
					},
				],
				id:
					existingNodeIndex >= 0 ? newChildren[existingNodeIndex].id : nanoid(),
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
		}

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

			const sceneIdOrder = newSceneOrder.map((scene) => scene.id)
			const sortedEditorChildren = [...editor.children].sort((a, b) => {
				const aIdx = sceneIdOrder.indexOf(a.scene_id as string)
				const bIdx = sceneIdOrder.indexOf(b.scene_id as string)
				return aIdx - bIdx
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
				domNode.style.color = shouldHavePrimaryColor
					? 'var(--color-fm-primary)'
					: 'var(--color-fm-tertiary)'
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [openSceneIds])

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
	}
}

export default useBeatSheetEditor
