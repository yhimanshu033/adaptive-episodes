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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/aural-ui/form'
import { IconButton } from '@/components/aural-ui/icon-button'
import Input from '@/components/aural-ui/input'

const UpdateLOCSheet = () => {
	const { data } = useLOCSheetData()
	const currentLOCSheetURL = data ? data.loc_sheet_url : ''

	const form = useUploadLOCSheetResolver()
	const updateLOCSheetMutation = useUpdateLOCSheetMutation()

	const handleSubmit = ({ link }: UploadLOCSheetSchema) => {
		console.log('submit click', link)
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={updateLOCSheetMutation.isPending}
							variant="text"
							innerClassName="text-fm-tertiary text-sm !p-0 -translate-y-0 uppercase"
						>
							Update
						</Button>
					</div>
					<Link href={link} target="_blank">
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
