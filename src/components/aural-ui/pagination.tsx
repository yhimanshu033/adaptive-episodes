import React, { createContext, useContext, useMemo } from 'react'
import {
	useStandalonePagination,
	type UseStandalonePaginationProps,
	type UseStandalonePaginationReturn,
} from '@/hooks/aural-ui/use-standalone-pagination'
import { ChevronDoubleLeftIcon } from '@/icons/chevron-double-left-icon'
import { ChevronDoubleRightIcon } from '@/icons/chevron-double-right-icon'
import { ChevronLeftIcon } from '@/icons/chevron-left-icon'
import { ChevronRightIcon } from '@/icons/chevron-right-icon'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/aural-ui/utils'

import { SelectField, SelectItem, SelectSeparator } from './select'

/**
 * Pagination context interface - now just wraps the hook return
 */
export type PaginationContextProps = UseStandalonePaginationReturn

export interface PaginationProviderProps extends UseStandalonePaginationProps {
	children: React.ReactNode
}

const PaginationContext = createContext<PaginationContextProps | null>(null)

/**
 * Provider component for Pagination context
 */
export const PaginationProvider: React.FC<PaginationProviderProps> = ({
	children,
	...hookProps
}) => {
	const paginationState = useStandalonePagination(hookProps)

	const value = useMemo(() => paginationState, [paginationState])

	return (
		<PaginationContext.Provider value={value}>
			{children}
		</PaginationContext.Provider>
	)
}

/**
 * Hook to use pagination context
 */
export const usePagination = (): PaginationContextProps => {
	const context = useContext(PaginationContext)

	if (context === null) {
		throw new Error('usePagination must be used within a PaginationProvider')
	}

	return context
}

/**
 * Pagination Primitives
 */
// Base pagination container
export interface PaginationRootProps
	extends React.HTMLAttributes<HTMLDivElement> {
	className?: string
}

export const PaginationRoot = React.forwardRef<
	HTMLDivElement,
	PaginationRootProps
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'flex flex-wrap items-center justify-between gap-y-4',
			className
		)}
		{...props}
	/>
))
PaginationRoot.displayName = 'PaginationRoot'

// Pagination navigation container
export interface PaginationContentProps
	extends React.ComponentPropsWithoutRef<'nav'> {
	className?: string
	size?: 'sm' | 'md' | 'lg'
}

export const PaginationContent = React.forwardRef<
	HTMLElement,
	PaginationContentProps
>(({ className, ...props }, ref) => (
	<nav
		ref={ref}
		className={cn('flex items-center gap-2', className)}
		aria-label="Pagination navigation"
		{...props}
	/>
))
PaginationContent.displayName = 'PaginationContent'

interface PaginationSizeSelectorClasses {
	content?: {
		border?: string
		root?: string
		scrollButton?: {
			icon?: string
			root?: string
		}
		viewport?: string
	}
	label?: string
	select?: string
	trigger?: {
		icon?: string
		root?: string
	}
}

// Page size selector component
export interface PaginationSizeSelectorProps
	extends React.HTMLAttributes<HTMLDivElement> {
	className?: string
	classes?: PaginationSizeSelectorClasses
	label?: string
	pageSize: number
	pageSizeOptions?: number[]
	setPageSize: (size: number) => void
	size?: 'sm' | 'md' | 'lg'
}

const pageFontVariants = cva('', {
	variants: {
		size: {
			sm: '[font-size:var(--text-fm-sm)] leading-fm-sm',
			md: '[font-size:var(--text-fm-md)] leading-fm-md',
			lg: '[font-size:var(--text-fm-lg)] leading-fm-lg',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})

export const PaginationSizeSelector: React.FC<PaginationSizeSelectorProps> = ({
	className,
	size = 'md',
	pageSizeOptions = [10, 20, 50, 100],
	pageSize,
	setPageSize,
	label = 'PAGE SIZE',
	classes = {},
	...props
}) => {
	const selectId = React.useId()

	return (
		<SelectField
			id={selectId}
			value={pageSize.toString()}
			onValueChange={(val) => setPageSize(Number(val))}
			aria-label="Select page size"
			decoration="outline"
			label={label}
			classes={{
				root: cn(
					'flex items-center justify-center gap-4',
					className,
					classes.select
				),
				trigger: {
					root: cn('h-10 p-2 min-w-18', pageFontVariants({ size })),
					icon: pageIconVariants({ size }),
					...classes.trigger,
				},
				label: cn(
					'text-fm-tertiary',
					pageFontVariants({ size }),
					classes.label
				),
				content: {
					scrollButton: {
						icon: pageIconVariants({ size }),
					},
					...classes.content,
				},
			}}
			{...props}
		>
			{pageSizeOptions.map((option, index) => (
				<>
					<SelectItem
						key={option}
						value={option.toString()}
						classes={{
							root: cn('h-10', pageFontVariants({ size })),
							icon: pageIconVariants({ size }),
						}}
					>
						{option}
					</SelectItem>
					{index < pageSizeOptions.length - 1 && <SelectSeparator />}
				</>
			))}
		</SelectField>
	)
}
PaginationSizeSelector.displayName = 'PaginationSizeSelector'

export const pageIconVariants = cva('', {
	variants: {
		size: {
			sm: 'size-5',
			md: 'size-6',
			lg: 'size-7',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})

// Item variants for buttons and items
export const pageButtonVariants = cva(
	'flex items-center justify-center transition-colors duration-200 border rounded-fm-s disabled:cursor-not-allowed font-fm-text cursor-pointer focus-visible:ring-fm-primary focus-visible:ring-offset-fm-contrast outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
	{
		variants: {
			size: {
				sm: 'size-8 [font-size:var(--text-fm-sm)] leading-fm-sm',
				md: 'size-10 [font-size:var(--text-fm-md)] leading-fm-md',
				lg: 'size-12 [font-size:var(--text-fm-lg)] leading-fm-lg',
			},
			variant: {
				number:
					'border-fm-divider-tertiary text-fm-primary hover:border-fm-divider-contrast disabled:hover:border-fm-divider-tertiary disabled:text-fm-inactive',
				active:
					'bg-fm-surface-contrast text-fm-contrast border-fm-divider-contrast disabled:bg-fm-surface-primary disabled:text-fm-inactive ',
				navigation:
					'border-fm-divider-tertiary text-fm-primary hover:border-fm-divider-contrast disabled:hover:border-fm-divider-tertiary disabled:text-fm-inactive',
				ellipsis: 'text-fm-tertiary cursor-default border-transparent',
			},
		},
		defaultVariants: {
			size: 'md',
			variant: 'number',
		},
	}
)

// Page button component
export interface PaginationButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string
	size?: 'sm' | 'md' | 'lg'
	variant?: 'number' | 'active' | 'navigation'
}

export const PaginationButton = React.forwardRef<
	HTMLButtonElement,
	PaginationButtonProps
>(({ className, size = 'md', variant = 'number', ...props }, ref) => (
	<button
		ref={ref}
		className={cn(pageButtonVariants({ size, variant }), className)}
		{...props}
	/>
))
PaginationButton.displayName = 'PaginationButton'

// Ellipsis component
export interface PaginationEllipsisProps
	extends React.HTMLAttributes<HTMLSpanElement> {
	className?: string
	size?: 'sm' | 'md' | 'lg'
}

export const PaginationEllipsis = React.forwardRef<
	HTMLSpanElement,
	PaginationEllipsisProps
>(({ className, size = 'md', ...props }, ref) => (
	<span
		ref={ref}
		className={cn(pageButtonVariants({ variant: 'ellipsis', size }), className)}
		aria-hidden="true"
		{...props}
	>
		…
	</span>
))
PaginationEllipsis.displayName = 'PaginationEllipsis'

/**
 * Pagination Primitives Composition
 */
export interface PaginationProps {
	/**
	 * Additional CSS class name
	 */
	className?: string

	/**
	 * Custom classes for styling
	 */
	classes?: {
		button?: string
		content?: string
		ellipsis?: string
		icon?: string
		root?: string
		sizeSelector?: PaginationSizeSelectorClasses
	}

	/**
	 * Available page sizes
	 */
	pageSizeOptions?: number[]

	/**
	 * Show first/last page navigation buttons
	 */
	showFirstLast?: boolean

	/**
	 * Show page size selector
	 */
	showPageSize?: boolean

	/**
	 * Size of the pagination component
	 */
	size?: 'sm' | 'md' | 'lg'
}

/**
 * Pagination component for navigating through paginated data
 */
export const Pagination: React.FC<PaginationProps> = ({
	className,
	size = 'md',
	showFirstLast = true,
	showPageSize = false,
	pageSizeOptions = [10, 20, 50, 100],
	classes = {},
}) => {
	const {
		currentPage,
		pageSize,
		setPage,
		nextPage,
		prevPage,
		firstPage,
		lastPage,
		setPageSize,
		isFirstPage,
		isLastPage,
		visiblePages,
	} = usePagination()

	return (
		<PaginationRoot className={cn(className, classes.root)}>
			{showPageSize && (
				<PaginationSizeSelector
					size={size}
					pageSizeOptions={pageSizeOptions}
					pageSize={pageSize}
					setPageSize={setPageSize}
					classes={classes.sizeSelector}
				/>
			)}

			<PaginationContent className={cn(classes.content)}>
				{showFirstLast && (
					<PaginationButton
						onClick={firstPage}
						disabled={isFirstPage}
						variant="navigation"
						size={size}
						className={cn(classes.button)}
						aria-label="Go to first page"
					>
						<ChevronDoubleLeftIcon className={pageIconVariants({ size })} />
					</PaginationButton>
				)}

				<PaginationButton
					onClick={prevPage}
					disabled={isFirstPage}
					variant="navigation"
					size={size}
					aria-label="Go to previous page"
					className={cn(classes.button)}
				>
					<ChevronLeftIcon
						className={cn(pageIconVariants({ size }), classes.icon)}
					/>
				</PaginationButton>

				{visiblePages.map((page, index) => {
					if (page < 0) {
						// It's an ellipsis
						return (
							<PaginationEllipsis
								key={`ellipsis-${index}`}
								size={size}
								className={cn(classes.ellipsis)}
							/>
						)
					}

					return (
						<PaginationButton
							key={page}
							onClick={() => setPage(page)}
							variant={currentPage === page ? 'active' : 'number'}
							size={size}
							aria-label={`Page ${page}`}
							aria-current={currentPage === page ? 'page' : undefined}
							className={cn(classes.button)}
						>
							{page}
						</PaginationButton>
					)
				})}

				<PaginationButton
					onClick={nextPage}
					disabled={isLastPage}
					variant="navigation"
					size={size}
					aria-label="Go to next page"
					className={cn(classes.button)}
				>
					<ChevronRightIcon
						className={cn(pageIconVariants({ size }), classes.icon)}
					/>
				</PaginationButton>

				{showFirstLast && (
					<PaginationButton
						onClick={lastPage}
						disabled={isLastPage}
						variant="navigation"
						size={size}
						aria-label="Go to last page"
						className={cn(classes.button)}
					>
						<ChevronDoubleRightIcon
							className={cn(pageIconVariants({ size }), classes.icon)}
						/>
					</PaginationButton>
				)}
			</PaginationContent>
		</PaginationRoot>
	)
}

Pagination.displayName = 'Pagination'
