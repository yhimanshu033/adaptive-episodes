/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect } from 'react'
import { DEFAULT_EPISODE_RANGE } from '@/constants/episodes-constants'
import {
	EpisodeRangeFormSchema,
	useEpisodeRangeResolver,
} from '@/hooks/form-resolvers/episode-range-resolver'
import { usePageState } from '@/hooks/use-page-state'
import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const EpisodeRangeSearch = () => {
	const form = useEpisodeRangeResolver()
	const { setEpisodeRange, setCurrentPage, setSearch, episodeRange } =
		usePageState()

	const handleSearch = ({ start, end }: EpisodeRangeFormSchema) => {
		void setCurrentPage(1)
		void setSearch('')
		void setEpisodeRange({ start, end })
	}

	const handleClear = () => {
		void setCurrentPage(1)
		void setEpisodeRange({
			start: null,
			end: null,
		})
		form.reset(DEFAULT_EPISODE_RANGE)
	}

	useEffect(() => {
		form.setValue('start', episodeRange.start ?? 0)
		form.setValue('end', episodeRange.end ?? 0)
	}, [episodeRange, form])

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSearch)} className="flex gap-2">
				<FormField
					control={form.control}
					name="start"
					render={({ field }) => (
						<FormItem className="w-36">
							<FormControl>
								<Input
									type="number"
									placeholder="Episode Start"
									{...field}
									value={field.value || ''}
									min={1}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="end"
					render={({ field }) => (
						<FormItem className="w-36">
							<FormControl>
								<Input
									type="number"
									placeholder="Episode End"
									{...field}
									value={field.value || ''}
									min={1}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button size="icon">
					<Search size={16} />
				</Button>
				<Button
					variant="outline"
					size="icon"
					type="button"
					onClick={handleClear}
				>
					<X size={16} />
				</Button>
			</form>
		</Form>
	)
}

export default EpisodeRangeSearch
