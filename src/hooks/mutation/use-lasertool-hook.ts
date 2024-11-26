import { useMutation } from '@tanstack/react-query'

import { LaserToolsApiResponse, LaserToolsParams } from '@/types/ai-types'

import useSocket from '../use-socket'

const useLaserToolsHook = () => {
	const { startTask, getResponse } = useSocket()
	async function onRephraseMutation(params: LaserToolsParams) {
		// return {
		//   action: '',
		//   nexttext: '',
		//   prevtext: '',
		//   result: 'some answer',
		//   text: 'some text',
		// } as LaserToolsApiResponse['data']
		const taskId = await startTask<LaserToolsParams>({
			method: 'POST',
			url: '/aicopilot/lasertools',
			body: params,
		})

		const response: LaserToolsApiResponse['data'] = await getResponse(taskId)
		return response
	}
	const laserToolsMutation = useMutation({
		mutationKey: ['lasertools'],
		mutationFn: onRephraseMutation,
	})
	return { laserToolsMutation }
}
export default useLaserToolsHook
