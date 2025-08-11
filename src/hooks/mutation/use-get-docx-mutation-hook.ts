import useDocxParams from '@/hooks/query/use-docx-params'
import { useMutation } from '@tanstack/react-query'

import { valueToHTML } from '@/lib/utils/plate'

export default function useDocxHtmlMutation() {
	const props = useDocxParams()

	const mutation = useMutation({
		mutationKey: ['get-docx-html-mutation'],
		mutationFn: async () => await valueToHTML(props),
	})

	return { ...mutation, ...props }
}
