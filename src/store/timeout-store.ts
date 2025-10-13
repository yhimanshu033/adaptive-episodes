import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type TTimeoutStore = {
	decrementTimeouts: (key: string, val: number, minValue?: number) => void
	incrementTimeouts: (key: string, val: number, maxValue?: number) => void
	setTimeouts: (key: string, val: number) => void
	timeouts: Record<string, number>
}
const useTimeoutStore = create<TTimeoutStore>()(
	devtools(
		immer((set) => ({
			timeouts: {},
			setTimeouts: (key, val) =>
				set((state) => {
					state.timeouts = {
						...state.timeouts,
						[key]: val,
					}
				}),
			incrementTimeouts: (key, val, maxValue = 100) =>
				set((state) => {
					state.timeouts = {
						...state.timeouts,
						[key]: Math.min(maxValue, (state.timeouts[key] ?? 0) + val),
					}
				}),
			decrementTimeouts: (key, val, minValue = 0) =>
				set((state) => {
					state.timeouts = {
						...state.timeouts,
						[key]: Math.min(minValue, (state.timeouts[key] ?? 100) - val),
					}
				}),
		}))
	)
)

export default useTimeoutStore
