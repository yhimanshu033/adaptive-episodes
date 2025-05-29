import React from 'react'
import { farSearchModes } from '@/constants/editor-constants'
import { UseGlobalFARRet } from '@/hooks/use-global-find-and-replace'
import useIsGerman from '@/hooks/use-is-german'
import {
	CaseSensitive,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	ReplaceAllIcon,
	ReplaceIcon,
	WholeWord,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import IfElse, { Else, If } from '@/components/if-else'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import ForEach from '@/components/ui/for-each'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { TooltipComponent } from '@/components/ui/tooltip-component'
import { cn } from '@/lib/utils/helpers'

import { TLocalizeArrayItem } from '@/types/ai-types'

export interface IFindAndReplaceUIProps extends UseGlobalFARRet {
	isWriter: boolean
}
export default function FindAndReplaceUI({
	toggleReplace,
	caseSensitive,
	handleNext,
	handlePrev,
	handleSearchChange,
	isWriter,
	localized_entities,
	occurrences,
	onReplace,
	onReplaceAll,
	ptr,
	replaceEnabled,
	search,
	toggleSearchMode,
	wholeWord,
	isFetching,
	records,
	onReplaceChange,
	replace,
	genitive,
	handleSuggestionClick,
	recordTexts,
	setPtr,
}: IFindAndReplaceUIProps) {
	const dict = useTranslations('placeholders')
	const isGerman = useIsGerman()
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
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
				<If condition={replaceEnabled}>
					<Input
						value={replace}
						onChange={onReplaceChange}
						type="text"
						placeholder="Replace with"
						className="col-start-2 flex-1 rounded border border-gray-300 p-2"
					/>
					<div className="flex gap-2">
						<Button
							tooltip="Replace Current Selection"
							disabled={!isWriter}
							title="replace"
							onClick={onReplace}
						>
							<ReplaceIcon />{' '}
						</Button>
						<Button
							tooltip="Replace All"
							disabled={!isWriter}
							title="replace all"
							onClick={onReplaceAll}
						>
							<ReplaceAllIcon />{' '}
						</Button>
					</div>
				</If>
			</div>
			<If condition={!!search}>
				<p className="text-muted-foreground text-lg">
					Found <span className="text-foreground font-bold">{occurrences}</span>{' '}
					occurrences of{' '}
					<span className="text-foreground font-medium italic">{search}</span>
					{genitive && " and it's genitives"}
				</p>
				<div className="flex flex-col">
					<ForEach data={recordTexts}>
						{(data, idx) => (
							<div
								key={idx}
								className="h-auto cursor-pointer border-b px-2 py-1 text-sm *:mx-[0.5px]"
								onClick={() => setPtr(idx)}
							>
								<span>{data[0]}</span>
								<IfElse condition={ptr === idx}>
									<If>
										<del className="bg-red-500/20">{data[1]}</del>
										<ins className="bg-green-500/20">{data[1]}</ins>
									</If>
									<Else>
										<span>{data[1]}</span>
									</Else>
								</IfElse>

								<span>{data[2]}</span>
							</div>
						)}
					</ForEach>
				</div>
			</If>

			<IfElse condition={isFetching}>
				<If>
					<div className="flex items-center justify-center py-12">
						<Loader text={dict('localizationLoading')} />
					</div>
				</If>
				<If condition={isGerman}>
					<Else>
						<div className={cn('flex h-full flex-col')}>
							<ForEach data={localized_entities}>
								{(localized_entity, idx) => (
									<If
										key={`entity-${idx}`}
										condition={!!localized_entity.entities.length}
									>
										<h4 className="bg-muted my-2 rounded-md p-2 text-lg font-semibold">
											{localized_entity.title}
										</h4>
										<div className="flex flex-wrap gap-2">
											<ForEach
												data={localized_entity.entities as TLocalizeArrayItem[]}
											>
												{(character, idx) => (
													<Button
														key={`character-${idx}`}
														onClick={() => handleSuggestionClick(character)}
														variant="outline"
													>
														{character.name}
													</Button>
												)}
											</ForEach>
										</div>
									</If>
								)}
							</ForEach>
						</div>
					</Else>
				</If>
			</IfElse>
		</div>
	)
}
