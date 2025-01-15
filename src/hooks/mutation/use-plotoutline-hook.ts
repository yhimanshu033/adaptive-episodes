'use client'

import { useParams } from 'next/navigation'
import useSocketStreaming from '@/hooks/use-socket-streaming'
import { getMetadata } from '@/server-action/metadata-action'
import { useMutation, useQuery } from '@tanstack/react-query'

import { PlotExplorerParams } from '@/types/ai-types'

const usePlotOutlineHook = ({ start, end }: { end: number; start: number }) => {
	const { startTask } = useSocketStreaming()
	const { id } = useParams()

	const { data: metadata, isLoading: isMetadataLoading } = useQuery({
		queryKey: ['metadata', id, start, end],
		queryFn: () => getMetadata(Number(id), Math.max(start - 1, 1), end),
	})

	async function getPlotOutline(params: PlotExplorerParams) {
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

	return { plotlineMutation, metadata: metadata?.data, isMetadataLoading }
}

export default usePlotOutlineHook
