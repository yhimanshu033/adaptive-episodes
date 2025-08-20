import { useState } from 'react'
import { generatedContent, scenesData } from '@/mock-data/beatsheet-editor'
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
import { useEditorState } from 'platejs/react'

import { TScene } from '@/types/ai-types'

type DragItem = { id: string; sceneId?: string; type: 'scene' | 'beat' }

const useBeatSheetEditor = () => {
	const editor = useEditorState()
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)
	const [scenes, setScenes] = useState<TScene[]>(scenesData)
	const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null)
	const [openSceneIds, setOpenSceneIds] = useState<string[]>([])

	const addNewScene = () => {
		const newId = (scenes.length + 1).toString()
		setScenes([
			...scenes,
			{
				id: newId,
				title: `SCENE ${newId}`,
				beats: [],
			},
		])
	}

	const addNewBeat = (sceneId: string) => {
		setScenes(
			scenes.map((scene) => {
				if (scene.id === sceneId) {
					const newBeatId = (scene.beats.length + 1).toString()
					return {
						...scene,
						beats: [...scene.beats, { id: newBeatId, content: '' }],
					}
				}
				return scene
			})
		)
	}

	const deleteScene = (sceneId: string) => {
		setScenes(scenes.filter((scene) => scene.id !== sceneId))
	}

	const handleInput = (sceneId: string, beatId: string, input: string) => {
		setScenes(
			scenes.map((scene) => {
				if (scene.id === sceneId) {
					for (const beat of scene.beats) {
						if (beat.id === beatId) {
							beat.content = input
							break
						}
					}
				}
				return scene
			})
		)
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

	const handleGenerateScenes = (scenesToGenerate?: TScene[]) => {
		const newChildren = structuredClone(editor.children)

		const targetScenes = scenesToGenerate ?? scenes

		for (const scene of targetScenes) {
			const sceneId = scene.id

			const alreadyExists = newChildren.some(
				(node) => node.scene_id === sceneId
			)
			if (alreadyExists) {
				continue
			}

			const newNode = {
				type: 'p',
				children: [
					{
						text:
							generatedContent.find((ele) => ele.id === sceneId)?.content ||
							`Generated Content for ${scene.title}`,
					},
				],
				id: nanoid(),
				scene_id: sceneId,
			}

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

	return {
		scenes,
		activeDragItem,
		openSceneIds,
		sensors,
		setOpenSceneIds,
		addNewScene,
		addNewBeat,
		deleteScene,
		handleInput,
		handleDelete,
		handleGenerateScenes,
		handleDragEnd,
		handleDragStart,
		handleDragOver,
		fixCursorSnapOffset,
	}
}

export default useBeatSheetEditor
