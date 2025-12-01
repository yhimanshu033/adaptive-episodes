import React, { useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import useAdaptationQuery from '@/hooks/query/use-adaptation-query'
import { CheckCircle } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/aural-ui/card'
import CircularLoader from '@/components/aural-ui/circular-loader'
import IfElse, { Else, If } from '@/components/if-else'
import { Separator } from '@/components/ui/separator'
import useAdaptation from '@/providers/adaptation-provider'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { parseInputLSMapping } from '@/lib/utils/helpers'

import { ELanguage } from '@/types/common'

const AdaptationContainer = () => {
	const { id } = useParams()
	const { initialStoryData } = useEpisodeTableContext()
	const {
		storyData,
		setFetchingLSSheet,
		setTableData,
		setStory,
		setOpen,
		step,
		setEpisodeAdaptation,
		setSequence,
	} = useAdaptation()

	const isStoryAdaptationInProgress = useMemo(
		() => !storyData || storyData?.id === Number(id),
		[storyData, id]
	)

	const { data: lsSheetData, isLoading: lsSheetLoading } = useAdaptationQuery({
		projectId: id as string,
		language: initialStoryData?.parent_language || ELanguage.ENGLISH,
		enabled: isStoryAdaptationInProgress,
	})

	useEffect(() => {
		if (!storyData) {
			setStory(initialStoryData)
			setFetchingLSSheet(lsSheetLoading)
		}
	}, [
		storyData,
		initialStoryData,
		lsSheetLoading,
		setStory,
		setFetchingLSSheet,
	])

	useEffect(() => {
		if (lsSheetData) {
			const { data, sequence } = parseInputLSMapping(lsSheetData)
			setTableData(data)
			setSequence(sequence || {})
		}
	}, [lsSheetData, setTableData, setSequence])

	return (
		<div>
			<Separator className="w-full" />
			<div className="flex h-[60vh] items-center justify-center">
				<Card className="mx-4 w-full max-w-md rounded-md">
					<CardHeader className="text-center">
						<IfElse condition={step === 1}>
							<If>
								<CheckCircle
									size={48}
									className="mx-auto mb-4 text-green-500"
								/>
								<CardTitle className="pb-4 text-xl font-semibold">
									Adaptation Completed
								</CardTitle>
								<CardDescription className="text-muted-foreground">
									Your content has been successfully adapted and is ready to
									use. Please refresh to view episodes.
								</CardDescription>
							</If>
							<Else>
								<CircularLoader className="mx-auto mb-4" />
								<CardTitle className="pb-4 text-xl font-semibold">
									{isStoryAdaptationInProgress
										? 'Adaptation in Progress'
										: 'Another story is being adapted'}
								</CardTitle>
								<CardDescription className="text-muted-foreground">
									{isStoryAdaptationInProgress
										? 'Your content is being adapted. This may take a few moments.'
										: 'Another story is being adapted. Please wait for it to complete.'}
								</CardDescription>
							</Else>
						</IfElse>
					</CardHeader>
					<CardContent className="text-center">
						<If condition={step !== 1 && isStoryAdaptationInProgress}>
							<Button
								onClick={() => {
									setOpen(true)
									setEpisodeAdaptation(false)
								}}
								variant="secondary"
								className="w-full"
							>
								View Status Details
							</Button>
						</If>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default AdaptationContainer
