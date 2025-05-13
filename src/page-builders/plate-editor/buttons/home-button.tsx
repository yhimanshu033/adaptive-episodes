import React from 'react'
import { useParams } from 'next/navigation'
import { EPISODE_LIST_QUERY_KEY } from '@/constants/query-constants'
import useExtendedSaving from '@/hooks/use-extended-saving'
import { Home } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function HomeButton() {
	const { id } = useParams()
	const { handleExitBySaving } = useExtendedSaving()

	const handleClick = async () => {
		await handleExitBySaving({
			route: `/projects/${String(id)}`,
			invalidate: [[EPISODE_LIST_QUERY_KEY, Number(id)]],
		})
	}

	return (
		<Button
			size="icon"
			variant="outline"
			className="rounded-full"
			onClick={() => void handleClick()}
		>
			<Home />
		</Button>
	)
}
