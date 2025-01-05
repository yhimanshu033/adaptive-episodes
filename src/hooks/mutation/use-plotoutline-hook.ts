'use client'

import { useMutation } from '@tanstack/react-query'

import { PlotExplorerParams } from '@/types/ai-types'

import useSocketStreaming from '../use-socket-streaming'

const usePlotOutlineHook = () => {
	const { startTask } = useSocketStreaming()
	async function getPlotOutline(params: PlotExplorerParams) {
		console.log(params)
		const taskId = await startTask({
			method: 'POST',
			url: '/aicopilot/explorer',
			body: params,
		})
		return taskId
	}
	const plotlineMutation = useMutation({
		mutationKey: ['plotoutline'],
		mutationFn: getPlotOutline,
	})
	return { plotlineMutation }
}
export default usePlotOutlineHook
