import React, { useCallback, useEffect, useRef } from 'react'
import { useDebouncedObserver } from '@/hooks/use-debounced-observer'
import {
	GetNextPageParamFunction,
	GetPreviousPageParamFunction,
	useInfiniteQuery,
} from '@tanstack/react-query'

export type PaginationParams = { pageSize?: number; searchPage?: number }

export type UsePaginatedAPIArgs<ResponseT = unknown> = {
	enabled?: boolean
	getNextPageParam: GetNextPageParamFunction<number, ResponseT>
	getPreviousPageParam?: GetPreviousPageParamFunction<number, ResponseT>
	initialPage?: number
	queryFn: (pageParam: number) => Promise<ResponseT>
	queryKey: (pageParam: number) => unknown[]
}

export type UsePaginatedAPIRet<ResponseT = unknown> = {
	InfiniteScrollWithDebouncing: ({
		children,
		skeleton,
		...props
	}: {
		children?: React.ReactNode
		skeleton?: React.ReactNode
	} & React.HTMLAttributes<HTMLDivElement>) => React.JSX.Element
	data: ResponseT[]
	fetchNextPage: () => void
	isFetchingNextPage: boolean
	reset: () => void
}

export const usePaginatedAPI = <ResponseT = unknown,>({
	queryKey,
	queryFn,
	initialPage = 1,
	getNextPageParam,
	getPreviousPageParam,
	enabled = true,
}: UsePaginatedAPIArgs<ResponseT>): UsePaginatedAPIRet<ResponseT> => {
	const {
		data,
		fetchNextPage,
		hasNextPage: canFetchNext,
		hasPreviousPage: canFetchPrev,
		fetchPreviousPage,
		isFetchingPreviousPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: queryKey(initialPage),
		queryFn: async ({ pageParam = initialPage }) => queryFn(pageParam),
		getNextPageParam,
		getPreviousPageParam,
		initialPageParam: initialPage,
		enabled,
	})

	const reset = useCallback(() => {
		void refetch()
	}, [refetch])

	const flattenedData = data?.pages ?? []

	const InfiniteScrollWithDebouncing = ({
		children,
		skeleton = <div>Loading...</div>,
		...props
	}: {
		children?: React.ReactNode
		skeleton?: React.ReactNode
	} & React.HTMLAttributes<HTMLDivElement>) => {
		const bottomObserverRef = useRef<IntersectionObserver | null>(null)
		const topObserverRef = useRef<IntersectionObserver | null>(null)
		const bottomRef = useRef<HTMLDivElement | null>(null)
		const topRef = useRef<HTMLDivElement | null>(null)

		const handleBottomObserver = useCallback(
			(entries: IntersectionObserverEntry[]) => {
				const [entry] = entries
				if (entry.isIntersecting && canFetchNext) {
					void fetchNextPage()
				}
			},
			[]
		)

		const handleTopObserver = useCallback(
			(entries: IntersectionObserverEntry[]) => {
				const [entry] = entries
				if (entry.isIntersecting && canFetchPrev) {
					void fetchPreviousPage()
				}
			},
			[]
		)

		const bottomDebouncedObserver = useDebouncedObserver(
			handleBottomObserver,
			500
		)
		const topDebouncedObserver = useDebouncedObserver(handleTopObserver, 500)

		useEffect(() => {
			if (bottomObserverRef.current) {
				bottomObserverRef.current.disconnect()
			}

			bottomObserverRef.current = new IntersectionObserver(
				bottomDebouncedObserver,
				{
					root: null,
					rootMargin: '20px',
					threshold: 1.0,
				}
			)

			if (bottomRef.current) {
				bottomObserverRef.current.observe(bottomRef.current)
			}

			return () => bottomObserverRef.current?.disconnect()
		}, [bottomDebouncedObserver])

		useEffect(() => {
			if (topObserverRef.current) {
				topObserverRef.current.disconnect()
			}

			topObserverRef.current = new IntersectionObserver(topDebouncedObserver, {
				root: null,
				rootMargin: '20px',
				threshold: 1.0,
			})

			if (topRef.current) {
				topObserverRef.current.observe(topRef.current)
			}

			return () => topObserverRef.current?.disconnect()
		}, [topDebouncedObserver])

		return (
			<div {...props}>
				<div ref={topRef} className="invisible h-0.5" />
				{isFetchingPreviousPage && skeleton}
				{children}
				{isFetchingNextPage && skeleton}
				<div ref={bottomRef} className="invisible h-0.5" />
			</div>
		)
	}

	return {
		data: flattenedData,
		fetchNextPage: () => void fetchNextPage(),
		reset,
		isFetchingNextPage,
		InfiniteScrollWithDebouncing,
	}
}
