import { getPlotOutline } from '@/server-action/ai-action'
import { useMutation } from '@tanstack/react-query'

const usePlotOutlineHook = () => {
	const plotlineMutation = useMutation({
		mutationKey: ['plotoutline'],
		mutationFn: getPlotOutline,
	})
	return { plotlineMutation }
}
export default usePlotOutlineHook
