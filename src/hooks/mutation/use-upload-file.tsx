import React from 'react'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { BubbleCrossedIcon } from '@/icons/bubble-crossed-icon'
import { uploadFile } from '@/server-action/file-upload'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useUploadFile() {
	const mutation = useMutation({
		mutationKey: ['upload-file'],
		mutationFn: uploadFile,
		onError: () => {
			toast.error('Error in file upload!', {
				icon: <BubbleCrossedIcon />,
			})
		},
		onSuccess: () => {
			toast.success('File uploaded successfully!', {
				icon: <BubbleCheckIcon />,
			})
		},
	})

	return mutation
}
