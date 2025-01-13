import { useParams } from 'next/navigation'
import { SIDEBAR_DISABLED } from '@/constants/episodes-constants'

export default function useDisableTools() {
	const { id } = useParams()

	return { isDisabled: SIDEBAR_DISABLED.includes(String(id)) }
}
