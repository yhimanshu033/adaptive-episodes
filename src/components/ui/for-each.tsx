import React from 'react'

export interface ForEachProps<T> {
	children: (data: T, index: number) => React.ReactNode
	data: T[]
}
export interface ForEachProps<T> {
	children: (data: T, index: number) => React.ReactNode
	data: T[]
	filter?: (item: T, index: number) => boolean
}

export default function ForEach<T>({
	data,
	children,
	filter,
}: ForEachProps<T>) {
	return data
		.filter(filter || (() => true))
		.map((item, index) => children(item, index))
}
