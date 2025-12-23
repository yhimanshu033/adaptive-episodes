import { useParams } from 'next/navigation'
import { API_URLS } from '@/constants/global-constants'
import { OUTLINER_METADATA_QUERY_KEY } from '@/constants/query-constants'
import {
	TUpdateOutlinerMetadataBody,
	TUpdateOutlinerUrlParams,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'

export default function useNarrativeArcsMutation() {
	const { id } = useParams()
	async function updateNarrativeArcsPlan({ content }: { content: string }) {
		if (isNaN(Number(id))) {
			toast.error('Could not Update Narrative Arcs Plan')
			return
		}
		await fetchAPI<
			TNoParams,
			TUpdateOutlinerUrlParams,
			TUpdateOutlinerMetadataBody
		>({
			method: 'POST',
			url: API_URLS.UPDATE_NARRATIVE_ARCS,
			body: {
				narrative_arc_plan: content,
			},
			urlParams: {
				projectId: Number(id),
			},
		})
	}

	const mutation = useMutation({
		mutationFn: updateNarrativeArcsPlan,
		mutationKey: [OUTLINER_METADATA_QUERY_KEY, id],
	})

	return mutation
}
