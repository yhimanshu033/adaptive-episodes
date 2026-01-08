import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cva } from 'class-variance-authority'

import { cn } from '../../lib/aural-ui/utils'

const sliderRangeVariants = cva('', {
	variants: {
		variant: {
			default: 'bg-fm-neutral-500',
			primary: 'bg-fm-primary-500',
			secondary: 'bg-fm-secondary-500',
			positive: 'bg-fm-green-500',
			warning: 'bg-fm-yellow-500',
			info: 'bg-fm-blue-500',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

const sliderSizeVariants = cva('', {
	variants: {
		size: {
			sm: 'data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5',
			md: 'data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2',
			lg: 'data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})

const sliderThumbVariants = cva(
	'text-fm-primary font-fm-brand px-1 py-0.5 flex items-center gap-2 justify-center',
	{
		variants: {
			variant: {
				default: 'bg-fm-neutral-500 ring-fm-neutral-200',
				primary: 'bg-fm-primary-500 ring-fm-primary-200',
				secondary: 'bg-fm-secondary-500 ring-fm-secondary-200',
				positive: 'bg-fm-green-500 ring-fm-green-200',
				warning: 'bg-fm-yellow-500 ring-fm-yellow-200',
				info: 'bg-fm-blue-500 ring-fm-blue-200',
			},
			size: {
				sm: '[font-size:var(--text-fm-sm)] leading-fm-sm min-w-8 min-h-4',
				md: '[font-size:var(--text-fm-md)] leading-fm-md min-w-10 min-h-5',
				lg: '[font-size:var(--text-fm-lg)] leading-fm-lg min-w-12 min-h-6',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	}
)

interface SliderProps extends React.ComponentProps<
	typeof SliderPrimitive.Root
> {
	centeredTumbs?: boolean
	classes?: {
		range?: string
		root?: string
		thumb?: string
		track?: string
	}
	label?: string
	showLabel?: boolean
	size?: 'sm' | 'md' | 'lg'
	variant?:
		| 'default'
		| 'primary'
		| 'secondary'
		| 'positive'
		| 'warning'
		| 'info'
}

function Slider({
	className,
	defaultValue,
	value,
	variant = 'default',
	size = 'md',
	min = 0,
	max = 100,
	showLabel = true,
	label,
	centeredTumbs = false,
	classes = {},
	...props
}: SliderProps) {
	const _values = React.useMemo(
		() =>
			Array.isArray(value)
				? value
				: Array.isArray(defaultValue)
					? defaultValue
					: [min, max],
		[value, defaultValue, min, max]
	)

	return (
		<SliderPrimitive.Root
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			className={cn(
				'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
				className,
				classes?.root
			)}
			{...props}
		>
			<SliderPrimitive.Track
				data-slot="slider-track"
				className={cn(
					'bg-fm-surface-tertiary/40 relative grow overflow-hidden data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full',
					{ 'data-[orientation=horizontal]:[&_~_span]:top-0': !centeredTumbs },
					sliderSizeVariants({ size }),
					classes?.track
				)}
			>
				<SliderPrimitive.Range
					data-slot="slider-range"
					className={cn(
						'absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:left-0 data-[orientation=vertical]:w-full',
						sliderRangeVariants({ variant }),
						sliderSizeVariants({ size }),
						classes?.range
					)}
				/>
			</SliderPrimitive.Track>
			{Array.from({ length: _values.length }, (_, index) => (
				<SliderPrimitive.Thumb
					data-slot="slider-thumb"
					key={index}
					className={cn(
						'block shrink-0 transition-[color,box-shadow] hover:ring-2 focus-visible:ring-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
						sliderThumbVariants({ size, variant }),
						classes?.thumb
					)}
				>
					<span className="sr-only">Slider Thumb {index + 1}</span>
					{showLabel ? label || _values[index] : null}
				</SliderPrimitive.Thumb>
			))}
		</SliderPrimitive.Root>
	)
}

export { Slider }
