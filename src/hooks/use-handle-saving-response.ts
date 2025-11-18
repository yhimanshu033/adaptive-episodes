import { useCallback } from 'react'
import useEpisodeIdStore from '@/store/episode-id-store'
import { toast } from 'sonner'

import { FetchResponseResult } from '@/lib/fetch-api'

import { TSaveEpisodeFailMessage } from '@/types/episode-type'

export default function useHandleSavingResponse() {
	const { setRecentEmail } = useEpisodeIdStore()

	const handleSavingResponse = useCallback(
		<T>({
			response,
			seq_no,
		}: {
			response: FetchResponseResult<T>
			seq_no?: number
		}) => {
			if (response.success) {
				return false
			}
			const message = response.message as TSaveEpisodeFailMessage

			if (message.email) {
				// check if someone else is editing chapter
				toast.error(
					`Saving failed, ${message.email} is currently working on the episode ${seq_no ? seq_no : ''}!`
				)
				setRecentEmail(message.email)
			} else {
				toast.error('Saving failed!')
			}
			return true
		},
		[setRecentEmail]
	)

	return { handleSavingResponse }
}
