import React, { useEffect } from 'react'
import Link from 'next/link'
import {
	UploadLOCSheetSchema,
	useUploadLOCSheetResolver,
} from '@/hooks/form-resolvers/upload-loc-sheet-resolver'
import { useUpdateLOCSheetMutation } from '@/hooks/mutation/use-localize-hook'
import useLOCSheetData from '@/hooks/query/use-loc-sheet-data'
import { ArrowRightUpIcon } from '@/icons/arrow-right-up-icon'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from '@/components/aural-ui/form'
import { IconButton } from '@/components/aural-ui/icon-button'
import { InputBase } from '@/components/aural-ui/input'
import { Typography } from '@/components/aural-ui/typography'
import IfElse from '@/components/if-else'
import { cn } from '@/lib/utils/helpers'

const UpdateLOCSheet = () => {
	const { data } = useLOCSheetData()
	const currentLOCSheetURL = data?.loc_sheet_url ?? ''

	const form = useUploadLOCSheetResolver()
	const updateLOCSheetMutation = useUpdateLOCSheetMutation()

	const link = form.watch('link')

	const handleSubmit = ({ link }: UploadLOCSheetSchema) => {
		updateLOCSheetMutation.mutate(link)
	}

	useEffect(() => {
		if (currentLOCSheetURL) {
			form.reset({ link: currentLOCSheetURL })
		}
	}, [currentLOCSheetURL, form])

	const isSubmitDisabled =
		updateLOCSheetMutation.isPending ||
		!form.formState.isDirty ||
		link.trim().length < 3

	return (
		<div className="space-y-3">
			<Typography
				transform="uppercase"
				variant="caption-medium"
				className="font-fm-brand"
			>
				Localization Sheet
			</Typography>
			<Form {...form}>
				<form
					onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
					className="flex h-11 w-full items-center gap-3"
				>
					<div className="border-fm-divider-secondary focus-within:border-fm-divider-contrast flex w-11/12 items-center justify-between rounded-xs border-1 px-4 py-2 transition-all duration-300">
						<FormField
							control={form.control}
							name="link"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<InputBase
											unstyled
											className="placeholder:text-fm-md text-fm-md w-full border-none pr-4 outline-none"
											placeholder="Paste the google sheet link here"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={isSubmitDisabled}
							variant="text"
							innerClassName={cn(
								'text-sm !p-0 translate-y-0 uppercase',
								isSubmitDisabled && 'text-fm-tertiary cursor-disabled'
							)}
						>
							<IfElse
								condition={updateLOCSheetMutation.isPending}
								else={<span>Update</span>}
								if={<CircularLoader />}
							/>
						</Button>
					</div>
					<Link
						href={link}
						target="_blank"
						tabIndex={link ? 0 : -1}
						aria-disabled={!link}
						className={cn(!link && 'pointer-events-none opacity-50')}
					>
						<IconButton
							type="button"
							shape="square"
							variant="outlined"
							label="redirect icon"
							icon={<ArrowRightUpIcon />}
							className="border-fm-divider-secondary"
						/>
					</Link>
				</form>
			</Form>
		</div>
	)
}

export default UpdateLOCSheet
