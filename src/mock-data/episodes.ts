import { EStatus } from '@/types/common'
import { TEpisode } from '@/types/episode-type'

export const episodes_list = [
	{
		id: 1,
		title: 'The Beginning',
		status: 'Published',
		writer: 'Alice Johnson',
		lastUpdated: '2023-06-01',
		wordCount: 2500,
	},
	{
		id: 2,
		title: 'The Plot Thickens',
		status: 'In Progress',
		writer: 'Bob Smith',
		lastUpdated: '2023-06-05',
		wordCount: 3000,
	},
	{
		id: 3,
		title: 'A Twist of Fate',
		status: '1st Draft',
		writer: 'Carol Davis',
		lastUpdated: '2023-06-10',
		wordCount: 2000,
	},
	{
		id: 4,
		title: 'The Climax',
		status: 'In Review',
		writer: 'David Brown',
		lastUpdated: '2023-06-15',
		wordCount: 3500,
	},
	{
		id: 5,
		title: 'The Resolution',
		status: '2nd Draft',
		writer: 'Eve Wilson',
		lastUpdated: '2023-06-20',
		wordCount: 2800,
	},
]

export type EpisodesType = (typeof episodes_list)[0]

export const mergedEpisodes: TEpisode[] = [
	{
		chapter_title: 'Merged Episode 1',
		comments: 'This is a merged episode combining multiple translations.',
		context: 'Context for the merged episode.',
		create_time: '2024-11-01T10:00:00Z',
		file_url: 'https://example.com/files/merged1.txt',
		id: 1,
		latest_version: 1,
		parent: null, // No parent since this is a top-level merged episode.
		project: 101,
		props: {
			llm_memories: {
				beatsheet: '',
				loglines: '',
				context: '',
				summary: '',
			},
		},
		seq_number: 1,
		status: EStatus.FIRST_DRAFT,
		translation_url: null,
		update_time: '2024-11-02T12:00:00Z',
		word_count: 2000,
		episodes: [
			{
				chapter_title: 'Original Episode 1',
				comments: 'Original episode part of merged content.',
				context: 'Context for the original episode 1.',
				create_time: '2024-10-20T08:00:00Z',
				file_url: 'https://example.com/files/original1.txt',
				id: 101,
				latest_version: 1,
				parent: 1, // Parent points to the merged episode ID.
				project: 101,
				props: {
					llm_memories: {
						beatsheet: '',
						loglines: '',
						context: '',
						summary: '',
					},
				},
				seq_number: 1,
				status: EStatus.FIRST_DRAFT,
				translation_url: null,
				update_time: '2024-10-21T10:00:00Z',
				word_count: 800,
			},
			{
				chapter_title: 'Original Episode 2',
				comments: 'Another original episode part of merged content.',
				context: 'Context for the original episode 2.',
				create_time: '2024-10-22T09:00:00Z',
				file_url: 'https://example.com/files/original2.txt',
				id: 102,
				latest_version: 1,
				parent: 1, // Parent points to the merged episode ID.
				project: 101,
				props: {
					llm_memories: {
						beatsheet: '',
						loglines: '',
						context: '',
						summary: '',
					},
				},
				seq_number: 2,
				status: EStatus.FIRST_DRAFT,
				translation_url: null,
				update_time: '2024-10-23T11:00:00Z',
				word_count: 1200,
			},
		],
	},
	{
		chapter_title: 'Standalone Episode',
		comments: null,
		context: 'A standalone episode unrelated to merged ones.',
		create_time: '2024-11-05T14:00:00Z',
		file_url: 'https://example.com/files/standalone.txt',
		id: 2,
		latest_version: 1,
		parent: null,
		project: 102,
		props: {
			llm_memories: {
				beatsheet: '',
				loglines: '',
				context: '',
				summary: '',
			},
		},
		seq_number: 2,
		status: EStatus.FIRST_DRAFT,
		translation_url: 'https://example.com/translation/standalone',
		update_time: '2024-11-06T16:00:00Z',
		word_count: 1500,
		episodes: [],
	},
	{
		chapter_title: 'Standalone Episode 2',
		comments: null,
		context: 'A standalone episode unrelated to merged ones.',
		create_time: '2024-11-05T14:00:00Z',
		file_url: 'https://example.com/files/standalone.txt',
		id: 2,
		latest_version: 1,
		parent: null,
		project: 102,
		props: {
			llm_memories: {
				beatsheet: '',
				loglines: '',
				context: '',
				summary: '',
			},
		},
		seq_number: 3,
		status: EStatus.SECOND_DRAFT,
		translation_url: 'https://example.com/translation/standalone',
		update_time: '2024-11-06T16:00:00Z',
		word_count: 1600,
		episodes: [],
	},
]
