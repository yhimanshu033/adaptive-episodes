import { ExplorerType, PlotExplorerApiResponse } from '@/types/ai-types'

export const preProcessData = (data: ExplorerType): ExplorerType[] => {
	const splittingRegex = /^\s*(?=(?:Name:|Episode).*)/m
	const regex = /^\s*(?:Name:(.*)|(Episode\s*.*))$/m
	if (typeof data.content === 'string' && regex.test(data.content)) {
		return data.content.split(splittingRegex).map((block) => {
			const match = block.match(regex)
			const title = match?.[1]?.trim() || match?.[2]?.trim() || data?.title
			const content = block
				.replace(/^\s*(?:Name:(.*)|(Episode\s*.*))$/m, '')
				.trim()
			return { title, content }
		})
	}
	return [data]
}

export const formatExplorerData = (
	explorerData: PlotExplorerApiResponse['data'] | string
): string => {
	if (typeof explorerData === 'string') {
		return explorerData
	}

	return explorerData.reduce((formattedData, data) => {
		const processedData = preProcessData(data)
		processedData.forEach(({ title, content, preContent }) => {
			formattedData += `${title}\n${preContent ? ` ${preContent} \n` : ''}${typeof content === 'string' ? content : formatExplorerData(content)}\n\n`
		})
		return formattedData
	}, '')
}
