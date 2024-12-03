'use client'

import { useParams } from 'next/navigation'
import useSocket from '@/hooks/use-socket'
import { useQuery } from '@tanstack/react-query'
import { useEditorState } from '@udecode/plate-common/react'

import { getText } from '@/lib/utils'

import { TLocalizeResponse } from '@/types/ai-types'

const useLocalizeHook = () => {
	const { id } = useParams()
	const { children } = useEditorState()
	const { startTask, getResponse } = useSocket()
	const onLocalize = async () => {
		const taskId = await startTask<{ text: string }>({
			method: 'POST',
			url: '/aicopilot/localize/',
			body: {
				text: getText(children),
			},
		})
		const response: TLocalizeResponse['result'] = await getResponse(taskId)
		return response
	}

	const localizeQuery = useQuery({
		queryKey: ['localize', id],
		queryFn: onLocalize,
	})
	return localizeQuery
}
export default useLocalizeHook
