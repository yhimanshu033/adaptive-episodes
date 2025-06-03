/* eslint-disable @typescript-eslint/no-namespace */
import { TLocaleDict } from '@/constants/localization'

declare module 'next-intl' {
	interface AppConfig {
		Messages: TLocaleDict
	}
}

declare global {
	namespace JSX {
		interface IntrinsicElements {
			marquee: React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLMarqueeElement> & {
					behavior?: 'scroll' | 'slide' | 'alternate'
					bgcolor?: string
					direction?: 'left' | 'right' | 'up' | 'down'
					height?: string | number
					hspace?: number
					loop?: number
					scrollamount?: number
					scrolldelay?: number
					truespeed?: boolean
					vspace?: number
					width?: string | number
				},
				HTMLMarqueeElement
			>
		}
	}

	interface HTMLMarqueeElement extends HTMLElement {
		behavior: string
		bgcolor: string
		direction: string
		height: string
		hspace: number
		loop: number
		scrollAmount: number
		scrollDelay: number
		start(): void
		stop(): void
		trueSpeed: boolean
		vspace: number
		width: string
	}
}
