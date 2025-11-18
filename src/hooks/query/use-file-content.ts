import { GET_FILE_CONTENT } from '@/constants/query-constants'
import { useQuery } from '@tanstack/react-query'

import { getGCSContent } from '@/lib/utils/gcs'

export default function useFileContent({ url }: { url?: string | null }) {
	const query = useQuery({
		queryKey: [GET_FILE_CONTENT, url],
		queryFn: () => getGCSContent({ url }),
		enabled: !!url,
	})

	return query
}
