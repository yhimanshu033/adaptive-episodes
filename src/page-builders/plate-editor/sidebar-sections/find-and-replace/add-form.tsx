import React, { Dispatch, SetStateAction } from 'react'
import {
	LocalizationType,
	localizationTypes,
	typeToKey,
	typeToLocalizedKey,
} from '@/constants/ai-constants'
import { useLocalizeMutation } from '@/hooks/mutation/use-localize-hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import IfElse, { Else, If } from '@/components/if-else'
import { IconLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { TooltipComponent } from '@/components/ui/tooltip-component'

import { TLocalizeResponse } from '@/types/ai-types'

const formSchema = z.object({
	original: z.string(),
	replace_with: z.string(),
	type: z.string(),
	description: z.string(),
})

export default function AddForm({
	setData,
}: {
	setData: Dispatch<SetStateAction<TLocalizeResponse['result'] | undefined>>
}) {
	const { mutate, isPending } = useLocalizeMutation()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			original: '',
			replace_with: '',
			type: localizationTypes[0],
			description: '',
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setData((prev) => ({
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
			mutate({
				ls_mapping: {
					[values.original]: {
						type: LocalizationType[
							values.type as keyof typeof LocalizationType
						],
						localized_name: values.replace_with,
						description: values.description,
					},
				},
			})
			form.reset()
		} catch (error) {
			console.error('Form submission error', error)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					void form.handleSubmit(onSubmit)(e)
				}}
				className="space-y-4 px-4 pb-6 pt-4"
			>
				<div className="flex w-full items-center justify-between">
					<h2 className="text-lg font-bold">Add to sheet</h2>
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<TooltipComponent tooltip="Change Type">
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a type" />
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
								</TooltipComponent>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-[4fr_4fr] gap-4">
					<FormField
						control={form.control}
						name="original"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder="Original"
										type="text"
										className="flex-1 rounded border border-gray-300 p-2"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="replace_with"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder="Replace with"
										type="text"
										className="flex-1 rounded border border-gray-300 p-2"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									placeholder="Description"
									className="flex-1 rounded border border-gray-300 p-2"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<div className="flex justify-end">
					<IfElse condition={isPending}>
						<If>
							<IconLoader />
						</If>
						<Else>
							<Button type="submit">Submit</Button>
						</Else>
					</IfElse>
				</div>
			</form>
		</Form>
	)
}
