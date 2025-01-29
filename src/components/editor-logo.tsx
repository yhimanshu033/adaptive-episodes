import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'
import useSaving from '@/hooks/use-saving'

const EditorLogo = ({ className }: { className?: string }) => {
	const { handleSave } = useSaving()
	const router = useRouter()
	const handleClick = async () => {
		await handleSave()
		router.push('/')
	}
	return (
		<button
			role="link"
			onClick={() => void handleClick()}
			className="flex items-center gap-2 transition-all hover:scale-105"
		>
			<Image
				src={COPILOT_LOGO_URL}
				width={32}
				height={32}
				alt="Copilot Logo"
				loading="lazy"
			/>
			<span className={className}>Pocket CoPilot</span>
		</button>
	)
}

export default EditorLogo
