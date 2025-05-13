import React, { useCallback, useEffect, useRef } from 'react'
import { useDebouncedObserver } from '@/hooks/use-debounced-observer'
import { useInfiniteQuery } from '@tanstack/react-query'

export type PaginationParams = { pageSize?: number; searchPage?: number }

export type UsePaginatedAPIArgs<ResponseT = unknown> = {
	getNextPage: (
		lastPage: ResponseT,
		allPages: ResponseT[]
	) => number | undefined
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
	getNextPage,
}: UsePaginatedAPIArgs<ResponseT>): UsePaginatedAPIRet<ResponseT> => {
	const {
		data,
		fetchNextPage,
		hasNextPage: canFetchNext,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: queryKey(initialPage),
		queryFn: async ({ pageParam = initialPage }) => queryFn(pageParam),
		getNextPageParam: (lastPage, allPages) => getNextPage(lastPage, allPages),
		initialPageParam: initialPage,
	})

	console.log({ data, canFetchNext })
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
		const observerRef = useRef<IntersectionObserver | null>(null)
		const bottomRef = useRef<HTMLDivElement | null>(null)

		const handleObserver = useCallback(
			(entries: IntersectionObserverEntry[]) => {
				const [entry] = entries
				if (entry.isIntersecting && canFetchNext) {
					void fetchNextPage()
				}
			},
			[]
		)

		const debouncedObserver = useDebouncedObserver(handleObserver, 500)

		useEffect(() => {
			if (observerRef.current) {
				observerRef.current.disconnect()
			}

			observerRef.current = new IntersectionObserver(debouncedObserver, {
				root: null,
				rootMargin: '100px',
				threshold: 1.0,
			})

			if (bottomRef.current) {
				observerRef.current.observe(bottomRef.current)
			}

			return () => observerRef.current?.disconnect()
		}, [debouncedObserver])

		return (
			<div {...props}>
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
