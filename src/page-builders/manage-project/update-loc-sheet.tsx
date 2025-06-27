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
import Input from '@/components/aural-ui/input'
import IfElse from '@/components/if-else'
import { cn } from '@/lib/utils/helpers'

const UpdateLOCSheet = () => {
	const { data } = useLOCSheetData()
	const currentLOCSheetURL = data ? data.loc_sheet_url : ''

	const form = useUploadLOCSheetResolver()
	const updateLOCSheetMutation = useUpdateLOCSheetMutation()

	const handleSubmit = ({ link }: UploadLOCSheetSchema) => {
		updateLOCSheetMutation.mutate(link)
	}

	const link = form.watch('link')

	useEffect(() => {
		if (currentLOCSheetURL) {
			form.setValue('link', currentLOCSheetURL)
		}
	}, [currentLOCSheetURL, form])

	return (
		<>
			<h3 className="font-fm-brand mt-4 text-sm tracking-wider uppercase">
				Localization Sheet
			</h3>
			<Form {...form}>
				<form
					onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
					className="mt-2.5 flex w-full items-center gap-2"
				>
					<div className="border-fm-divider-secondary flex w-11/12 items-center justify-between border-1 p-3">
						<FormField
							control={form.control}
							name="link"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											unstyled
											className="w-full border-none pr-4 outline-none"
											placeholder="Paste the google sheet link here"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={updateLOCSheetMutation.isPending}
							variant="text"
							innerClassName={cn(
								(form.getValues('link').length < 3 ||
									updateLOCSheetMutation.isPending) &&
									'text-fm-tertiary',
								'text-sm !p-0 -translate-y-0 uppercase truncate'
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
							shape="square"
							variant="outlined"
							icon={<ArrowRightUpIcon />}
							label="redirect icon"
							type="button"
						/>
					</Link>
				</form>
			</Form>
		</>
	)
}

export default UpdateLOCSheet
