export type PreferenceScores = {
	distracted: number
	immersive: number
	speed: number
}

export type PreferenceOption = {
	scores: PreferenceScores
	text: string
}

export type PreferenceQuestion = {
	id: number
	options: PreferenceOption[]
	question: string
}

export const ONBOARDING_QUESTIONS: PreferenceQuestion[] = [
	{
		id: 1,
		question: 'When do you typically listen to audiobooks?',
		options: [
			{
				text: 'During my commute or while driving',
				scores: { speed: 1, immersive: 0, distracted: 3 },
			},
			{
				text: 'While doing chores or exercising',
				scores: { speed: 1, immersive: 0, distracted: 3 },
			},
			{
				text: 'Relaxing at home with full attention',
				scores: { speed: 0, immersive: 3, distracted: 0 },
			},
			{
				text: 'Before bed to wind down',
				scores: { speed: 0, immersive: 2, distracted: 1 },
			},
			{
				text: 'During short breaks when I have limited time',
				scores: { speed: 3, immersive: 0, distracted: 1 },
			},
		],
	},
	{
		id: 2,
		question:
			'How do you feel about detailed descriptions of settings and environments?',
		options: [
			{
				text: 'Love them - they help me visualize the world',
				scores: { speed: 0, immersive: 3, distracted: 0 },
			},
			{
				text: "They're okay if they don't slow down the story",
				scores: { speed: 1, immersive: 1, distracted: 1 },
			},
			{
				text: 'I prefer to get to the action quickly',
				scores: { speed: 3, immersive: 0, distracted: 1 },
			},
			{
				text: 'Sometimes I zone out during long descriptions',
				scores: { speed: 1, immersive: 0, distracted: 3 },
			},
		],
	},
	{
		id: 3,
		question: 'What playback speed do you usually use?',
		options: [
			{
				text: '1x - I like the natural pace',
				scores: { speed: 0, immersive: 2, distracted: 1 },
			},
			{
				text: '1.25x - Slightly faster feels right',
				scores: { speed: 2, immersive: 1, distracted: 1 },
			},
			{
				text: '1.5x or faster - I want to get through books quickly',
				scores: { speed: 3, immersive: 0, distracted: 0 },
			},
			{
				text: 'It depends on the book',
				scores: { speed: 1, immersive: 1, distracted: 1 },
			},
		],
	},
	{
		id: 4,
		question:
			'How often do you find yourself rewinding because you missed something?',
		options: [
			{
				text: "Rarely - I'm usually focused",
				scores: { speed: 1, immersive: 2, distracted: 0 },
			},
			{
				text: 'Sometimes - when the story gets complex',
				scores: { speed: 1, immersive: 1, distracted: 2 },
			},
			{
				text: "Often - I'm usually doing something else",
				scores: { speed: 0, immersive: 0, distracted: 3 },
			},
			{
				text: "I don't rewind, I just keep going",
				scores: { speed: 2, immersive: 0, distracted: 2 },
			},
		],
	},
	{
		id: 5,
		question: 'What matters most to you in an audiobook experience?',
		options: [
			{
				text: 'Rich, atmospheric storytelling that pulls me in',
				scores: { speed: 0, immersive: 3, distracted: 0 },
			},
			{
				text: 'Getting through the story efficiently',
				scores: { speed: 3, immersive: 0, distracted: 0 },
			},
			{
				text: 'Being able to follow along easily while multitasking',
				scores: { speed: 0, immersive: 0, distracted: 3 },
			},
			{
				text: 'A balance of everything',
				scores: { speed: 1, immersive: 1, distracted: 1 },
			},
		],
	},
	{
		id: 6,
		question: 'When you return to an audiobook after a break, do you...',
		options: [
			{
				text: 'Remember exactly where I was and jump right in',
				scores: { speed: 1, immersive: 2, distracted: 0 },
			},
			{
				text: 'Need a moment to recall what was happening',
				scores: { speed: 1, immersive: 1, distracted: 2 },
			},
			{
				text: 'Often feel lost and wish there was a recap',
				scores: { speed: 0, immersive: 0, distracted: 3 },
			},
			{
				text: 'Rewind a bit to catch up quickly',
				scores: { speed: 2, immersive: 1, distracted: 1 },
			},
		],
	},
	{
		id: 7,
		question: 'How would you describe your ideal audiobook pacing?',
		options: [
			{
				text: 'Slow and savoring - let me live in the story',
				scores: { speed: 0, immersive: 3, distracted: 0 },
			},
			{
				text: 'Tight and fast - no wasted words',
				scores: { speed: 3, immersive: 0, distracted: 0 },
			},
			{
				text: 'Clear and structured - easy to follow',
				scores: { speed: 0, immersive: 0, distracted: 3 },
			},
			{
				text: 'Varies by mood and situation',
				scores: { speed: 1, immersive: 1, distracted: 1 },
			},
		],
	},
]

// Bucket types - 'original' is default when confidence is low
export type ListeningProfile = 'speed' | 'immersive' | 'distracted' | 'original'

// Confidence threshold - if no bucket scores above this, use ORIGINAL
export const CONFIDENCE_THRESHOLD = 0.4 // 40% of max possible score

/**
 * Calculate the maximum possible score for any bucket
 * Used to determine confidence threshold
 */
export function getMaxPossibleScore(): number {
	let maxScore = 0
	for (const question of ONBOARDING_QUESTIONS) {
		let questionMax = 0
		for (const option of question.options) {
			const optionMax = Math.max(
				option.scores.speed,
				option.scores.immersive,
				option.scores.distracted
			)
			questionMax = Math.max(questionMax, optionMax)
		}
		maxScore += questionMax
	}
	return maxScore
}

export type BucketResult = {
	bucket: ListeningProfile
	confidence: number
	maxPossibleScore: number
	meetsThreshold: boolean
	scores: PreferenceScores
	winningScore: number
}

/**
 * Calculate user's bucket based on their total scores
 */
export function calculateBucket(scores: PreferenceScores): BucketResult {
	const maxPossibleScore = getMaxPossibleScore()
	const { speed, immersive, distracted } = scores

	// Find winning bucket
	let winningBucket: ListeningProfile = 'original'
	let winningScore = 0

	if (speed > winningScore) {
		winningScore = speed
		winningBucket = 'speed'
	}
	if (immersive > winningScore) {
		winningScore = immersive
		winningBucket = 'immersive'
	}
	if (distracted > winningScore) {
		winningScore = distracted
		winningBucket = 'distracted'
	}

	// Calculate confidence
	const confidence = winningScore / maxPossibleScore

	// Apply confidence threshold
	const meetsThreshold = confidence >= CONFIDENCE_THRESHOLD
	const finalBucket = meetsThreshold ? winningBucket : 'original'

	return {
		bucket: finalBucket,
		scores,
		confidence: Math.round(confidence * 100) / 100,
		winningScore,
		maxPossibleScore,
		meetsThreshold,
	}
}

export const PROFILE_INFO: Record<
	ListeningProfile,
	{ description: string; emoji: string; title: string }
> = {
	speed: {
		title: 'Speed Listener',
		description: `You prefer efficient, fast-paced storytelling. We'll streamline the narrative for you.`,
		emoji: '⚡',
	},
	immersive: {
		title: 'Immersive Listener',
		description: `You love rich, atmospheric storytelling. We'll keep every vivid detail intact.`,
		emoji: '🎧',
	},
	distracted: {
		title: 'Multitasker',
		description: `You listen while doing other things. We'll make stories clearer with helpful recaps.`,
		emoji: '🔄',
	},
	original: {
		title: 'Balanced Listener',
		description: `You enjoy a balanced listening experience. We'll deliver the story as the author intended.`,
		emoji: '📖',
	},
}
