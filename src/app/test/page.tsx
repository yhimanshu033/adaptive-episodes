'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const QuillEditor = dynamic(() => import('@/components/quill-editor'), {
	ssr: false,
})

export default function Page() {
	return <QuillEditor />
}
