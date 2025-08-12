import { GET_DOCX_HTML_MUTATION_KEY } from '@/constants/query-constants'
import useDocxParams from '@/hooks/query/use-docx-params'
import { useMutation } from '@tanstack/react-query'

import { valueToHTML } from '@/lib/utils/plate'

export default function useDocxHtmlMutation() {
	const props = useDocxParams()

	const mutation = useMutation({
		mutationKey: [GET_DOCX_HTML_MUTATION_KEY],
		mutationFn: async () => await valueToHTML(props),
	})

	return { ...mutation, ...props }
}
