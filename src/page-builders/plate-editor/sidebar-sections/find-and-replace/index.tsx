import React from 'react'
import Link from 'next/link'
import { farSearchModes } from '@/constants/editor-constants'
import useFindAndReplace from '@/hooks/use-find-and-replace'
import AddForm from '@/page-builders/plate-editor/sidebar-sections/find-and-replace/add-form'
import {
	CaseSensitive,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	Eye,
	ReplaceAllIcon,
	ReplaceIcon,
	Search,
	WholeWord,
} from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { IconLoader, Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { TooltipComponent } from '@/components/ui/tooltip-component'
import { cn } from '@/lib/utils/helpers'

export default function FindAndReplace() {
	const {
		localized_entities,
		handleNext,
		handlePrev,
		handleSearchChange,
		handleSuggestionClick,
		isFetching,
		occurrences,
		onReplace,
		onReplaceAll,
		toggleSearchMode,
		toggleReplace,
		replaceEnabled,
		caseSensitive,
		ptr,
		records,
		replace,
		search,
		setData,
		setOptions,
		wholeWord,
		genitive,
		sheetURL,
		handleScanEpisode,
		updateLOCPending,
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
					<div className="absolute inset-y-0 right-0 my-auto flex scale-75 gap-2">
						<Toggle
							tooltip={
								caseSensitive ? 'Make Case Insensitive' : 'Make Case Sensitive'
							}
							onClick={() => toggleSearchMode(farSearchModes.CASE_SENSITIVE)}
							aria-label="Toggle case-sensitivity"
							className={cn(caseSensitive && 'border')}
						>
							<CaseSensitive />
						</Toggle>
						<Toggle
							tooltip="Match whole word"
							aria-label="Toggle match whole word"
							className={cn(wholeWord && 'border')}
							onClick={() => toggleSearchMode(farSearchModes.WHOLE_WORD)}
						>
							<WholeWord />
						</Toggle>
					</div>
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
					{genitive && " and it's genitives"}
				</p>
			)}

			{isFetching ? (
				<div className="flex items-center justify-center py-12">
					<Loader text="Suche nach lokalisierten Namen, bitte warten …" />
				</div>
			) : (
				<>
					<div className={cn('flex h-full flex-col')}>
						{localized_entities.map(
							(localized_entity, index) =>
								!!localized_entity.entities.length && (
									<React.Fragment key={index}>
										<h4 className="my-2 rounded-md bg-muted p-2 text-lg font-semibold">
											{localized_entity.title}
										</h4>
										<div className="flex flex-wrap gap-2">
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
				</>
			)}
			<div className="flex items-center justify-end gap-2">
				<If condition={!!sheetURL}>
					<Button size="icon" tooltip="Open LOC sheet" asChild>
						<Link href={sheetURL} target="_blank" rel="noopener noreferrer">
							<Eye />
						</Link>
					</Button>
				</If>
				<IfElse condition={updateLOCPending}>
					<If>
						<IconLoader />
					</If>
					<Else>
						<Button
							onClick={() => void handleScanEpisode()}
							disabled={isFetching}
							className="w-fit gap-2"
						>
							<Search size={16} /> Scan
						</Button>
					</Else>
				</IfElse>
			</div>
			<hr />
			<AddForm setData={setData} />
		</div>
	)
}
