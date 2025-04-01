'use client'

import { useCallback } from 'react'
import {
	DB_NAME,
	INDEXED_DB_KEYS,
	RECENT_STORE_NAME,
	STORE_NAME,
	VERSION,
} from '@/constants/global-constants'

import {
	TOpenedEpisodeList,
	TOpenedStories,
	TOpenedStoryPage,
} from '@/types/common'
import { SaveEpisodeParams } from '@/types/episode-type'

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000
const STORES = [STORE_NAME, RECENT_STORE_NAME]

export const useIndexedDB = () => {
	const openDB = useCallback((): Promise<IDBDatabase> => {
		return new Promise(
			(
				resolve: (arg0: IDBDatabase) => void,
				reject: (arg0: DOMException | null) => unknown
			) => {
				const request = indexedDB.open(DB_NAME, VERSION)

				request.onupgradeneeded = (event) => {
					const db = (event.target as IDBOpenDBRequest).result
					STORES.forEach((store) => {
						if (!db.objectStoreNames.contains(store)) {
							db.createObjectStore(store)
						}
					})
				}

				request.onsuccess = () => {
					const db = request.result
					clearOldEntries(db)
					resolve(db)
				}
				// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
				request.onerror = () => reject(request.error)
			}
		)
	}, [])

	const clearOldEntries = (db: IDBDatabase) => {
		const tx = db.transaction(STORE_NAME, 'readwrite')
		const store = tx.objectStore(STORE_NAME)
		const request = store.openCursor()
		const now = Date.now()

		request.onsuccess = () => {
			const cursor = request.result
			if (cursor) {
				const data = cursor.value as SaveEpisodeParams & { timestamp?: number }
				if (data.timestamp && now - data.timestamp > TWO_WEEKS_MS) {
					store.delete(cursor.primaryKey)
				}
				cursor.continue()
			}
		}
	}

	async function getData<T>(
		storeName: string,
		key: string
	): Promise<T | undefined> {
		try {
			const db = await openDB()
			return new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, 'readonly')
				const store = tx.objectStore(storeName)
				const request = store.get(key)

				request.onsuccess = () => resolve(request.result as T)
				// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
				request.onerror = () => reject(request.error)
			})
		} catch (error) {
			console.error(error)
		}
	}

	const setData = async (storeName: string, key: string, value: unknown) => {
		try {
			const db = await openDB()
			const tx = db.transaction(storeName, 'readwrite')
			const store = tx.objectStore(storeName)
			store.put(value, key)
		} catch (error) {
			console.error(error)
		}
	}

	const removeData = async (storeName: string, key: string) => {
		try {
			const db = await openDB()
			const tx = db.transaction(storeName, 'readwrite')
			const store = tx.objectStore(storeName)
			store.delete(key)
		} catch (error) {
			console.error(error)
		}
	}

	const setValue = async (key: string, value: SaveEpisodeParams) => {
		await setData(STORE_NAME, key, value)
	}

	const removeValue = async (key: string) => {
		await removeData(STORE_NAME, key)
	}

	const getValue = async (
		key: string
	): Promise<SaveEpisodeParams | undefined> => {
		return getData<SaveEpisodeParams>(STORE_NAME, key)
	}

	const getOpenedStories = async (): Promise<TOpenedStories | undefined> => {
		return getData<TOpenedStories>(
			RECENT_STORE_NAME,
			INDEXED_DB_KEYS.OPENED_PROJECTS
		)
	}

	const setOpenedStories = async (value: TOpenedStories) => {
		await setData(RECENT_STORE_NAME, INDEXED_DB_KEYS.OPENED_PROJECTS, value)
	}

	const getOpenedEpisodeList = async (
		project: number
	): Promise<TOpenedEpisodeList | undefined> => {
		return (
			await getData<TOpenedEpisodeList>(
				RECENT_STORE_NAME,
				INDEXED_DB_KEYS.OPENED_EPISODE_PAGES
			)
		)?.[project]
	}

	const setOpenedEpisodeList = async (value: TOpenedEpisodeList) => {
		await setData(
			RECENT_STORE_NAME,
			INDEXED_DB_KEYS.OPENED_EPISODE_PAGES,
			value
		)
	}

	const addOpenedEpisodeList = async (
		data: Partial<TOpenedStoryPage>,
		project: number
	) => {
		const prev =
			(await getData<TOpenedEpisodeList>(
				RECENT_STORE_NAME,
				INDEXED_DB_KEYS.OPENED_EPISODE_PAGES
			)) || {}
		await setData(RECENT_STORE_NAME, INDEXED_DB_KEYS.OPENED_EPISODE_PAGES, {
			...prev,
			[project]: { ...prev[project], ...data },
		})
	}

	return {
		setValue,
		getValue,
		removeValue,
		setOpenedEpisodeList,
		addOpenedEpisodeList,
		getOpenedEpisodeList,
		setOpenedStories,
		getOpenedStories,
	}
}
