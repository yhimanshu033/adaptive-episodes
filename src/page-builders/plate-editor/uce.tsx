'use client'

import IfElse, { If, Else } from '@/components/if-else'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import useEditorConfig from '@/hooks/use-editor-config'
import { SavingContextProvider } from '@/hooks/use-saving'
import { EditorSkeletonLoader } from '@/page-builders/plate-editor/editor-skelton-loader'
import EpisodeHeader from '@/page-builders/plate-editor/episode-header'
import UnifiedCopilotEditorProvider from '@pocket-editor/features/unified-copilot-editor/provider'
import React from 'react'
import { DefaultEditor } from 'unified-editor'


const UCE = React.memo(() => {
    console.log("UCE")
    const { editorConfig } = useEditorConfig()

    console.log({ editorConfig })
    if (editorConfig?.contentConfig?.isLoading) {
        return <EditorSkeletonLoader />
    }

    return (
        <UnifiedCopilotEditorProvider
            config={editorConfig}
        >
            <Editor />
        </UnifiedCopilotEditorProvider>
    )
})
UCE.displayName = "UCE"
export default UCE

const Editor = React.memo(() => {
    console.log("hii")
    return (
        <div className='flex flex-col'>
            <SavingContextProvider>
                <EpisodeHeader />
                <DefaultEditor />
            </SavingContextProvider>
        </div>
    )
})