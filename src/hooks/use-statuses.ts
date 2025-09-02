import useEpisodeContent from '@/hooks/query/use-episode-content'

export default function useStatuses() {
	const { latestStatus, data } = useEpisodeContent()

	return {
		latestStatus,
		selectedStatus: data?.chapter.status,
	}
}
