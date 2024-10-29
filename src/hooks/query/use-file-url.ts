import { fetchDownloadURL } from '@/server-action/file-action'
import { useQuery } from '@tanstack/react-query'

const useFileUrl = (url: string) => {
	const query = useQuery({
		queryKey: ['file', url],
		queryFn: () => fetchDownloadURL(url),
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})
	return query
}
export default useFileUrl
