import { uploadFile } from '@/server-action/file-upload'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useUploadFile() {
	const mutation = useMutation({
		mutationKey: ['upload-file'],
		mutationFn: uploadFile,
		onError: () => {
			toast.error('Error in file upload!')
		},
		onSuccess: () => {
			toast.success('File uploaded successfully!')
		},
	})

	return mutation
}
