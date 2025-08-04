import React from 'react'
import useIsGerman from '@/hooks/use-is-german'
import { SearchIcon } from '@/icons/search-icon'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import ForEach from '@/components/ui/for-each'

import { TLocalizeArrayItem } from '@/types/ai-types'

import { IFindAndReplaceUIProps } from './far'

type FindAndReplaceLocalizedListProps = Pick<
	IFindAndReplaceUIProps,
	| 'isFetching'
	| 'localized_entities'
	| 'handleSuggestionClick'
	| 'handleScanEpisode'
	| 'isWriter'
	| 'updateLOCPending'
>

const FindAndReplaceLocalizedList = ({
	isFetching,
	localized_entities,
	handleSuggestionClick,
	handleScanEpisode,
	isWriter,
	updateLOCPending,
}: FindAndReplaceLocalizedListProps) => {
	const dict = useTranslations('placeholders')
	const isGerman = useIsGerman()

	if (!isGerman) {
		return null
	}

	if (isFetching) {
		return (
			<div className="flex items-center justify-center px-6 py-12">
				<CircularLoader text={dict('localizationLoading')} />
			</div>
		)
	}

	return (
		<section className="px-6 pt-2">
			<div className="border-fm-divider-secondary mb-6 flex items-center justify-between gap-4 border-b border-dashed pb-2.5">
				<Typography
					color="primary"
					variant="caption-medium"
					transform="uppercase"
					className="font-fm-brand"
				>
					Or Select from Below
				</Typography>
				<Button
					onClick={() => void handleScanEpisode?.()}
					disabled={!isWriter || updateLOCPending}
					isDisabled={!isWriter || updateLOCPending}
					className="gap-2"
					variant="text"
					size="sm"
					innerClassName="translate-y-0 py-fm-sm px-0"
					leftIcon={
						updateLOCPending ? (
							<CircularLoader className="size-3" />
						) : (
							<SearchIcon className="size-3" />
						)
					}
				>
					Scan
				</Button>
			</div>
			<div className="flex h-full flex-col gap-6">
				<ForEach data={localized_entities}>
					{(localized_entity, idx) => (
						<If
							key={`entity-${idx}`}
							condition={!!localized_entity.entities.length}
						>
							<div className="flex flex-col gap-3">
								<Typography
									as="h4"
									color="tertiary"
									variant="caption-medium"
									transform="uppercase"
									className="font-fm-brand text-lg font-semibold"
								>
									{localized_entity.title}
								</Typography>
								<div className="flex flex-wrap gap-2">
									<ForEach
										data={localized_entity.entities as TLocalizeArrayItem[]}
									>
										{(character, idx) => (
											<Button
												key={`character-${idx}`}
												variant="outline"
												size="sm"
												innerClassName="border-fm-divider-secondary bg-transparent group-disabled:text-fm-tertiary translate-y-0 group-hover:text-fm-primary group-hover:border-fm-divider-contrast group-disabled:border-fm-divider-secondary"
												onClick={() => handleSuggestionClick(character)}
											>
												{character.name}
											</Button>
										)}
									</ForEach>
								</div>
							</div>
						</If>
					)}
				</ForEach>
			</div>
		</section>
	)
}

export default FindAndReplaceLocalizedList
