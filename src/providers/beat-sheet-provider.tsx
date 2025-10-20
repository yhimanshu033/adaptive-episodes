import React from 'react'
import useBeatSheetEditorUtil from '@/hooks/use-beatsheet-editor'
import useBeatSheetEnabled from '@/hooks/use-beatsheet-enabled'

type TBeatSheetEditorContext = ReturnType<typeof useBeatSheetEditorUtil> | null
const BeatSheetEditorContext =
	React.createContext<TBeatSheetEditorContext>(null)

export function BeatSheetEditorEnabledContextProvider({
	children,
}: React.PropsWithChildren) {
	const value = useBeatSheetEditorUtil()
	return (
		<BeatSheetEditorContext.Provider value={value}>
			{children}
		</BeatSheetEditorContext.Provider>
	)
}

export function BeatSheetEditorContextProvider({
	children,
}: React.PropsWithChildren) {
	const isBSEEnabled = useBeatSheetEnabled()

	if (!isBSEEnabled) {
		return children
	}
	return (
		<BeatSheetEditorEnabledContextProvider>
			{children}
		</BeatSheetEditorEnabledContextProvider>
	)
}

export default function useBeatSheetEditor() {
	const context = React.useContext(BeatSheetEditorContext)
	if (!context) {
		throw new Error(
			'useBeatSheetEditor must be used inside BeatSheetEditorContextProvider!'
		)
	}
	return context
}
