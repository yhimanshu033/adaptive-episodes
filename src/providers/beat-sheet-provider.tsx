import React from 'react'
import useBeatSheetEditorUtil from '@/hooks/use-beatsheet-editor'

type TBeatSheetEditorContext = ReturnType<typeof useBeatSheetEditorUtil> | null
const BeatSheetEditorContext =
	React.createContext<TBeatSheetEditorContext>(null)

export function BeatSheetEditorContextProvider({
	children,
}: React.PropsWithChildren) {
	const value = useBeatSheetEditorUtil()
	return (
		<BeatSheetEditorContext.Provider value={value}>
			{children}
		</BeatSheetEditorContext.Provider>
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
