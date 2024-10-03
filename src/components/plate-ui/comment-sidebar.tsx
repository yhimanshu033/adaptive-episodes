import React from 'react'
import useComments from '@/hooks/plate/use-comments'
import {
    CommentProvider,
    SCOPE_ACTIVE_COMMENT,
    useFloatingCommentsState,
} from '@udecode/plate-comments/react'
// import { useMyEditor } from "../plate-editor";
import { useEditorRef } from '@udecode/plate-common/react'
import { BlockSelectionPlugin } from '@udecode/plate-selection/react'

import { CommentCreateForm } from './comment-create-form'
import { CommentItem } from './comment-item'
import { CommentReplyItems } from './comment-reply-items'

export default function CommentSidebar() {
    const editor = useEditorRef()
    const { comments, get } = useComments()
    const { activeCommentId, loaded } = useFloatingCommentsState()
    const myUserId = get('myUserId')

    console.log({ comments })

    const commentExists = comments.find(
        (comment) => comment.id === activeCommentId
    )

    if (!loaded || !activeCommentId) return null
    return (
        <div className="flex flex-col gap-2 p-4">
            {comments.map((comment) => (
                <CommentProvider
                    id={comment.id}
                    key={comment.id}
                    scope={SCOPE_ACTIVE_COMMENT}
                >
                    <div
                        onClick={() => {
                            editor
                                .getApi(BlockSelectionPlugin)
                                .blockSelection.resetSelectedIds()
                            // editor.getApi(BlockSelectionPlugin).blockSelection.setSelectedIds({added: getEleme})
                        }}
                    // className={cn(popoverVariants())}
                    >
                        <CommentItem commentId={comment.id} />

                        <CommentReplyItems />

                        {!!myUserId && (
                            <CommentCreateForm isBlur={activeCommentId !== comment.id} />
                        )}
                    </div>
                </CommentProvider>
            ))}
            {!!myUserId && loaded && activeCommentId && !commentExists && (
                <CommentCreateForm />
            )}
        </div>
    )
}
