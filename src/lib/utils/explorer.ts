import { ExplorerType } from '@/types/ai-types'

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
	explorerData: string | ExplorerType | Partial<ExplorerType>
): string => {
	if (typeof explorerData === 'string') {
		return explorerData
	}

	const formatNode = (node: ExplorerType | Partial<ExplorerType>): string => {
		let result = ''

		if ('title' in node && node.title) {
			result += `${node.title}\n`
		}

		if (node.preContent) {
			result += `${node.preContent}\n`
		}

		if (typeof node.content === 'string') {
			result += `${node.content}\n`
		} else if (Array.isArray(node.content)) {
			node.content.forEach((child) => {
				result += formatNode(child)
			})
		}
		return result
	}

	return formatNode(explorerData)
}
