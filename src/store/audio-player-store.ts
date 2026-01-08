import { Episode, StoryDetails } from '@/page-builders/story-player/data'
import { create } from 'zustand'

export type AudioPlayerState = {
	currentEpisode: Episode | null
	currentStory: StoryDetails | null
	currentTime: number
	duration: number
	isMuted: boolean
	isPlaying: boolean
	volume: number
}

type AudioPlayerActions = {
	pause: () => void
	play: () => void
	setCurrentEpisode: (episode: Episode) => void
	setCurrentStory: (story: StoryDetails) => void
	setCurrentTime: (time: number) => void
	setDuration: (duration: number) => void
	setIsMuted: (muted: boolean) => void
	setIsPlaying: (playing: boolean) => void
	setVolume: (volume: number) => void
	togglePlayPause: () => void
}

const initialState: AudioPlayerState = {
	currentStory: null,
	currentEpisode: null,
	isPlaying: false,
	isMuted: false,
	currentTime: 0,
	duration: 0,
	volume: 0.8,
}

export const useAudioPlayerStore = create<
	AudioPlayerState & AudioPlayerActions
>((set, get) => ({
	...initialState,

	setCurrentStory: (story) => set({ currentStory: story }),

	setCurrentEpisode: (episode) => {
		const { currentEpisode, isPlaying } = get()
		// If clicking the same episode, toggle play/pause
		if (currentEpisode?.id === episode.id) {
			set({ isPlaying: !isPlaying })
		} else {
			// New episode - start playing
			set({ currentEpisode: episode, isPlaying: true, currentTime: 0 })
		}
	},

	play: () => set({ isPlaying: true }),

	pause: () => set({ isPlaying: false }),

	setIsPlaying: (playing) => set({ isPlaying: playing }),

	togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

	setCurrentTime: (time) => set({ currentTime: time }),

	setDuration: (duration) => set({ duration }),

	setVolume: (volume) => set({ volume }),

	setIsMuted: (muted) => set({ isMuted: muted }),
}))
