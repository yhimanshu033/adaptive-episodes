import * as React from 'react'
import { cva } from 'class-variance-authority'

import { TickIcon } from '../../icons/tick-icon'
import { cn } from '../../lib/aural-ui/utils'

// Types
export type StepperVariant = 'primary' | 'positive' | 'negative' | 'warning'
export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperSize = 'sm' | 'md' | 'lg'
export type StepperState = 'active' | 'inactive' | 'completed'

const stepperWrapperVariants = cva('flex relative gap-4', {
	variants: {
		orientation: {
			horizontal: 'flex-col items-start justify-start w-full',
			vertical: 'flex-row items-start h-full justify-start',
		},
	},
	defaultVariants: {
		orientation: 'horizontal',
	},
})

// Style variants
const stepperContainerVariants = cva('flex relative justify-between', {
	variants: {
		orientation: {
			horizontal: 'flex-row items-center w-full ',
			vertical: 'flex-col items-start h-full',
		},
	},
	defaultVariants: {
		orientation: 'horizontal',
	},
})

const stepperListVariants = cva('flex-1 flex items-center justify-between', {
	variants: {
		orientation: {
			horizontal: 'flex-row',
			vertical: 'flex-col',
		},
	},
	defaultVariants: {
		orientation: 'horizontal',
	},
})

const stepperLineVariants = cva('', {
	variants: {
		variant: {
			primary: '',
			positive: '',
			negative: '',
			warning: '',
		},
		state: {
			active: 'bg-fm-divider-secondary',
			inactive: 'bg-fm-divider-secondary',
			completed: '',
		},
		orientation: {
			horizontal: 'h-0.25 flex-grow',
			vertical: 'w-0.25 flex-grow',
		},
	},
	compoundVariants: [
		{
			variant: 'primary',
			state: 'completed',
			className: 'bg-fm-secondary-800',
		},
		{
			variant: 'positive',
			state: 'completed',
			className: 'bg-fm-positive',
		},
		{
			variant: 'negative',
			state: 'completed',
			className: 'bg-fm-negative',
		},
		{
			variant: 'warning',
			state: 'completed',
			className: 'bg-fm-warning',
		},
	],
	defaultVariants: {
		variant: 'primary',
		state: 'inactive',
		orientation: 'horizontal',
	},
})

const stepperStepVariants = cva(
	'flex items-center justify-center rounded-full border border-solid font-fm-brand',
	{
		variants: {
			variant: {
				primary: '',
				positive: '',
				negative: '',
				warning: '',
			},
			size: {
				sm: 'size-6 [font-size:var(--text-fm-xs)]',
				md: 'size-8 [font-size:var(--text-fm-sm)]',
				lg: 'size-10 [font-size:var(--text-fm-md)]',
			},
			state: {
				active: '',
				inactive: 'border-fm-divider-secondary  text-fm-tertiary',
				completed: '',
			},
		},
		compoundVariants: [
			{
				variant: 'primary',
				state: 'active',
				className: 'border-fm-divider-secondary text-fm-secondary-800',
			},
			{
				variant: 'primary',
				state: 'completed',
				className: 'border-fm-divider-brand-secondary text-fm-secondary-800',
			},
			{
				variant: 'positive',
				state: 'active',
				className: 'text-fm-positive border-fm-divider-secondary',
			},
			{
				variant: 'positive',
				state: 'completed',
				className: 'text-fm-positive border-fm-divider-positive',
			},
			{
				variant: 'negative',
				state: 'active',
				className: 'text-fm-negative border-fm-divider-secondary',
			},
			{
				variant: 'negative',
				state: 'completed',
				className: 'text-fm-negative border-fm-divider-negative',
			},
			{
				variant: 'warning',
				state: 'active',
				className: 'text-fm-warning border-fm-divider-secondary',
			},
			{
				variant: 'warning',
				state: 'completed',
				className: 'text-fm-warning border-fm-divider-warning',
			},
		],
		defaultVariants: {
			variant: 'primary',
			size: 'md',
			state: 'inactive',
		},
	}
)

const stepperCompletedIconVariants = cva('', {
	variants: {
		size: {
			sm: 'size-4',
			md: 'size-5',
			lg: 'size-6',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})

// Component interfaces
export interface StepperContextValue {
	activeStep: number
	getStepState: (stepIndex: number) => StepperState
	onStepClick?: (stepIndex: number) => void
	orientation: StepperOrientation
	size: StepperSize
	totalSteps: number
	variant: StepperVariant
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
	activeStep?: number
	'aria-label'?: string
	children?: React.ReactNode
	className?: string
	classes?: {
		completedIcon?: string
		container?: string
		content?: string
		line?: string
		list?: string
		listWrapper?: string
		step?: string
		wrapper?: string
	}
	onStepClick?: (stepIndex: number) => void
	orientation?: StepperOrientation
	size?: StepperSize
	stepLabels?: string[]
	steps?: number
	variant?: StepperVariant
}

export interface StepperStepProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode
	classes?: {
		completedIcon?: string
		line?: string
		listWrapper?: string
	}
	clickable?: boolean
	index: number
	isLast?: boolean
	label?: string
}

export interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode
}

// Context
const StepperContext = React.createContext<StepperContextValue | undefined>(
	undefined
)

// Hook for child components to access context
export const useStepperContext = () => {
	const context = React.useContext(StepperContext)
	if (!context) {
		throw new Error(
			'Stepper compound components must be used within a Stepper component'
		)
	}
	return context
}

// Atomic components
const StepperStep: React.FC<StepperStepProps> = ({
	index,
	isLast = false,
	label,
	className,
	clickable = false,
	classes = {},
	...props
}) => {
	const { variant, orientation, size, getStepState, totalSteps, onStepClick } =
		useStepperContext()
	const state = getStepState(index)

	const handleClick = () => {
		if (clickable && onStepClick) {
			onStepClick(index)
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (clickable && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault()
			handleClick()
		}
	}

	const stepNumber = index + 1
	const isClickable = clickable && onStepClick

	return (
		<React.Fragment>
			<div
				className={cn(
					stepperStepVariants({
						variant,
						size,
						state,
					}),
					'font-fm-text focus-visible:ring-fm-primary focus-visible:ring-offset-fm-contrast flex size-auto items-center justify-center gap-2 py-2 pr-4 pl-2 outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
					{ 'cursor-pointer': isClickable },
					className
				)}
				role={isClickable ? 'button' : undefined}
				tabIndex={isClickable ? 0 : undefined}
				onClick={isClickable ? handleClick : undefined}
				onKeyDown={isClickable ? handleKeyDown : undefined}
				aria-current={state === 'active' ? 'step' : undefined}
				aria-label={
					label
						? `Step ${stepNumber} of ${totalSteps}: ${label}. ${state === 'completed' ? 'Completed' : state === 'active' ? 'Current step' : 'Not completed'}`
						: `Step ${stepNumber} of ${totalSteps}. ${state === 'completed' ? 'Completed' : state === 'active' ? 'Current step' : 'Not completed'}`
				}
				{...props}
			>
				<div
					className={cn(
						stepperStepVariants({
							variant,
							size,
							state,
						}),
						classes.listWrapper
					)}
				>
					{state === 'completed' ? (
						<TickIcon
							aria-label="Completed"
							className={cn(
								stepperCompletedIconVariants({ size }),
								classes.completedIcon
							)}
						/>
					) : (
						<span aria-hidden="true">{`0${stepNumber}`}</span>
					)}
				</div>
				{label && <span aria-hidden="true">{label}</span>}
			</div>
			{!isLast && (
				<div
					className={cn(
						stepperLineVariants({
							variant,
							orientation,
							state,
						}),
						classes.line
					)}
					aria-hidden="true"
				/>
			)}
		</React.Fragment>
	)
}

const StepperContent: React.FC<StepperContentProps> = ({
	children,
	className,
	...props
}) => {
	const { activeStep } = useStepperContext()

	return (
		<div
			className={className}
			role="tabpanel"
			aria-label={`Step ${activeStep + 1} content`}
			{...props}
		>
			{children}
		</div>
	)
}

// Helper function to separate children by type
const useStepperChildren = (children: React.ReactNode) => {
	return React.useMemo(() => {
		const childrenArray = React.Children.toArray(children)

		const stepChildren = childrenArray.filter(
			(child) => React.isValidElement(child) && child.type === StepperStep
		)

		const contentChildren = childrenArray.filter(
			(child) => React.isValidElement(child) && child.type === StepperContent
		)

		const otherChildren = childrenArray.filter(
			(child) =>
				!React.isValidElement(child) ||
				(child.type !== StepperStep && child.type !== StepperContent)
		)

		return {
			stepChildren,
			contentChildren,
			otherChildren,
			hasStepperStep: stepChildren.length > 0,
			hasStepperContent: contentChildren.length > 0,
		}
	}, [children])
}

// Helper function to render step items
const useStepItems = (
	stepChildren: React.ReactNode[],
	totalSteps: number,
	onStepClick?: (index: number) => void
) => {
	return React.useMemo(() => {
		return stepChildren.map((child, index) => {
			if (React.isValidElement(child)) {
				return React.cloneElement(
					child as React.ReactElement<StepperStepProps>,
					{
						key: index,
						index,
						isLast: index === totalSteps - 1,
						clickable: !!onStepClick,
						classes: {
							completedIcon: (child as React.ReactElement<StepperStepProps>)
								.props.classes?.completedIcon,
							line: (child as React.ReactElement<StepperStepProps>).props
								.classes?.line,
							listWrapper: (child as React.ReactElement<StepperStepProps>).props
								.classes?.listWrapper,
						},
					}
				)
			}
			return child
		})
	}, [stepChildren, totalSteps, onStepClick])
}

// Common wrapper component
const StepperWrapper: React.FC<{
	activeStep: number
	ariaLabel?: string
	children: React.ReactNode
	className?: string
	orientation: StepperOrientation
	props: React.HTMLAttributes<HTMLDivElement>
	ref: React.Ref<HTMLDivElement>
	totalSteps: number
}> = ({
	children,
	orientation,
	className,
	ariaLabel,
	totalSteps,
	ref,
	props,
}) => (
	<div
		ref={ref}
		{...props}
		className={cn(
			stepperWrapperVariants({
				orientation,
			}),
			className
		)}
		role="group"
		aria-label={ariaLabel || `Stepper with ${totalSteps} steps`}
	>
		{children}
	</div>
)

// Common steps container
const StepsContainer: React.FC<{
	activeStep: number
	children: React.ReactNode
	className?: string
	orientation: StepperOrientation
	totalSteps: number
}> = ({ children, orientation, activeStep, totalSteps, className }) => (
	<ol
		className={cn(
			stepperContainerVariants({
				orientation,
			}),
			className
		)}
		aria-label={`Progress: step ${activeStep + 1} of ${totalSteps}`}
	>
		{children}
	</ol>
)

// Root component
const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
	(
		{
			steps = 0,
			activeStep = 0,
			variant = 'primary',
			orientation = 'horizontal',
			size = 'md',
			stepLabels = [],
			className,
			children,
			onStepClick,
			'aria-label': ariaLabel,
			classes = {},
			...props
		},
		ref
	) => {
		const getStepState = React.useCallback(
			(stepIndex: number): StepperState => {
				if (stepIndex === activeStep) {
					return 'active'
				}
				if (stepIndex < activeStep) {
					return 'completed'
				}
				return 'inactive'
			},
			[activeStep]
		)

		// Calculate total steps
		const totalSteps = React.useMemo(() => {
			if (steps > 0) {
				return steps
			}
			if (children) {
				const stepChildren = React.Children.toArray(children).filter(
					(child) => React.isValidElement(child) && child.type === StepperStep
				)
				return stepChildren.length
			}
			return 0
		}, [steps, children])

		const contextValue = React.useMemo(
			() => ({
				variant,
				orientation,
				size,
				activeStep,
				totalSteps,
				getStepState,
				onStepClick,
			}),
			[
				variant,
				orientation,
				size,
				activeStep,
				totalSteps,
				getStepState,
				onStepClick,
			]
		)

		const {
			stepChildren,
			contentChildren,
			otherChildren,
			hasStepperStep,
			hasStepperContent,
		} = useStepperChildren(children)
		const stepItems = useStepItems(stepChildren, totalSteps, onStepClick)

		// Render compound component pattern
		if (steps === 0 && children) {
			return (
				<StepperContext.Provider value={contextValue}>
					<StepperWrapper
						orientation={orientation}
						className={cn(className, classes.wrapper)}
						ariaLabel={ariaLabel}
						totalSteps={totalSteps}
						activeStep={activeStep}
						ref={ref}
						props={props}
					>
						<StepsContainer
							orientation={orientation}
							activeStep={activeStep}
							totalSteps={totalSteps}
							className={cn(classes.container)}
						>
							{stepItems.map((child, index) => (
								<li
									key={index}
									className={cn(
										stepperListVariants({ orientation }),
										classes.list
									)}
								>
									{child}
								</li>
							))}
						</StepsContainer>
						{contentChildren}
						{!hasStepperStep && !hasStepperContent && otherChildren}
					</StepperWrapper>
				</StepperContext.Provider>
			)
		}

		// Render simple step-based pattern
		return (
			<StepperContext.Provider value={contextValue}>
				<StepperWrapper
					orientation={orientation}
					className={cn(className, classes.wrapper)}
					ariaLabel={ariaLabel}
					totalSteps={totalSteps}
					activeStep={activeStep}
					ref={ref}
					props={props}
				>
					<StepsContainer
						orientation={orientation}
						activeStep={activeStep}
						totalSteps={totalSteps}
						className={cn(classes.container)}
					>
						{Array.from({ length: steps }).map((_, index) => (
							<li
								key={index}
								className={cn(
									stepperListVariants({ orientation }),
									classes.list
								)}
							>
								<StepperStep
									index={index}
									isLast={index === steps - 1}
									label={stepLabels[index]}
									clickable={!!onStepClick}
									className={classes.step}
									classes={{
										completedIcon: classes.completedIcon,
										line: classes.line,
										listWrapper: classes.listWrapper,
									}}
								/>
							</li>
						))}
					</StepsContainer>
					{React.isValidElement(children) && (
						<StepperContent className={classes.content}>
							{children}
						</StepperContent>
					)}
				</StepperWrapper>
			</StepperContext.Provider>
		)
	}
)

Stepper.displayName = 'Stepper'
StepperStep.displayName = 'Stepper.Step'
StepperContent.displayName = 'Stepper.Content'

// Compound component pattern
const StepperNamespace = Object.assign(Stepper, {
	Step: StepperStep,
	Content: StepperContent,
})

export { StepperNamespace as Stepper }
