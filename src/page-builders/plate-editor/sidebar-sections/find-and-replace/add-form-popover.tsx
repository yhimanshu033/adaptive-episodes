import React, { useEffect } from 'react'
import {
	LocalizationType,
	localizationTypes,
	typeToKey,
	typeToLocalizedKey,
} from '@/constants/ai-constants'
import { useLocalizeMutation } from '@/hooks/mutation/use-localize-hook'
import useIsGerman from '@/hooks/use-is-german'
import { BubbleCheckIcon } from '@/icons/bubble-check-icon'
import { CrossIcon } from '@/icons/cross-icon'
import { PlusIcon } from '@/icons/plus-icon'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/aural-ui/form'
import { IconButton } from '@/components/aural-ui/icon-button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/aural-ui/popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/aural-ui/select'
import { Typography } from '@/components/aural-ui/typography'

import { IFindAndReplaceUIProps } from './far'

const formSchema = z.object({
	original: z.string(),
	replace_with: z.string(),
	type: z.string(),
	description: z.string().optional(),
})

type AddFormPopoverProps = Pick<
	IFindAndReplaceUIProps,
	'search' | 'isWriter' | 'replace' | 'setData'
>

const AddFormPopover = ({
	search,
	isWriter,
	replace,
	setData,
}: AddFormPopoverProps) => {
	const [open, setOpen] = React.useState(false)

	const onOpenChange = React.useCallback(
		(_value = !open) => {
			setOpen(_value)
		},
		[open]
	)

	const { mutateAsync, isPending } = useLocalizeMutation()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			original: '',
			replace_with: '',
			type: '',
			description: '',
		},
	})
	const isGerman = useIsGerman()

	useEffect(() => {
		form.setValue('original', search)
		form.setValue('replace_with', replace)
	}, [search, replace, form])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setData?.((prev) => ({
				...(prev || {}),
				[typeToKey[values.type as keyof typeof LocalizationType]]: {
					...(prev?.[typeToKey[values.type as keyof typeof LocalizationType]] ||
						{}),
					[values.original]: {
						[typeToLocalizedKey[values.type as keyof typeof LocalizationType]]:
							values.replace_with,
					},
				},
			}))

			await mutateAsync({
				ls_mapping: {
					[values.original]: {
						type: LocalizationType[
							values.type as keyof typeof LocalizationType
						],
						localized_name: values.replace_with,
						description: '',
					},
				},
			})

			form.reset()
			setOpen(false)
			toast(`${search} added to the list successfully`, {
				icon: <BubbleCheckIcon className="size-4" />,
			})
		} catch (error) {
			console.error('Form submission error', error)
		}
	}

	if (!isWriter || !isGerman) {
		return null
	}

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					disabled={!search}
					isDisabled={!search}
					innerClassName="border-fm-divider-secondary bg-transparent group-disabled:text-fm-tertiary translate-y-0 group-hover:text-fm-primary group-hover:border-fm-divider-contrast group-disabled:border-fm-divider-secondary group-data-[state=open]:border-fm-divider-contrast"
				>
					<PlusIcon className="size-4.5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				side="left"
				sideOffset={24}
				className="w-auto max-w-80 px-5 pb-7 backdrop-blur-xs"
			>
				<div className="border-fm-divider-primary mb-6 flex items-center justify-between gap-2 border-b border-dashed py-2">
					<Typography
						variant="caption-large"
						transform="uppercase"
						className="font-fm-brand"
					>
						Add to sheet
					</Typography>
					<IconButton
						icon={<CrossIcon />}
						size="small"
						label="Close"
						variant="ghost"
						onClick={() => setOpen(false)}
					/>
				</div>
				<Form {...form}>
					<form
						onSubmit={(e) => {
							void form.handleSubmit(onSubmit)(e)
						}}
						className="flex flex-col gap-3"
					>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<Select
										onValueChange={field.onChange}
										value={field.value}
										disabled={isPending}
									>
										<FormControl>
											<SelectTrigger decoration="filled" className="h-11">
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{localizationTypes.map((type, idx) => (
												<SelectItem key={idx} value={type}>
													{type}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div>
							<Button
								type="submit"
								disabled={isPending || !form.getValues().type}
								isDisabled={isPending || !form.getValues().type}
								variant="outline"
								size="sm"
								className="w-full"
								innerClassName="translate-y-0"
							>
								{isPending ? <CircularLoader size="sm" /> : 'Add'}
							</Button>
						</div>
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	)
}

export default AddFormPopover
