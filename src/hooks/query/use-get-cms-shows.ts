// import { GET_CMS_SHOWS_QUERY_KEY } from '@/constants/query-constants'
// import { fetchAPI } from '@/lib/fetch-api'
// import { useQuery } from '@tanstack/react-query'

// const useGetCMSShows = (searchQuery?: string) => {

//     const getCMSShows = async () => {
//         const response = await fetchAPI<TGetCMSShowsAPIResponse, TNoParams, TNoParams, TGetCMSShowsQueryParams>({
//             url: API_URLS.GET_CMS_SHOWS,
//             method: 'GET',
//             query: {
//                 searchQuery,
//             },
//         })
//     }
// 	const query = useQuery({
// 		queryKey: [GET_CMS_SHOWS_QUERY_KEY],
// 		queryFn: () => getCMSShows(),
// 	})
// 	return query
// }
