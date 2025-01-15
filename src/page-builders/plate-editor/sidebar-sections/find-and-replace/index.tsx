import React from 'react'
import useFindAndReplace from '@/hooks/use-find-and-replace'
import AddForm from '@/page-builders/plate-editor/sidebar-sections/find-and-replace/add-form'
import {
	CaseSensitive,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	Download,
	ReplaceAllIcon,
	ReplaceIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Spinner from '@/components/ui/spinner'
import { Toggle } from '@/components/ui/toggle'
import { TooltipComponent } from '@/components/ui/tooltip-component'
import { cn } from '@/lib/utils/helpers'

export default function FindAndReplace() {
	const {
		localized_entities,
		handleDownload,
		handleNext,
		handlePrev,
		handleSearchChange,
		handleSuggestionClick,
		isFetching,
		isPending,
		occurrences,
		onReplace,
		onReplaceAll,
		refetch,
		toggleCaseSensitive,
		toggleReplace,
		replaceEnabled,
		caseSensitive,
		ptr,
		records,
		replace,
		search,
		setData,
		setOptions,
	} = useFindAndReplace()
	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<h2 className="text-2xl font-bold">Localization</h2>
			<div className="grid grid-cols-[1fr_10fr_2fr] gap-4">
				<TooltipComponent tooltip="Enable Replace">
					<Toggle onClick={toggleReplace} aria-label="Toggle replace">
						<ChevronRight
							className={cn('transition-all', replaceEnabled && 'rotate-90')}
						/>
					</Toggle>
				</TooltipComponent>

				<div className="relative">
					<Input
						value={search}
						onChange={handleSearchChange}
						type="text"
						placeholder="Find"
						className="flex-1 rounded border border-gray-300 p-2"
					/>
					<TooltipComponent
						tooltip={
							caseSensitive ? 'Make Case Insensitive' : 'Make Case Sensitive'
						}
					>
						<Toggle
							onClick={toggleCaseSensitive}
							aria-label="Toggle case-sensitivity"
							className={cn(
								'absolute inset-y-0 right-0 my-auto scale-75',
								caseSensitive && 'border'
							)}
						>
							<CaseSensitive />
						</Toggle>
					</TooltipComponent>
				</div>
				<div className="flex gap-2">
					<Button
						tooltip="Select Previous Node"
						onClick={handlePrev}
						disabled={ptr < 1}
					>
						<ChevronUp />
					</Button>
					<Button
						tooltip="Select Next Node"
						onClick={handleNext}
						disabled={ptr === records.length - 1}
					>
						<ChevronDown />
					</Button>
				</div>
				{replaceEnabled && (
					<>
						<Input
							value={replace}
							onChange={(e) => setOptions({ replace: e.target.value })}
							type="text"
							placeholder="Replace with"
							className="col-start-2 flex-1 rounded border border-gray-300 p-2"
						/>
						<div className="flex gap-2">
							<Button
								tooltip="Replace Current Selection"
								title="replace"
								onClick={onReplace}
							>
								<ReplaceIcon />{' '}
							</Button>
							<Button
								tooltip="Replace All"
								title="replace all"
								onClick={onReplaceAll}
							>
								<ReplaceAllIcon />{' '}
							</Button>
						</div>
					</>
				)}
			</div>
			{search && (
				<p className="text-lg text-muted-foreground">
					Found <span className="font-bold text-foreground">{occurrences}</span>{' '}
					occurrences of{' '}
					<span className="font-medium italic text-foreground">{search}</span>
				</p>
			)}

			{isFetching ? (
				<div className="flex flex-col items-center justify-center space-y-2 py-12">
					<Spinner size={64} />
					<p>Finding localized name suggestions—please wait.</p>
				</div>
			) : (
				<>
					<div className={cn('flex h-full flex-col')}>
						{localized_entities.map(
							(localized_entity, index) =>
								!!localized_entity.entities.length && (
									<React.Fragment key={index}>
										<h4 className="text-lg font-semibold">
											{localized_entity.title}
										</h4>
										<div className="flex flex-wrap gap-2 pt-1">
											{localized_entity.entities.map((character, index) => (
												<Button
													onClick={() => handleSuggestionClick(character)}
													key={index}
													variant="outline"
												>
													{character.name}
												</Button>
											))}
										</div>
									</React.Fragment>
								)
						)}
					</div>
					<div className="flex items-center justify-end gap-2">
						<Button onClick={() => void refetch()} className="w-fit self-end">
							Scan the Episode
						</Button>
						<TooltipComponent tooltip="Download Localization sheet">
							<Button
								onClick={() => void handleDownload()}
								className="w-fit self-end"
							>
								{isPending ? <Spinner size={24} /> : <Download />}
							</Button>
						</TooltipComponent>
					</div>
				</>
			)}
			<hr />
			<AddForm setData={setData} />
		</div>
	)
}
