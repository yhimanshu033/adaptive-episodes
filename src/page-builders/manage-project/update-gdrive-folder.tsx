import React, { useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
	UploadGDriveFolderSchema,
	useUploadGDriveFolderResolver,
} from '@/hooks/form-resolvers/upload-gdrive-folder-resolver'
import { useGDriveUpdateMutation } from '@/hooks/mutation/use-gdrive-hook'
import { ArrowRightUpIcon } from '@/icons/arrow-right-up-icon'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/aural-ui/form'
import { IconButton } from '@/components/aural-ui/icon-button'
import Input from '@/components/aural-ui/input'
import IfElse from '@/components/if-else'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { cn } from '@/lib/utils/helpers'

import { EFolderType } from '@/types/admin-types'

const UpdateDriveFolder = ({ folderType }: { folderType: EFolderType }) => {
	const { initialStoryData } = useEpisodeTableContext()

	const defaultLink = useMemo(() => {
		if (!initialStoryData) {
			return ''
		}

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
		if (!defaultLink) {
			return
		}

		form.setValue('link', defaultLink)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultLink])

	return (
		<>
			<h3 className="font-fm-brand mt-4 text-sm tracking-wider uppercase">
				Google Drive Folder
			</h3>
			<Form {...form}>
				<form
					onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
					className="mt-2.5 flex w-full items-center gap-2"
				>
					<div className="border-fm-divider-secondary flex w-11/12 items-center justify-between border-1 p-3">
						<FormField
							control={form.control}
							name="link"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											unstyled
											className="w-full border-none pr-4 outline-none"
											placeholder="Paste the goolge drive folder link here"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={updateGDriveFolderMutation.isPending}
							variant="text"
							innerClassName={cn(
								(form.getValues('link').length < 3 ||
									updateGDriveFolderMutation.isPending) &&
									'text-fm-tertiary',
								'text-sm !p-0 -translate-y-0 uppercase truncate'
							)}
						>
							<IfElse
								condition={updateGDriveFolderMutation.isPending}
								else={<span>Update</span>}
								if={<CircularLoader />}
							/>
						</Button>
					</div>
					<Link
						href={link}
						tabIndex={link ? 0 : -1}
						aria-disabled={!link}
						className={cn(!link && 'pointer-events-none opacity-50')}
						target="_blank"
					>
						<IconButton
							shape="square"
							variant="outlined"
							icon={<ArrowRightUpIcon />}
							label="redirect icon"
							type="button"
						/>
					</Link>
				</form>
			</Form>
		</>
	)
}

export default UpdateDriveFolder
