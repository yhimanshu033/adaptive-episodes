'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { notesMessages } from '@/constants/episodes-constants'
import { NOTES_MUTATION } from '@/constants/query-constants'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { updateNotes } from '@/server-action/episode-action'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { TNotesUpdateBody } from '@/types/episode-type'

export default function useNotesMutation() {
	const { id } = useParams()
	const projectId = Number(id)

	const dict = useTranslations('placeholders')

	const onSuccess = (variables: TNotesUpdateBody) => {
		const message = notesMessages[variables.action]
		toast.success(message, {
			icon: <BubbleCheckIcon />,
		})
	}

	const onError = () => {
		toast.error(dict('somethingWentWrong'), {
			description: dict('notesError'),
			icon: <BubbleCrossedIcon />,
		})
	}

	const onUpdateNotes = (params: TNotesUpdateBody) =>
		updateNotes({ project_id: projectId, params })

	const updateNotesMutation = useMutation({
		mutationKey: [NOTES_MUTATION, projectId],
		mutationFn: onUpdateNotes,
		onSuccess: (_, variables) => onSuccess(variables),
		onError,
	})

	return updateNotesMutation
}
