'use client'

import { LASER_LEAF_KEYS } from '@/constants/editor-constants'
import { API_URLS } from '@/constants/global-constants'
import { LASERTOOLS_QUERY_KEY } from '@/constants/query-constants'
import useSocket from '@/hooks/use-socket'
import { useQuery } from '@tanstack/react-query'
import { nanoid } from 'platejs'

import useProjectId from '@/providers/project-id-provider'

import { LaserToolsApiResponse, LaserToolsParams } from '@/types/ai-types'
import { TNoParams, TSocketQueryParams } from '@/types/common'

const useLaserToolsQuery = (key: string | null, params: LaserToolsParams) => {
	const { startTask, getResponse, deleteResponse } = useSocket()
	const { projectId } = useProjectId()
	async function onRephraseFn() {
		if (!key || !projectId) {
			return
		}

		const keyId = key?.split?.(LASER_LEAF_KEYS.ID_START)?.[1] || nanoid()
		const responseExists = deleteResponse(keyId)
		const taskId = responseExists ? keyId + '_' + nanoid(4) : keyId
		return {
			action: '',
			nexttext: '',
			prevtext: '',
			result: `Lehnte sich zurück, während ein feines Lächeln seine aristokratischen Züge umspielte. "Du zweifelst an der Existenz der Kampfaufzeichnungen, nachdem du die Falle durchschaut hast? Verständlich", bemerkte er mit einem Anflug von Anerkennung in seiner Stimme. Seine Augen fixierten Wolfram mit kalkulierender Neugier, als wolle er dessen Gedankengänge ergründen.

"Empire Castle ist bekannt für seine... kreativen Wahrheiten", erwiderte Wolfram kühl und hielt dem prüfenden Blick seines Gegenübers stand. Die Enttäuschung über die mögliche Täuschung nagte an ihm, doch er ließ sich nichts anmerken. Stattdessen verschränkte er die Arme vor der Brust, eine unbewusste Schutzgeste gegen weitere Manipulationen. "Man könnte fast meinen, die Kunst der Irreführung gehört zum Lehrplan eurer ehrwürdigen Institution."`,
			text: 'test',
		} as LaserToolsApiResponse['data']

		await startTask<LaserToolsParams, TNoParams, TNoParams, TSocketQueryParams>(
			{
				method: 'POST',
				url: API_URLS.STREAM_LASER,
				body: {
					...params,
					project_id: Number(projectId),
				},
				query: {
					task_id: taskId,
				},
				noCache: true,
			}
		)
		const response: LaserToolsApiResponse['data'] = await getResponse(taskId)
		return response
	}
	const laserToolsQuery = useQuery({
		queryKey: [LASERTOOLS_QUERY_KEY, key],
		queryFn: onRephraseFn,
		staleTime: Infinity,
	})
	const { data: actualData, isFetching } = laserToolsQuery
	return { ...laserToolsQuery, data: isFetching ? undefined : actualData }
}
export default useLaserToolsQuery
