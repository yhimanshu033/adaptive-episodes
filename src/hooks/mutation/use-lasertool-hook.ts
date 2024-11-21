import { useMutation } from '@tanstack/react-query'

import { LaserToolsParams } from '@/types/ai-types'

import useSocket from '../use-socket'

const useLaserToolsHook = () => {
	const { startTask, getResponse } = useSocket()
	async function onRephraseMutation(params: LaserToolsParams) {
		const taskId = await startTask<LaserToolsParams>({
			method: 'POST',
			url: '/aicopilot/lasertools',
			body: params,
		})
		return await getResponse(taskId)
	}
	const laserToolsMutation = useMutation({
		mutationKey: ['lasertools'],
		mutationFn: onRephraseMutation,
	})
	return { laserToolsMutation }
}
export default useLaserToolsHook
