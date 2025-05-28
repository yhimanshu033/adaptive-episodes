/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

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

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds

const STORES = [STORE_NAME, RECENT_STORE_NAME]
export function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		try {
			const request = indexedDB.open(DB_NAME, VERSION)

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result
				try {
					STORES.forEach((store) => {
						if (db.objectStoreNames.contains(store)) {
							const tnx = db.transaction(store, 'readwrite').objectStore(store)
							const clearReq = tnx.clear()
							clearReq.onerror = (er) => {
								console.log(er)
							}
						} else {
							db.createObjectStore(store)
						}
					})
				} catch (error) {
					console.log(error)
				}
			}

			request.onsuccess = () => {
				const db = request.result
				resolve(db)
			}
			request.onerror = () => reject(request.error)
		} catch (error) {
			console.error(error)
			reject(error)
		}
	})
}

export const resetDB = async () => {
	const db = await openDB()
	STORES.forEach((store) => {
		if (db.objectStoreNames.contains(store)) {
			const tnx = db.transaction(store, 'readwrite').objectStore(store)
			const clearReq = tnx.clear()
			clearReq.onerror = (er) => {
				console.log(er)
			}
		} else {
			db.createObjectStore(store)
		}
	})
}

export const clearOldEntries = (db: IDBDatabase) => {
	try {
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

		tx.onerror = () =>
			console.error('Failed to clear old entries from IndexedDB')
	} catch (error) {
		console.error(error)
	}
}
export async function getData<T>(
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
			request.onerror = () => reject(request.error)
		})
	} catch (error) {
		console.error(error)
	}
}

export const setData = async (
	storeName: string,
	key: string,
	value: unknown
) => {
	try {
		const db = await openDB()
		const tx = db.transaction(storeName, 'readwrite')
		const store = tx.objectStore(storeName)
		store.put(value, key)
	} catch (error) {
		console.error(error)
	}
}

export const removeData = async (storeName: string, key: string) => {
	try {
		const db = await openDB()
		const tx = db.transaction(storeName, 'readwrite')
		const store = tx.objectStore(storeName)
		store.delete(key)
	} catch (error) {
		console.error(error)
	}
}

export const setValue = async (key: string, value: SaveEpisodeParams) => {
	await setData(STORE_NAME, key, value)
}

export const removeValue = async (key: string) => {
	await removeData(STORE_NAME, key)
}

export const getValue = async (
	key: string
): Promise<SaveEpisodeParams | undefined> => {
	return getData<SaveEpisodeParams>(STORE_NAME, key)
}

export const getOpenedStories = async (): Promise<
	TOpenedStories | undefined
> => {
	return getData<TOpenedStories>(
		RECENT_STORE_NAME,
		INDEXED_DB_KEYS.OPENED_PROJECTS
	)
}

export const setOpenedStories = async (value: TOpenedStories) => {
	await setData(RECENT_STORE_NAME, INDEXED_DB_KEYS.OPENED_PROJECTS, value)
}

export const getOpenedEpisodeList = async (): Promise<
	TOpenedEpisodeList | undefined
> => {
	return await getData<TOpenedEpisodeList>(
		RECENT_STORE_NAME,
		INDEXED_DB_KEYS.OPENED_EPISODE_PAGES
	)
}

export const setOpenedEpisodeList = async (value: TOpenedEpisodeList) => {
	await setData(RECENT_STORE_NAME, INDEXED_DB_KEYS.OPENED_EPISODE_PAGES, value)
}

export const addOpenedEpisodeList = async ({
	data,
	project,
}: {
	data: Partial<TOpenedStoryPage>
	project: number
}) => {
	const prev =
		(await getData<TOpenedEpisodeList>(
			RECENT_STORE_NAME,
			INDEXED_DB_KEYS.OPENED_EPISODE_PAGES
		)) || {}
	const newData = {
		...prev,
		[project]: { ...prev[project], ...data },
	}
	await setData(
		RECENT_STORE_NAME,
		INDEXED_DB_KEYS.OPENED_EPISODE_PAGES,
		newData
	)
	return newData
}
