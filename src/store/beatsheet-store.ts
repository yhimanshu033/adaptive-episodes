import { nanoid } from 'platejs'

import { useEpisodeContext } from '@/providers/episode-id-provider'

import {
	BeatsheetEditorStoreType,
	TCharacter,
} from '@/types/beatsheet-editor-types'

export default function useBeatsheetStore() {
	const { useBeatsheetStoreContext } = useEpisodeContext()

	const addNewScene = () => {
		useBeatsheetStoreContext.setState((state) => {
			const newSceneNumber = state.scenes.length + 1
			return {
				scenes: [
					...state.scenes,
					{ id: nanoid(), title: `SCENE ${newSceneNumber}`, beats: [] },
				],
			}
		})
	}

	const addNewBeat = (sceneId: string) => {
		useBeatsheetStoreContext.setState((state) => {
			return {
				scenes: state.scenes.map((scene) => {
					if (scene.id === sceneId) {
						return {
							...scene,
							beats: [...scene.beats, { id: nanoid(), content: '' }],
						}
					}
					return scene
				}),
			}
		})
	}

	const deleteScene = (sceneId: string) => {
		useBeatsheetStoreContext.setState((state) => {
			return {
				scenes: state.scenes.filter((scene) => scene.id !== sceneId),
			}
		})
	}

	const updateScene = (
		sceneId: string,
		newScene: BeatsheetEditorStoreType['scenes'][number]
	) => {
		useBeatsheetStoreContext.setState((state) => {
			const scenes = state.scenes.map((scene) =>
				scene.id === sceneId ? newScene : scene
			)
			return { scenes }
		})
	}
	const setScenes = (scenes: BeatsheetEditorStoreType['scenes']) => {
		useBeatsheetStoreContext.setState({ scenes })
	}

	const setOldScenes = (oldScenes: BeatsheetEditorStoreType['oldScenes']) => {
		useBeatsheetStoreContext.setState({ oldScenes })
	}

	const setActiveDragItem = (
		activeDragItem: BeatsheetEditorStoreType['activeDragItem']
	) => {
		useBeatsheetStoreContext.setState({ activeDragItem })
	}

	const setOpenSceneIds = (openSceneIds: string[]) => {
		useBeatsheetStoreContext.setState({ openSceneIds })
	}

	const setCharacters = (
		characters: BeatsheetEditorStoreType['characters']
	) => {
		useBeatsheetStoreContext.setState({ characters })
	}

	const addNewCharacter = () => {
		useBeatsheetStoreContext.setState((state) => {
			return {
				characters: [
					...state.characters,
					{
						id: nanoid(),
						name: '',
						bio: '',
						appearance: '',
						recent_arc: '',
						voice: '',
					},
				],
			}
		})
	}

	const updateCharacterField = (
		characterId: string,
		field: keyof TCharacter,
		value: string
	) => {
		useBeatsheetStoreContext.setState((state) => ({
			characters: state.characters.map((character) =>
				character.id === characterId
					? { ...character, [field]: value }
					: character
			),
		}))
	}

	const setEnhancementPlan = (enhancementPlan: boolean) => {
		useBeatsheetStoreContext.setState({ enhancementPlan })
	}

	const deleteCharacter = (characterId: string) => {
		useBeatsheetStoreContext.setState((state) => ({
			characters: state.characters.filter(
				(character) => character.id !== characterId
			),
		}))
	}

	const setOpenPromptId = (openPromptId: string | null) => {
		useBeatsheetStoreContext.setState({ openPromptId })
	}

	return {
		beatsheetStore: useBeatsheetStoreContext,
		addNewScene,
		addNewBeat,
		deleteScene,
		updateScene,
		setScenes,
		setActiveDragItem,
		setOpenSceneIds,
		addNewCharacter,
		updateCharacterField,
		setEnhancementPlan,
		deleteCharacter,
		setOpenPromptId,
		setCharacters,
		setOldScenes,
	}
}
