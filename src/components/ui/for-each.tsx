import React from 'react'

export interface ForEachProps<T> {
	data: T[]
	render: (data: T, index: number) => React.ReactNode
}
export default function ForEach<T>({ data, render }: ForEachProps<T>) {
	return (
		<>
			{data.map((item, index) => (
				<React.Fragment key={index}>{render(item, index)}</React.Fragment>
			))}
		</>
	)
}
