import { PROMO_PAGE } from '@/constants/german-constants'
import { API_URLS } from '@/constants/global-constants'
import { TRANSLATE_VIDEO_MUTATION_KEY } from '@/constants/query-constants'
import useSocket from '@/hooks/use-socket'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { useMutation } from '@tanstack/react-query'

import { TVideoTranslationResponse } from '@/types/ai-types'

export default function useVideoTranslation() {
	const { startTask, getResponse } = useSocket()

	async function translateVideo({ file }: { file: File }) {
		try {
			const ffmpeg = new FFmpeg()
			await ffmpeg.load()
			ffmpeg.on('log', console.info)
			const inputFileName = 'input.mp4'
			const outputFileName = 'output.mp3'
			await ffmpeg.writeFile(inputFileName, await fetchFile(file))
			await ffmpeg.exec([
				'-i',
				inputFileName,
				'-q:a',
				'0',
				'-map',
				'a',
				outputFileName,
			])
			const audioData = await ffmpeg.readFile(outputFileName)

			const audioBlob = new Blob([audioData], { type: 'audio/mp3' })

			const formData = new FormData()
			formData.append('audio_file', audioBlob)

			const taskId = await startTask<FormData, TVideoTranslationResponse>({
				method: 'POST',
				url: API_URLS.TRANSLATE_VIDEO,
				body: formData,
			})

			const response = await getResponse<TVideoTranslationResponse>(taskId)

			console.log({ response })

			return response.translation || PROMO_PAGE.TRANSCRIPTION_FAILED
		} catch (error) {
			console.error(error)
		}
	}

	const translateVideoMutation = useMutation({
		mutationKey: [TRANSLATE_VIDEO_MUTATION_KEY],
		mutationFn: translateVideo,
	})

	return translateVideoMutation
}
