import { createZustandStore } from '@udecode/plate-common'

export type Laser = {
	clientX?: number
	clientY?: number
	prompt: string
}
export const createLaserStore = (
	{
		lasers: initialLasers = {},
		test,
		active,
	}: {
		active?: string
		lasers?: Record<string, Laser>
		test: number
	} = { test: 45 }
) => {
	return createZustandStore('laser')({ lasers: initialLasers, test, active })
		.extendActions((set, get) => ({
			laser: (id: string, laser: Laser): void => {
				const lasers = get.lasers()
				set.lasers({ ...lasers, [id]: laser })
			},
			test: (val: number): void => {
				set.test(val)
			},
			setActive: (id: string): void => {
				set.active(id)
			},
		}))
		.extendSelectors((_, get) => ({
			laser: (id: string): Laser | undefined => {
				const lasers = get.lasers()

				return lasers[id]
			},
			test: (): number => get.test(),
			getActive: (): string | undefined => get.active(),
		}))
}
