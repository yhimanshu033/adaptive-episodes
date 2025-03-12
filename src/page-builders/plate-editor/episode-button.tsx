import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import useSaving from '@/hooks/use-saving'
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'

import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

interface EpisodeButtonProps {
	direction: 'previous' | 'next'
	episodeId: number | null
}

const EpisodeButton: React.FC<EpisodeButtonProps & ButtonProps> = ({
	episodeId,
	direction,
	className,
	...buttonProps
}) => {
	const router = useRouter()
	const { id } = useParams()
	const { handleSave } = useSaving()

	const handleEpisodeChange = async () => {
		if (!episodeId) return
		await handleSave({ startOverlayLoading: true })
		router.push(`/projects/${Number(id)}/${episodeId}/editor`)
	}

	return (
		<div>
			<Button
				tooltip={direction === 'previous' ? 'Previous Episode' : 'Next Episode'}
				variant={direction === 'previous' ? 'outline' : 'default'}
				size="icon"
				className={cn('rounded-full', className)}
				disabled={!episodeId}
				onClick={() => void handleEpisodeChange()}
				{...buttonProps}
			>
				{direction === 'previous' ? <CircleArrowLeft /> : <CircleArrowRight />}
			</Button>
		</div>
	)
}

export default EpisodeButton
