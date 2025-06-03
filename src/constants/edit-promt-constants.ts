import { QUICK_PROMPTS } from './ai-constants'

export const promptTypes = [
	{ value: 'Stylize', label: 'Laser Tools: Stylize' },
	{ value: 'Expand', label: 'Laser Tools: Expand' },
	{ value: 'Shorten', label: 'Laser Tools: Shorten' },
	...QUICK_PROMPTS.map(({ text }) => ({
		value: text,
		label: text.slice(0, 50) + '...',
	})),
]
