import { EEpisodeType, ELanguage } from '@/types/common'
import { TGetEpisodeResponse, TGetEpisodesResponse } from '@/types/episode-type'

export const sampleEpisodeDetails: TGetEpisodesResponse = {
	count: 1,
	next: null,
	previous: null,
	results: {
		data: [
			{
				chapter_title: 'Chapter 1',
				comments: '',
				context: '',
				create_time: '2023-10-01T12:00:00Z',
				file_url: 'test',
				id: 1,
				type: EEpisodeType.ORIGINAL,
				is_deleted: false,
				latest_version: 1,
				original_seq_number: 1,
				parent: null,
				project: 1,
				seq_number: 1,
				status: 'BASE',
				translation_url: '',
				update_time: '2023-10-01T12:00:00Z',
				word_count: 45,
				language: ELanguage.ENGLISH,
			},
			{
				chapter_title: 'Chapter 1 Spanish',
				comments: '',
				context: '',
				create_time: '2023-10-01T12:00:00Z',
				file_url: 'test',
				id: 2,
				type: EEpisodeType.ADAPTED,
				is_deleted: false,
				latest_version: 1,
				original_seq_number: 1,
				parent: 1,
				project: 1,
				seq_number: 1,
				status: 'BASE',
				translation_url: '',
				update_time: '2023-10-01T12:00:00Z',
				word_count: 45,
				language: ELanguage.MEXICAN_SPANISH,
			},
		],
		message: 'success',
	},
}

export function getSampleGetEpisodeResponse(id: number): TGetEpisodeResponse {
	const episode = sampleEpisodeDetails.results.data.find((ep) => ep.id === id)

	return {
		chapter: episode || sampleEpisodeDetails.results.data[0],
		next_parent_id: null,
		previous_parent_id: null,
		text: 'EPISODE ' + id,
		translation_text: 'EPISODE TRANSLATED' + id,
	}
}
