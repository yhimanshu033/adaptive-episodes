import React from 'react'
import { useSearchParams } from 'next/navigation'
import { SIMPLIFIED_VIEWABLE_EDITOR } from '@/constants/global-constants'
import { SeparatorHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function SplitButton(
	props: React.ComponentProps<'button'> & { tooltip?: string }
) {
	const searchParams = useSearchParams()
	const simplifiedEditor = searchParams.get(SIMPLIFIED_VIEWABLE_EDITOR)
	if (simplifiedEditor) {
		return null
	}
	return (
		<Button size="icon" variant="ghost" {...props}>
			<SeparatorHorizontal />
		</Button>
	)
}
