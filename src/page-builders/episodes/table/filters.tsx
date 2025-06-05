import React, { useEffect, useState } from 'react'
import { usePageState } from '@/hooks/use-page-state'
import { SearchIcon } from '@/icons/search-icon'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Input from '@/components/aural-ui/input'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'

import { TEpisodeSearchForm } from '@/types/episode-type'

const Filters = ({
	totalEpisodes = 0,
	setSearchedRow,
}: {
	setSearchedRow: React.Dispatch<React.SetStateAction<number | null>>
	totalEpisodes?: number
}) => {
	const [fetchedSeqNumber, setFetchedSeqNumber] = useState<boolean>(false)
	const { limit, setSearch, setCurrentPage, search, seqNumber } = usePageState()

	const handleSearch = (data: TEpisodeSearchForm) => {
		if (Number(data.input)) {
			const input = Number(data.input)
			if (input > totalEpisodes) {
				toast.info('Total episodes exceeded', {
					description: `Please search within ${totalEpisodes} episodes`,
				})
				return
			} else if (input <= 0) {
				toast.info('Invalid input', {
					description: `Please enter a positive number`,
				})
				return
			}
			const page = Math.ceil(Number(input) / limit)
			const row = input % limit || limit
			void setSearch('')
			void setCurrentPage(page)
			setSearchedRow(row)
		} else {
			void setSearch(data.input)
			void setCurrentPage(1)
		}
	}

	useEffect(() => {
		if (
			fetchedSeqNumber ||
			!seqNumber ||
			String(seqNumber) === search ||
			totalEpisodes === 0
		) {
			return
		}

		setFetchedSeqNumber(true)
		handleSearch({ input: String(seqNumber) })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seqNumber, totalEpisodes])

	const form = useForm<TEpisodeSearchForm>({
		defaultValues: {
			input: '',
		},
	})

	useEffect(() => {
		if (!search || search === form.getValues('input')) {
			return
		}

		form.setValue('input', search)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search])

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={(e) => void form.handleSubmit(handleSearch)(e)}
					className="mb-2 flex flex-1 items-center gap-2"
				>
					<FormField
						control={form.control}
						name="input"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormControl>
									<div className="bg-fm-surface-frosted/20 rounded-fm-3xl font-fm-text text-fm-placeholder border-fm-divider-secondary relative flex min-w-72 items-center border-1 p-3 text-sm">
										<SearchIcon className="mx-4" width={16} height={16} />
										<Input
											placeholder="Search Episode"
											{...field}
											unstyled
											className="text-fm-primary w-full border-none pr-4 outline-none"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</>
	)
}

export default Filters
