import {
	TGenerateEpisodeFromSummaryResponse,
	TOutlinerChatGetNarrativeArcsResponse,
	TOutlinerData,
	TOutlinerFetchedData,
	TOutlinerTabData,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { isEqual } from 'lodash'

import { parseOptimistically } from '@/lib/utils/helpers'

export function getArrayFromOutlinerTabData(outlinerTabData: TOutlinerTabData) {
	return [
		outlinerTabData.summaryIdx,
		outlinerTabData.sceneIdx,
		outlinerTabData.beatIdx,
	]
}

export function areOutlinerTabDataEqual(
	outlinerTabData?: TOutlinerTabData,
	outlinerTabData2?: TOutlinerTabData
) {
	return isEqual(
		getArrayFromOutlinerTabData(outlinerTabData || {}),
		getArrayFromOutlinerTabData(outlinerTabData2 || {})
	)
}

export function getLatestOutlinerSelection(
	outlinerTabData?: TOutlinerTabData,
	outlinerData?: TOutlinerData
) {
	if (outlinerTabData?.summaryIdx !== undefined) {
		if (outlinerTabData?.sceneIdx !== undefined) {
			if (outlinerTabData?.beatIdx !== undefined) {
				return outlinerData?.[outlinerTabData?.summaryIdx]?.scenes?.[
					outlinerTabData?.sceneIdx
				]?.beats?.[outlinerTabData?.beatIdx]
			}
			return outlinerData?.[outlinerTabData?.summaryIdx]?.scenes?.[
				outlinerTabData?.sceneIdx
			]
		}
		return outlinerData?.[outlinerTabData?.summaryIdx]
	}
	return outlinerData
}

export function convertOutlinerData(apiResp: TOutlinerFetchedData) {
	const DEFAULT_EPISODE_SUMMARY = 'No summary available'
	return [
		{
			id: '1',
			title: 'Previous Episode',
			summary: apiResp.previous_episode_summary || DEFAULT_EPISODE_SUMMARY,
		},
		{
			id: '2',
			...(!apiResp.current_episode_summary
				? {
						multiSelectOptions: apiResp?.existingNewIdeas || [],
						multiSelectSelectedOption: 0,
						title: 'New Episode Ideas',
					}
				: {
						summary: apiResp?.current_episode_summary,
						title: 'Current Episode',
					}),
			...(apiResp?.scenesResponse?.result?.length
				? { scenes: apiResp?.scenesResponse?.result }
				: {}),
			isEditable: true,
		},
		{
			id: '3',
			title: 'Narrative Arcs Plan',
			...(apiResp?.narrative_arc_plan?.trim()
				? { summary: apiResp.narrative_arc_plan }
				: { multiSelectOptions: [], multiSelectSelectedOption: 0 }),
			isEditable: true,
		},
	] as TOutlinerData
}

export function getCurrEpSummary(data?: TOutlinerData) {
	if (data?.[1]?.summary) {
		return data?.[1]?.summary
	}

	if (data?.[1]?.multiSelectOptions) {
		return data?.[1]?.multiSelectOptions[
			data?.[1]?.multiSelectSelectedOption ?? 0
		]?.summary
	}

	return ''
}

export function getOutlinerSummaryEpText(
	data: string | TGenerateEpisodeFromSummaryResponse[]
) {
	if (typeof data === 'string') {
		const parsedData = parseOptimistically(data) as
			| TGenerateEpisodeFromSummaryResponse[]
			| undefined
		return parsedData?.[0]?.generated_text
	}
	return data?.[0]?.generated_text
}

export function getOutlinerNewNarrativeArcsOptions({
	newNarrativeArcs,
}: {
	newNarrativeArcs: TOutlinerChatGetNarrativeArcsResponse
}) {
	return newNarrativeArcs.map((item, idx) => {
		return {
			title: `Narrative Arc Plan ${idx + 1}`,
			summary: item.narrative_arc_plan,
		}
	})
}
