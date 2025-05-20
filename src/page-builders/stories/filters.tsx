import React from 'react'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { TEpisodeSearchForm } from '@/types/episode-type'

const Filters = ({ setSearch }: { setSearch: (str: string) => void }) => {
	const handleSearch = (data: TEpisodeSearchForm) => {
		setSearch(data.input)
	}

	const form = useForm<TEpisodeSearchForm>({
		defaultValues: {
			input: '',
		},
	})

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => void form.handleSubmit(handleSearch)(e)}
				className="mb-2 flex items-center gap-2"
			>
				<FormField
					control={form.control}
					name="input"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<Input placeholder="Search Story" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button tooltip="Search" size="icon">
					<Search size={16} />
				</Button>
			</form>
		</Form>
	)
}

export default Filters
