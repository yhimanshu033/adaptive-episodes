'use client'

import React from 'react'
import { ACTION, EVENT_TYPE, SCREEN_NAME } from '@/constants/analytics'
import { MoonIcon } from '@/icons/moon-icon'
import { SunIcon } from '@/icons/sun-icon'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { track } from '@/lib/utils/analytics'
import { cn } from '@/lib/utils/helpers'

import { Switch } from './aural-ui/switch'

interface ThemeToggleProps {
	className?: undefined | string
	label?: boolean
}

export function ThemeToggle({ className, label }: ThemeToggleProps) {
	const { setTheme, theme } = useTheme()

	return (
		<Button
			size={label ? 'sm' : 'icon'}
			variant="ghost"
			className={cn('gap-2', className)}
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
		>
			<Sun className="size-6 dark:hidden" />
			<Moon className="hidden size-5 dark:block" />
			{label && <span>{theme === 'light' ? 'Light' : 'Dark'} Mode</span>}
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}

export function ThemeSwitch() {
	const { setTheme, resolvedTheme } = useTheme()

	const isDark = resolvedTheme === 'dark'

	function handleCheckChange(val: CheckedState) {
		const newTheme = val ? 'dark' : 'light'
		setTheme(newTheme)
		track({
			event: EVENT_TYPE.BUTTON_CLICK,
			screenName: SCREEN_NAME.EPISODE_EDITOR,
			metaData: {
				action: ACTION.THEME_TOGGLE,
				theme: newTheme,
			},
		})
	}

	return (
		<Switch
			checked={isDark}
			onCheckedChange={handleCheckChange}
			className="border-fm-divider-primary!"
			onIcon={<MoonIcon />}
			offIcon={<SunIcon />}
		/>
	)
}
