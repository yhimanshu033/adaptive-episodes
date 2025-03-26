import React, { useEffect, useMemo } from 'react'
import {
	UploadGDriveFolderSchema,
	useUploadGDriveFolderResolver,
} from '@/hooks/form-resolvers/upload-gdrive-folder-resolver'
import { useGDriveUpdateMutation } from '@/hooks/mutation/use-gdrive-hook'

import { IconLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useEpisodeTableContext from '@/providers/episode-table-provider'

const UpdateDriveFolder = () => {
	const { initialStoryData } = useEpisodeTableContext()

	const defaultLink = useMemo(
		() => initialStoryData?.cms_ready_drive_folder_url || '',
		[initialStoryData]
	)

	const form = useUploadGDriveFolderResolver()
	const updateGDriveFolderMutation = useGDriveUpdateMutation()

	const handleSubmit = ({ link }: UploadGDriveFolderSchema) => {
		updateGDriveFolderMutation.mutate(link)
	}

	useEffect(() => {
		if (!defaultLink) return

		form.setValue('link', defaultLink)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultLink])

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
				className="flex gap-2"
			>
				<FormField
					control={form.control}
					name="link"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<Input
									placeholder="Paste the google sheet link here"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{updateGDriveFolderMutation.isPending ? (
					<IconLoader />
				) : (
					<Button>Update</Button>
				)}
			</form>
		</Form>
	)
}

export default UpdateDriveFolder
