/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react'
import { PlateLeaf, PlateLeafProps } from 'platejs/react'

import DiffComponent from '@/components/plate-ui-v2/diff-component'

function DiffLeaf({ ...props }: PlateLeafProps & { readonly?: boolean }) {
	return (
		<PlateLeaf {...props}>
			<DiffComponent isLeaf element={props.leaf} {...props} />
		</PlateLeaf>
	)
}

export default DiffLeaf
