import { ListeningProfile } from '@/page-builders/demo-story-listing/preferences/constants'

export type { ListeningProfile }

/**
 * Episode audio versions for different listening preferences
 * In production, these would be different audio files optimized for each style
 */
export type EpisodeAudioVersions = {
	[K in ListeningProfile]: string
}

export type Episode = {
	audioVersions: EpisodeAudioVersions
	duration: string // e.g. "15:34"
	durationSeconds: number
	id: string
	isLocked?: boolean
	number: number
	releaseDate: string // e.g. "3YR AGO"
	title: string
	unlockInfo?: string // e.g. "11 coins to unlock now or free tomorrow"
}

export type StoryDetails = {
	coverUrl: string
	description: string
	episodes: Episode[]
	genre: string
	id: string
	likes: string
	plays: string
	shares: string
	subtitle?: string
	title: string
	totalEpisodes: number
}

/**
 * Get the audio URL for an episode based on listening preference
 */
export function getAudioForPreference(
	episode: Episode,
	profile: ListeningProfile
): string {
	return episode.audioVersions[profile] || episode.audioVersions.original
}

// Demo episode data
const createEpisodeAudioVersions = (): EpisodeAudioVersions => ({
	speed: '/assets/sample_audio.mp3', // In production: condensed version
	immersive: '/assets/sample_audio.mp3', // In production: full atmospheric version
	distracted: '/assets/sample_audio.mp3', // In production: clear, structured version with recaps
	original: '/assets/sample_audio.mp3', // Original unmodified version
})

export const demoEpisodes: Episode[] = [
	{
		id: 'ep_01',
		number: 1,
		title: 'Unlucky Lucky',
		duration: '15:34',
		durationSeconds: 934,
		releaseDate: '3YR AGO',
		audioVersions: createEpisodeAudioVersions(),
	},
	{
		id: 'ep_02',
		number: 2,
		title: 'Lucky Ka Bank Account',
		duration: '13:44',
		durationSeconds: 824,
		releaseDate: '3YR AGO',
		audioVersions: createEpisodeAudioVersions(),
	},
	{
		id: 'ep_03',
		number: 3,
		title: 'Kismat Ka Pitara',
		duration: '16:28',
		durationSeconds: 988,
		releaseDate: '3YR AGO',
		audioVersions: createEpisodeAudioVersions(),
	},
	{
		id: 'ep_04',
		number: 4,
		title: 'Jhootha Pyaar',
		duration: '12:48',
		durationSeconds: 768,
		releaseDate: '3YR AGO',
		audioVersions: createEpisodeAudioVersions(),
	},
	{
		id: 'ep_05',
		number: 5,
		title: 'Hostel Reunion',
		duration: '13:55',
		durationSeconds: 835,
		releaseDate: '3YR AGO',
		audioVersions: createEpisodeAudioVersions(),
	},
	{
		id: 'ep_06',
		number: 6,
		title: 'Koyal par Mandraya Baaz',
		duration: '13:12',
		durationSeconds: 792,
		releaseDate: '3YR AGO',
		audioVersions: createEpisodeAudioVersions(),
	},
	{
		id: 'ep_07',
		number: 7,
		title: 'Paiso Ka Ghamand',
		duration: '13:09',
		durationSeconds: 789,
		releaseDate: '3YR AGO',
		audioVersions: createEpisodeAudioVersions(),
		isLocked: true,
		unlockInfo: '11 coins to unlock now or free tomorrow',
	},
	{
		id: 'ep_08',
		number: 8,
		title: 'Lion se Panga',
		duration: '13:12',
		durationSeconds: 792,
		releaseDate: '3YR AGO',
		audioVersions: createEpisodeAudioVersions(),
		isLocked: true,
	},
]

// Demo story details for each story
export const demoStoryDetails: Record<string, StoryDetails> = {
	st_01: {
		id: 'st_01',
		title: 'Saving Nora',
		subtitle: 'A tale of love and redemption',
		description:
			'Nora finds herself in a world of secrets and danger. Can she be saved before it is too late?',
		genre: 'Drama',
		coverUrl: '/assets/saving-nora.webp',
		totalEpisodes: 1440,
		plays: '855.8M',
		likes: '579.9K',
		shares: '236.1K',
		episodes: demoEpisodes,
	},
	st_02: {
		id: 'st_02',
		title: 'Shaktimaan - Returns',
		subtitle: 'The hero rises again',
		description:
			"India's beloved superhero returns to fight evil and protect the innocent.",
		genre: 'Action',
		coverUrl: '/assets/shaktimaan-returns.webp',
		totalEpisodes: 850,
		plays: '1.2M',
		likes: '45.2K',
		shares: '12.1K',
		episodes: demoEpisodes,
	},
	st_03: {
		id: 'st_03',
		title: 'Insta Millionaire',
		subtitle: 'इंस्टा मिल्यनेर',
		description:
			'A rags to riches story of a young man who becomes an overnight millionaire.',
		genre: 'Suspense',
		coverUrl: '/assets/insta-millionaire.webp',
		totalEpisodes: 1440,
		plays: '1.4B',
		likes: '579.9K',
		shares: '236.1K',
		episodes: demoEpisodes,
	},
}

/**
 * Get story details by ID
 */
export function getStoryById(storyId: string): StoryDetails | undefined {
	return demoStoryDetails[storyId]
}
