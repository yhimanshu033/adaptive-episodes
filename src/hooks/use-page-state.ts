import { useQueryState } from 'nuqs'

export const usePageState = () => {
	const [currentPage, setCurrentPage] = useQueryState('page', {
		defaultValue: 1,
		parse: (value) => Number(value),
	})

	return { currentPage, setCurrentPage }
}
