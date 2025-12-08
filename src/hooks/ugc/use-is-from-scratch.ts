import useEpisodeTableContext from '@/providers/episode-table-provider'

export default function useIsFromScratch() {
	const { initialStoryData } = useEpisodeTableContext()

	return !!initialStoryData?.props?.from_scratch
}
