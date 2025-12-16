import React from 'react'

import { Button } from '@/components/aural-ui/button'
import Search from '@/components/aural-ui/search'

const ImportFromCMS = () => {
	return (
		<section className="flex h-full flex-col justify-between px-8">
			<Search clearOnEnter={false} />
			<Button variant="secondary" noise="low" className="w-full">
				Import Series
			</Button>
		</section>
	)
}

export default ImportFromCMS
