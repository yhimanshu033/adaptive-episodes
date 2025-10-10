import { LucideIcon } from 'lucide-react'

export type TPopupOptions = {
	cancelText?: string
	confirmText?: string
	description?: string
	icon?: LucideIcon
	onCancel?: () => void
	onConfirm?: () => void
	title?: string
	type?: 'neutral' | 'positive' | 'negative' | 'warning' | 'info'
}

export type TPopupListener = (options: TPopupOptions | null) => void

const listeners = new Set<TPopupListener>()

export const popupStore = {
	open: (options: TPopupOptions) => {
		listeners.forEach((l) => l(options))
	},
	close: () => {
		listeners.forEach((l) => l(null))
	},
	subscribe: (listener: TPopupListener) => {
		listeners.add(listener)
		return () => listeners.delete(listener)
	},
}

// globally callable function
export const popup = popupStore.open
