import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { resetDB } from '@/lib/utils/indexed-db'

export default function useIndexedDbMutations() {
	const clearDbMutation = useMutation({
		mutationKey: ['clear-indexed-db'],
		mutationFn: resetDB,
		onSuccess: () => {
			toast.success('Cleared local data!')
		},
	})

	return { clearDbMutation }
}
