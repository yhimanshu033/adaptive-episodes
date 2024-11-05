import { createZustandStore } from '@udecode/plate-common'

/**
 * Creates an origin store using `zustood`.
 *
 * The purpose of this is to keep track of Lasers and their progress but only
 * storing the key to the lookup in the Element itself. We do it this way
 * because we don't want to modify the Editor value during the Laser or it
 * becomes part of the edit history.
 */

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
		.extendSelectors((state, get) => ({
			laser: (id: string): Laser | undefined => {
				const lasers = get.lasers()

				return lasers[id]
			},
			test: (): number => get.test(),
			getActive: (): string | undefined => get.active(),
		}))
}
