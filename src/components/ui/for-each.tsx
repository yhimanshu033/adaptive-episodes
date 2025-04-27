import React from 'react'

export interface ForEachProps<T> {
	children: (data: T, index: number) => React.ReactNode
	data: T[]
}
export default function ForEach<T>({ data, children }: ForEachProps<T>) {
	return <>{data.map((item, index) => children(item, index))}</>
}
