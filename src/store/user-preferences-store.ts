import {
	BucketResult,
	calculateBucket,
	ListeningProfile,
	PreferenceScores,
} from '@/page-builders/demo-story-listing/preferences/constants'
import { create } from 'zustand'

const PREFERENCES_STORAGE_KEY = 'demo_user_preferences'

export type UserPreferencesState = {
	answers: Record<number, number>
	bucketResult: BucketResult | null
	hasCompletedOnboarding: boolean
	profile: ListeningProfile | null
	// questionId -> optionIndex
	totalScores: PreferenceScores // Full bucket calculation result
}

type UserPreferencesActions = {
	/**
	 * Commit a complete set of answers and compute profile
	 * This is used when the user completes the onboarding flow
	 */
	commitAnswers: (
		answers: Record<number, number>,
		totalScores: PreferenceScores
	) => void
	/**
	 * Load preferences from localStorage
	 */
	loadFromStorage: () => void
	/**
	 * Reset preferences completely (for testing/debugging)
	 */
	resetPreferences: () => void
}

const initialState: UserPreferencesState = {
	hasCompletedOnboarding: false,
	answers: {},
	totalScores: { speed: 0, immersive: 0, distracted: 0 },
	profile: null,
	bucketResult: null,
}

function persistToStorage(state: UserPreferencesState) {
	if (typeof localStorage === 'undefined') {
		return
	}
	localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state))
}

function loadStoredPreferences(): UserPreferencesState | null {
	if (typeof localStorage === 'undefined') {
		return null
	}
	try {
		const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY)
		if (!raw) {
			return null
		}
		return JSON.parse(raw) as UserPreferencesState
	} catch {
		return null
	}
}

export const useUserPreferencesStore = create<
	UserPreferencesState & UserPreferencesActions
>((set) => ({
	...initialState,

	commitAnswers: (answers, totalScores) => {
		// Calculate the bucket using the algorithm
		const bucketResult = calculateBucket(totalScores)

		const newState: UserPreferencesState = {
			hasCompletedOnboarding: true,
			answers,
			totalScores,
			profile: bucketResult.bucket,
			bucketResult,
		}

		set(newState)
		persistToStorage(newState)
	},

	resetPreferences: () => {
		set(initialState)
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(PREFERENCES_STORAGE_KEY)
		}
	},

	loadFromStorage: () => {
		const stored = loadStoredPreferences()
		if (stored) {
			set(stored)
		}
	},
}))
