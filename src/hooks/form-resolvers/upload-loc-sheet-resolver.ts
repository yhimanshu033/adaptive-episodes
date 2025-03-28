import { VALID_LOC_SHEET_FORMAT } from '@/constants/user-constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const uploadLOCSheetSchema = z.object({
	link: z
		.string()
		.refine(
			(value) => VALID_LOC_SHEET_FORMAT.test(value),
			'Please provide a valid Google Sheet link in the format: https://docs.google.com/spreadsheets/d/<spreadsheetId>/edit?gid=<gid>'
		),
})

export type UploadLOCSheetSchema = z.infer<typeof uploadLOCSheetSchema>

export const useUploadLOCSheetResolver = () =>
	useForm<UploadLOCSheetSchema>({
		resolver: zodResolver(uploadLOCSheetSchema),
		mode: 'onChange',
		defaultValues: {
			link: '',
		},
	})
