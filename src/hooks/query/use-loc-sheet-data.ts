import { useParams } from 'next/navigation'
import { LOC_SHEET_QUERY_KEY } from '@/constants/query-constants'
import { getLOCSheet } from '@/server-action/localization-action'
import { useQuery } from '@tanstack/react-query'

const useLOCSheetData = () => {
	const { id } = useParams()
	const query = useQuery({
		queryKey: [LOC_SHEET_QUERY_KEY, Number(id)],
		queryFn: () => getLOCSheet(Number(id)),
	})
	return query
}

export default useLOCSheetData
