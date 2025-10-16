import React, { useCallback, useEffect, useMemo } from 'react'
import {
	LASER_LEAF_KEYS,
	LASER_TEXT_LENGTH,
	rephraseMethods,
} from '@/constants/editor-constants'
import { languageToTitle } from '@/constants/episodes-constants'
import useSuggestionGuard from '@/hooks/plate/use-suggestion-guard'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useLaserToolsQuery from '@/hooks/query/use-lasertool-data'
import useLanguage from '@/hooks/use-language'
import useLaserStore from '@/store/laser-store'
import { X } from 'lucide-react'
import { TText } from 'platejs'
import { PlateEditor, useEditorState } from 'platejs/react'
import { useShallow } from 'zustand/react/shallow'

import FloatingLaserResponse from '@/components/plate-ui/floating-laser-response'
import Image from '@/components/ui/image'
import { getLaserTextIndices } from '@/lib/utils/plate'

import { LaserToolsParams } from '@/types/ai-types'

import CircularLoader from '../aural-ui/circular-loader'
import { IconButton } from '../aural-ui/icon-button'

function getLaserKey(elem: TText) {
	return Object.keys(elem).find((key) =>
		key.startsWith(LASER_LEAF_KEYS.ID_START)
	)
}

function getMethodId(elem: TText) {
	const method = Object.keys(elem).find((key) =>
		key.startsWith(LASER_LEAF_KEYS.METHOD_START)
	)
	return method?.split('-').pop()
}
export default function LaserRephrase({
	leaf,
	editor,
}: {
	editor: PlateEditor
	leaf: TText
}) {
	const { data: episodeContent } = useEpisodeContent()

	const key = getLaserKey(leaf) || ''
	const methodId = getMethodId(leaf)
	const { children: allChildren } = useEditorState()
	const { suggestionGuard } = useSuggestionGuard()
	const { store: laserStore, setLaser } = useLaserStore()

	const getSelectedText = useCallback(() => {
		const defaultData = { text: leaf.text, prevtext: '', nexttext: '' }
		if (!key) {
			return defaultData
		}
		const { text } = leaf

		const leafPath = editor.api.node({
			at: [],
			match: (n) => !!n[key],
		})

		if (!leafPath?.[1]) {
			return defaultData
		}

		const {
			prevBlockTextEnd,
			nextBlockTextEnd,
			nextBlockTextStart,
			prevBlockTextStart,
			nextBlockTextEndOffset,
		} = getLaserTextIndices(allChildren, leafPath[1])

		const prevText = editor.api.string({
			anchor: {
				path: prevBlockTextStart,
				offset: 0,
			},
			focus: {
				path: prevBlockTextEnd,
				offset: 0,
			},
		})

		const nextText = editor.api.string({
			anchor: {
				path: nextBlockTextStart,
				offset: 0,
			},
			focus: {
				path: nextBlockTextEnd,
				offset: nextBlockTextEndOffset,
			},
		})

		return {
			text,
			prevtext: prevText.slice(-1 * LASER_TEXT_LENGTH),
			nexttext: nextText.slice(LASER_TEXT_LENGTH),
		}
	}, [key, leaf, editor.api, allChildren])

	const onResetLeaf = useCallback(() => {
		if (!key) {
			return
		}
		try {
			const matches = editor.api
				.nodes({
					at: [],
					match: (n) => !!n?.[key],
				})
				.toArray()
			const aggregateObject = matches.reduce((acc, curr) => {
				return {
					...acc,
					...curr[0],
				}
			}, {})
			const laserKeys = Object.keys(aggregateObject).filter((key) =>
				key.startsWith('laser')
			)
			suggestionGuard(() => {
				editor.tf.unsetNodes(laserKeys, {
					at: [],
					match: (n) => !!n?.[key],
				})
			})
		} catch (error) {
			console.error(error)
		}
	}, [editor, key, suggestionGuard])

	const lasersResponseMap = laserStore(useShallow((state) => state.lasers))

	const language = useLanguage()
	const params = useMemo(() => {
		return {
			action: methodId || '',
			...getSelectedText(),
			context: episodeContent?.chapter.props?.llm_memories?.context || '',
			ep_number: episodeContent?.chapter.seq_number.toString() || '',
			ep_text: editor.api.string([]),
			prompt: leaf[LASER_LEAF_KEYS.PROMPT] || '',
			style_template: '',
			input_language: languageToTitle[language],
			use_rag_context:
				(leaf[LASER_LEAF_KEYS.ADDITIONAL_CONTEXT] as boolean) || false,
			last_answer:
				key && lasersResponseMap[key]?.response
					? lasersResponseMap[key].response
					: undefined,
		} as LaserToolsParams
	}, [
		getSelectedText,
		episodeContent,
		leaf,
		language,
		methodId,
		key,
		lasersResponseMap,
		editor.api,
	])

	const { data, isFetching, refetch } = useLaserToolsQuery(key, params)

	useEffect(() => {
		if (data && !isFetching) {
			if (!key) {
				return
			}
			setLaser({
				id: key,
				laser: {
					response: data.result,
					text: getSelectedText().text,
				},
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isFetching, getSelectedText, key])

	if (data) {
		return (
			<FloatingLaserResponse
				onTryAgain={() => void refetch()}
				onResetLeaf={onResetLeaf}
			/>
		)
	}

	return (
		<div className="rounded-fm-l border-fm-divider-primary bg-fm-surface-primary relative flex w-full items-center justify-between gap-2 overflow-hidden border py-2 pr-2 pl-5 shadow-lg">
			<Image
				alt="laser gradient"
				className="pointer-events-none absolute top-0 z-0"
				src="/assets/laser-bg-gradient.png"
			/>
			<div className="flex items-center gap-2">
				<CircularLoader className="size-5" />
				<p className="leading-fm-md [background-image:linear-gradient(270deg,var(--color-fm-placeholder)_12.22%,var(--color-fm-primary)_31.77%,var(--color-fm-primary)_67.87%,var(--color-fm-placeholder)_96.75%)] bg-clip-text [font-size:var(--text-fm-md)] font-medium text-transparent">
					{rephraseMethods.find((m) => m.id === methodId)?.status}
				</p>
			</div>
			<IconButton
				onClick={onResetLeaf}
				icon={<X size={16} />}
				label="Close"
				variant="ghost"
			/>
		</div>
	)
}
