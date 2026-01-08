import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva } from 'class-variance-authority'

import { cn } from '../../lib/aural-ui/utils'

const tabsVariants = cva('', {
	variants: {
		size: {
			sm: '[font-size:var(--text-fm-md)] leading-fm-md p-2',
			md: '[font-size:var(--text-fm-xl)] leading-fm-xl px-3 pt-4 pb-3',
			lg: '[font-size:var(--text-fm-2xl)] leading-fm-2xl px-3 pt-4 pb-3',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})

// Create context for tabs size
const TabsContext = React.createContext<{
	size: 'sm' | 'md' | 'lg'
}>({
	size: 'md',
})

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
	size?: 'sm' | 'md' | 'lg'
}

function Tabs({ className, size = 'md', ...props }: TabsProps) {
	return (
		<TabsContext.Provider value={{ size }}>
			<TabsPrimitive.Root
				data-slot="tabs"
				className={cn('flex flex-col gap-2', className)}
				{...props}
			/>
		</TabsContext.Provider>
	)
}

function TabsList({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				'border-fm-divider-tertiary inline-flex items-center justify-center border-b',
				className
			)}
			{...props}
		/>
	)
}

interface TabsTriggerProps extends React.ComponentProps<
	typeof TabsPrimitive.Trigger
> {
	// Optional override for individual triggers
	className?: string
	size?: 'sm' | 'md' | 'lg'
}

function TabsTrigger({
	className,
	size: sizeProp,
	...props
}: TabsTriggerProps) {
	const { size: contextSize } = React.useContext(TabsContext)
	const size = sizeProp || contextSize // Individual size prop overrides context

	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				'group text-fm-tertiary relative inline-flex flex-1 items-center justify-center border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow]',
				'focus-visible:ring-fm-primary focus-visible:ring-offset-fm-contrast outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
				'disabled:pointer-events-none disabled:opacity-50',
				'data-[state=active]:text-fm-primary hover:text-fm-secondary',
				tabsVariants({ size }),
				className
			)}
			{...props}
		>
			{props.children}
			<div className="group-data-[state=active]:animate-fm-fadeIn group-hover:!animate-fm-fadeIn group-data-[state=inactive]:animate-fm-fadeOut pointer-events-none absolute top-0 right-0 -bottom-0.5 left-0 z-10">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="92"
					height="25"
					viewBox="0 0 92 25"
					fill="none"
					className="absolute bottom-0 h-1/2 w-full"
				>
					<g filter="url(#b)">
						<ellipse
							cx="44"
							cy="20"
							rx="32"
							ry="4"
							fill="url(#c)"
							style={{ mixBlendMode: 'screen' }}
						/>
					</g>
					<defs>
						<radialGradient
							id="c"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="matrix(0 16.1429 -32.0526 0 44 24)"
						>
							<stop stopColor="var(--color-fm-primary-600)" />
							<stop offset=".805" stopColor="var(--color-fm-secondary-300)" />
							<stop offset="1" stopColor="var(--color-fm-neutral-50)" />
						</radialGradient>
						<filter
							id="b"
							x="-4"
							y="0"
							width="96"
							height="40"
							filterUnits="userSpaceOnUse"
							colorInterpolationFilters="sRGB"
						>
							<feFlood floodOpacity="0" result="BackgroundImageFix" />
							<feBlend
								in="SourceGraphic"
								in2="BackgroundImageFix"
								result="shape"
							/>
							<feGaussianBlur
								stdDeviation="8"
								result="effect1_foregroundBlur_4031_2537"
							/>
						</filter>
					</defs>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="64"
					height="2"
					viewBox="0 0 64 2"
					fill="none"
					className="absolute bottom-0 h-[3px] w-full"
				>
					<path
						d="M0 1S19.503-.173 32 .022 64 1 64 1v1L0 1.995z"
						fill="url(#a)"
						style={{ mixBlendMode: 'screen' }}
					/>
					<defs>
						<radialGradient
							id="a"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="matrix(0 4.03571 -32.0526 0 32 2)"
						>
							<stop stopColor="var(--color-fm-primary-600)" />
							<stop offset=".61" stopColor="var(--color-fm-secondary-300)" />
							<stop offset="1" stopColor="var(--color-fm-neutral-50)" />
						</radialGradient>
					</defs>
				</svg>
			</div>
		</TabsPrimitive.Trigger>
	)
}

function TabsContent({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn('flex-1 outline-none', className)}
			{...props}
		/>
	)
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
