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
import { InputBase } from '@/components/aural-ui/input'
import { Typography } from '@/components/aural-ui/typography'
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
	const link = form.watch('link')

	const handleSubmit = ({ link }: UploadGDriveFolderSchema) => {
		updateGDriveFolderMutation.mutate({
			drive_folder_url: link,
			type: folderType,
		})
	}

	useEffect(() => {
		if (defaultLink) {
			form.reset({ link: defaultLink })
		}
	}, [defaultLink, form])

	const isSubmitDisabled =
		updateGDriveFolderMutation.isPending ||
		!form.formState.isDirty ||
		link.trim().length < 3

	return (
		<div className="space-y-3">
			<Typography
				transform="uppercase"
				variant="caption-medium"
				className="font-fm-brand"
			>
				Google Drive Folder
			</Typography>
			<Form {...form}>
				<form
					onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
					className="flex h-11 w-full items-center gap-3"
				>
					<div className="border-fm-divider-secondary focus-within:border-fm-divider-contrast flex w-11/12 items-center justify-between rounded-xs border-1 px-4 py-2 transition-all duration-300">
						<FormField
							control={form.control}
							name="link"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<InputBase
											unstyled
											className="placeholder:text-fm-md text-fm-md w-full border-none pr-4 outline-none"
											placeholder="Paste the google drive folder link here"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={isSubmitDisabled}
							variant="text"
							innerClassName={cn('text-sm !p-0 translate-y-0 uppercase', {
								'text-fm-tertiary cursor-disabled': isSubmitDisabled,
							})}
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
						target="_blank"
						tabIndex={link ? 0 : -1}
						aria-disabled={!link}
						className={cn(!link && 'pointer-events-none opacity-50')}
					>
						<IconButton
							type="button"
							shape="square"
							variant="outlined"
							label="redirect icon"
							icon={<ArrowRightUpIcon />}
							className="border-fm-divider-secondary"
						/>
					</Link>
				</form>
			</Form>
		</div>
	)
}

export default UpdateDriveFolder
