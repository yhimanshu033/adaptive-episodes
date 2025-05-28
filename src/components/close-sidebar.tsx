import React from 'react'
import usePlateStore from '@/store/plate-store'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

const CloseSidebar = () => {
	const { setSidebar } = usePlateStore()
	return (
		<Button
			size="icon"
			variant="ghost"
			className={cn(
				'absolute right-2 top-2 z-50 opacity-20 transition-all hover:opacity-100'
			)}
			tooltip="Close"
			onClick={() => setSidebar(null)}
		>
			<X />
		</Button>
	)
}

export default CloseSidebar
