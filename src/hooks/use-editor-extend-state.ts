import { useParams } from 'next/navigation'
import { parseAsArrayOf, parseAsInteger, useQueryState } from 'nuqs'

export const useEditorExtendState = () => {
	const { episodeId }: { episodeId: string } = useParams()
	const [extended, setExtended] = useQueryState<number[]>('extend', {
		defaultValue: [Number(episodeId)],
		parse: (val) => parseAsArrayOf(parseAsInteger).parse(val),
		clearOnDefault: true,
	})

	return { extended, setExtended }
}
