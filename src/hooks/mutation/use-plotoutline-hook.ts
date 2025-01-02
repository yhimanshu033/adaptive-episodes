'use client'

import { useMutation } from '@tanstack/react-query'

import { PlotExplorerParams } from '@/types/ai-types'

import useSocket from '../use-socket'

const usePlotOutlineHook = () => {
	const { startTask, getResponse } = useSocket()
	async function getPlotOutline(params: PlotExplorerParams) {
		console.log(params)
		const taskId = await startTask({
			method: 'POST',
			url: '/aicopilot/explorer',
			body: params,
		})
		return getResponse(taskId)
	}
	const plotlineMutation = useMutation({
		mutationKey: ['plotoutline'],
		mutationFn: getPlotOutline,
	})
	return { plotlineMutation }
}
export default usePlotOutlineHook
