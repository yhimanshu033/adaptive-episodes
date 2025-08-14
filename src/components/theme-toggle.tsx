'use client'

import React from 'react'
import { MoonIcon } from '@/icons/moon-icon'
import { SunIcon } from '@/icons/sun-icon'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
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

	return (
		<Switch
			checked={isDark}
			onCheckedChange={(val) => setTheme(val ? 'dark' : 'light')}
			className="border-fm-divider-primary!"
			onIcon={<MoonIcon />}
			offIcon={<SunIcon />}
		/>
	)
}
