import { createZustandStore } from 'platejs'

export type Laser = {
	clientX?: number
	clientY?: number
	prompt: string
}

export function createLaserStore({
	lasers = {},
	test = 45,
	active = undefined,
}: {
	active?: string
	lasers?: Record<string, Laser>
	test?: number
} = {}) {
	const store = createZustandStore(
		{ lasers, test, active },
		{ mutative: true, name: 'laser' }
	)
		.extendActions(({ set, get }) => ({
			laser: (id: string, laser: Laser) => {
				set('lasers', { ...get('lasers'), [id]: laser })
			},
			test: (val: number) => {
				set('test', val)
			},
			setActive: (id: string) => {
				set('active', id)
			},
			reset: () => {
				set('lasers', {})
				set('test', 45)
				set('active', undefined)
			},
		}))
		.extendSelectors(({ get }) => ({
			laser: (id: string) => get('lasers')[id],
			test: () => get('test'),
			getActive: () => get('active'),
		}))

	return {
		...store,
		useLaserState: store.useState,
		useLaserValue: store.useValue,
	}
}
