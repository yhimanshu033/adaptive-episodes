const getMetaDataRange = (currEpisode: number, totalEpisodes: number) => {
	const range = 10
	const end = Math.min(Math.max(range, currEpisode + range / 2), totalEpisodes)
	const start = Math.min(
		Math.max(1, currEpisode - range / 2 + 1),
		Math.max(totalEpisodes - range + 1, 1)
	)
	return [start, end]
}
export default getMetaDataRange
