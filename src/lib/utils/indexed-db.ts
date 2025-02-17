/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { DB_NAME, STORE_NAME, VERSION } from '@/constants/global-constants'

import { SaveEpisodeParams } from '@/types/episode-type'

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds

export function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		try {
			const request = indexedDB.open(DB_NAME, VERSION)

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME)
				}
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
