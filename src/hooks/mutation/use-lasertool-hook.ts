import { rephraseText } from '@/server-action/ai-action'
import { useMutation } from '@tanstack/react-query'

const useLaserToolsHook = () => {
	const laserToolsMutation = useMutation({
		mutationKey: ['lasertools'],
		mutationFn: rephraseText,
	})
	return { laserToolsMutation }
}
export default useLaserToolsHook
