import { API_URLS } from '@/constants/global-constants'
import { CHAPTER_CHARACTERS_DATA_QUERY_KEY } from '@/constants/query-constants'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useQuery } from '@tanstack/react-query'

import { fetchAPI } from '@/lib/fetch-api'

import { TNoParams } from '@/types/common'
import {
	TGetChapterCharactersQuery,
	TGetChapterCharactersResponse,
} from '@/types/episode-type'

export default function useChapterCharacters() {
	const { data } = useEpisodeContent()

	async function fetchChapterCharacters({
		chapter_id,
	}: TGetChapterCharactersQuery) {
		const resp = await fetchAPI<
			TGetChapterCharactersResponse,
			TNoParams,
			TNoParams,
			TGetChapterCharactersQuery
		>({
			method: 'GET',
			url: API_URLS.CHAPTER_CHARACTERS,
			query: {
				chapter_id,
			},
		})
		return resp.data
	}

	const query = useQuery({
		queryKey: [CHAPTER_CHARACTERS_DATA_QUERY_KEY, data?.chapter.id],
		queryFn: () =>
			fetchChapterCharacters({ chapter_id: Number(data?.chapter.id || 0) }),
		enabled: !!data?.chapter.id,
	})

	return query
}
