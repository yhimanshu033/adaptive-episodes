/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React from 'react'
import {
	EditNoteFormSchemaFormSchema,
	useEditNoteFormResolver,
} from '@/hooks/form-resolvers/edit-note-resolver'
import useNotes from '@/hooks/use-notes'
import useEditorNoteStore from '@/store/edit-note-store'
import useEpisodeIdStore from '@/store/episode-id-store'
import { useEpisodeStore } from '@/store/episode-store'
import { nanoid } from '@udecode/plate'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/aural-ui/form'
import Input from '@/components/aural-ui/input'
import TextArea from '@/components/aural-ui/textarea'

import { TNote } from '@/types/plate-types'

const EditNote = () => {
	const { useEpisodeTableStore } = useEpisodeStore()
	const notes = useEpisodeTableStore(useShallow((state) => state.notes))
	const primaryButtonText = useEditorNoteStore((state) => state.mode)
	const setFormOpen = useEditorNoteStore((state) => state.setFormOpen)
	const { store, setActiveNoteId } = useEpisodeIdStore()
	const id = store(useShallow((state) => state.activeNoteId))
	const note = id ? notes.find((note) => note.id === id) : null
	const { handleAddNote, handleUpdateNotes } = useNotes()
	const initialValues = {
		title: note?.title || '',
		description: typeof note?.content === 'string' ? note.content : '',
	}

	const form = useEditNoteFormResolver(initialValues)

	const onSubmit = (data: EditNoteFormSchemaFormSchema) => {
		const { title, description } = data
		if (id) {
			handleUpdateNotes(id, { title: title, content: description })
		} else {
			const id = nanoid()
			const newNote: TNote = {
				id,
				title: title,
				content: description,
				edit: '',
				updateTime: new Date().toString(),
			}
			handleAddNote(newNote, true)
		}
		setFormOpen(false)
		setActiveNoteId(null)
		form.reset()
	}

	return (
		<div className="bg-fm-surface-primary absolute inset-0 top-0 px-6 pt-22">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-6"
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className="space-y-2">
								<FormLabel htmlFor="title" className="!sr-only">
									Title
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter title here"
										decoration="outline"
										id="title"
										{...field}
										maxLength={60}
										label="Title"
										classes={{
											label: 'pb-2',
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="space-y-2">
								<FormLabel htmlFor="description">Description</FormLabel>
								<FormControl>
									<TextArea
										placeholder="Enter description here"
										decoration="outline"
										id="description"
										{...field}
										autoGrow={false}
										rows={15}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex w-full items-center justify-end pt-3">
						<Button
							variant="text"
							onClick={() => {
								form.reset()
								setActiveNoteId(null)
								setFormOpen(false)
							}}
							innerClassName="h-9 text-fm-sm"
						>
							Cancel
						</Button>

						<Button
							isDisabled={
								!form.watch('title') ||
								!form.watch('description') ||
								!form.formState.isDirty
							}
							type="submit"
							innerClassName="h-9 text-fm-sm"
						>
							{primaryButtonText}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default EditNote
