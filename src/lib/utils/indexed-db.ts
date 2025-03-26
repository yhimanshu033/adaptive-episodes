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
			request.onerror = () => reject(request.error)
		} catch (error) {
			console.error(error)
			reject(error)
		}
	})
}

export const setValue = async (key: string, value: SaveEpisodeParams) => {
	try {
		const db = await openDB()
		const tx = db.transaction(STORE_NAME, 'readwrite')
		const store = tx.objectStore(STORE_NAME)
		store.put(value, key)

		tx.onerror = () => console.error('Failed to save data to IndexedDB')
	} catch (error) {
		console.error(error)
	}
}

export const removeValue = async (key: string) => {
	try {
		const db = await openDB()
		const tx = db.transaction(STORE_NAME, 'readwrite')
		const store = tx.objectStore(STORE_NAME)
		store.delete(key)

		tx.oncomplete = () => {}

		tx.onerror = () => console.error('Failed to remove data from IndexedDB')
	} catch (error) {
		console.error(error)
	}
}

export const getValue = async (
	key: string
): Promise<SaveEpisodeParams | undefined> => {
	const db = await openDB()
	return new Promise((resolve, reject) => {
		try {
			const tx = db.transaction(STORE_NAME, 'readonly')
			const store = tx.objectStore(STORE_NAME)
			const request = store.get(key)

			request.onsuccess = () => resolve(request.result as SaveEpisodeParams)
			request.onerror = () => reject(request.error)
		} catch (error) {
			console.error(error)
			reject(error)
		}
	})
}

const clearOldEntries = (db: IDBDatabase) => {
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

export const getOpenedStories = async (): Promise<TOpenedStories> => {
	const db = await openDB()
	return new Promise((resolve) => {
		try {
			const tx = db.transaction(RECENT_STORE_NAME, 'readonly')
			const store = tx.objectStore(RECENT_STORE_NAME)
			const request = store.get(INDEXED_DB_KEYS.OPENED_PROJECTS)

			request.onsuccess = () =>
				resolve(request.result || ([] as TOpenedStories))
			request.onerror = () => resolve([])
		} catch (error) {
			console.error(error)
			resolve([])
		}
	})
}

export const setOpenedStories = async (value: TOpenedStories) => {
	try {
		const db = await openDB()
		const tx = db.transaction(RECENT_STORE_NAME, 'readwrite')
		const store = tx.objectStore(RECENT_STORE_NAME)
		store.put(value, INDEXED_DB_KEYS.OPENED_PROJECTS)

		tx.onerror = () => console.error('Failed to save data to IndexedDB')
	} catch (error) {
		console.error(error)
	}
}

export const getOpenedEpisodeList = async (): Promise<TOpenedEpisodeList> => {
	const db = await openDB()
	return new Promise((resolve) => {
		try {
			const tx = db.transaction(RECENT_STORE_NAME, 'readonly')
			const store = tx.objectStore(RECENT_STORE_NAME)
			const request = store.get(INDEXED_DB_KEYS.OPENED_EPISODE_PAGES)

			request.onsuccess = () => resolve(request.result || {})
			request.onerror = () => resolve({})
		} catch (error) {
			console.error(error)
			resolve({})
		}
	})
}

export const setOpenedEpisodeList = async (value: TOpenedEpisodeList) => {
	try {
		const db = await openDB()
		const tx = db.transaction(RECENT_STORE_NAME, 'readwrite')
		const store = tx.objectStore(RECENT_STORE_NAME)
		store.put(value, INDEXED_DB_KEYS.OPENED_EPISODE_PAGES)

		tx.onerror = () => console.error('Failed to save data to IndexedDB')
	} catch (error) {
		console.error(error)
	}
}

export const addOpenedEpisodeList = async ({
	data,
	project,
}: {
	data: Partial<TOpenedStoryPage>
	project: number
}) => {
	try {
		const db = await openDB()
		return new Promise((resolve) => {
			try {
				const tx = db.transaction(RECENT_STORE_NAME, 'readwrite')
				const store = tx.objectStore(RECENT_STORE_NAME)
				const request = store.get(INDEXED_DB_KEYS.OPENED_EPISODE_PAGES)

				request.onsuccess = () => {
					const prev = request?.result || {}
					store.put(
						{
							...prev,
							[project]: { ...prev[project], ...data },
						},
						INDEXED_DB_KEYS.OPENED_EPISODE_PAGES
					)
					tx.onerror = () => console.error('Failed to save data to IndexedDB')
					resolve(true)
				}
				request.onerror = () => resolve(false)
			} catch (error) {
				console.error(error)
				resolve(true)
			}
		})
	} catch (error) {
		console.error(error)
	}
}
