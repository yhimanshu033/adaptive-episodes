import React from 'react'
import { RenderNodeWrapperProps } from 'platejs/react'

import DiffComponent from '@/components/plate-ui-v2/diff-component'

function DiffBlock({
	...props
}: RenderNodeWrapperProps & { readonly?: boolean }) {
	return <DiffComponent isLeaf={false} {...props} />
}

export default DiffBlock
