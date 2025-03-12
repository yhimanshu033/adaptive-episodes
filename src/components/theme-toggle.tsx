'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

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
