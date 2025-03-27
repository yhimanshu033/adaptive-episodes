import { VALID_GOOGLE_DRIVE_FOLDER } from '@/constants/user-constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const uploadGDriveFolderSchema = z.object({
	link: z
		.string()
		.refine(
			(value) => VALID_GOOGLE_DRIVE_FOLDER.test(value),
			'Please provide a valid Google Drive Folder link in the format: https://drive.google.com/drive/folders/<folderId>'
		),
})

export type UploadGDriveFolderSchema = z.infer<typeof uploadGDriveFolderSchema>

export const useUploadGDriveFolderResolver = () =>
	useForm<UploadGDriveFolderSchema>({
		resolver: zodResolver(uploadGDriveFolderSchema),
		mode: 'onChange',
		defaultValues: {
			link: '',
		},
	})
