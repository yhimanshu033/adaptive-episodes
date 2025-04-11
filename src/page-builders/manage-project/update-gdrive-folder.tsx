import React, { useEffect, useMemo } from 'react'
import {
	UploadGDriveFolderSchema,
	useUploadGDriveFolderResolver,
} from '@/hooks/form-resolvers/upload-gdrive-folder-resolver'
import { useGDriveUpdateMutation } from '@/hooks/mutation/use-gdrive-hook'
import { ArrowUpRight } from 'lucide-react'

import IfElse from '@/components/if-else'
import { IconLoader } from '@/components/loader'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useEpisodeTableContext from '@/providers/episode-table-provider'

import { EFolderType } from '@/types/admin-types'

const UpdateDriveFolder = ({ folderType }: { folderType: EFolderType }) => {
	const { initialStoryData } = useEpisodeTableContext()

	const defaultLink = useMemo(() => {
		if (!initialStoryData) return ''

		return folderType === EFolderType.BASE_SCRIPT
			? initialStoryData.base_script_drive_folder_url || ''
			: initialStoryData.cms_ready_drive_folder_url || ''
	}, [folderType, initialStoryData])

	const form = useUploadGDriveFolderResolver()
	const updateGDriveFolderMutation = useGDriveUpdateMutation()

	const handleSubmit = ({ link }: UploadGDriveFolderSchema) => {
		updateGDriveFolderMutation.mutate({
			drive_folder_url: link,
			type: folderType,
		})
	}

	const link = form.watch('link')

	useEffect(() => {
		if (!defaultLink) return

		form.setValue('link', defaultLink)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultLink])

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
				className="flex flex-1 gap-2"
			>
				<FormField
					control={form.control}
					name="link"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<Input
									placeholder="Paste the goolge drive folder link here"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<a
					href={link}
					target="_blank"
					className={buttonVariants({ size: 'icon', variant: 'outline' })}
					rel="noreferrer"
				>
					<ArrowUpRight size={16} />
				</a>
				<IfElse
					condition={updateGDriveFolderMutation.isPending}
					if={<IconLoader />}
					else={<Button>Update</Button>}
				/>
			</form>
		</Form>
	)
}

export default UpdateDriveFolder
