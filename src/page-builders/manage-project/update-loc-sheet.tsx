import React, { useEffect } from 'react'
import {
	UploadLOCSheetSchema,
	useUploadLOCSheetResolver,
} from '@/hooks/form-resolvers/upload-loc-sheet-resolver'
import { useUpdateLOCSheetMutation } from '@/hooks/mutation/use-localize-hook'
import useLOCSheetData from '@/hooks/query/use-loc-sheet-data'
import { ArrowUpRight } from 'lucide-react'

import IfElse from '@/components/if-else'
import { IconLoader } from '@/components/loader'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

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
		<Form {...form}>
			<form
				onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
				className="flex gap-2"
			>
				<FormField
					control={form.control}
					name="link"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<Input
									placeholder="Paste the google sheet link here"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<a
					href={link}
					target="_blank"
					className={buttonVariants({ size: 'icon', variant: 'outline-solid' })}
					rel="noreferrer"
				>
					<ArrowUpRight size={16} />
				</a>
				<IfElse
					condition={updateLOCSheetMutation.isPending}
					if={<IconLoader />}
					else={<Button>Update</Button>}
				/>
			</form>
		</Form>
	)
}

export default UpdateLOCSheet
