import { Value } from '@udecode/plate-common'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const initialState: { value: Value } = {
	value: [],
}

const useDiffStore = create(devtools(immer(() => initialState)))

export const setDiffValue = (value: Value) => {
	useDiffStore.setState({ value })
}
export default useDiffStore
