'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'

interface ThemeToggleProps {
	className?: undefined | string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
	const { setTheme, theme } = useTheme()

	return (
		<Button
			size="icon"
			variant="ghost"
			className={cn(className)}
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
		>
			<Sun className="h-6 w-[1.3rem] dark:hidden" />
			<Moon className="hidden size-5 dark:block" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
