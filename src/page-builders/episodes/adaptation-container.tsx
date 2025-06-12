import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import useAdaptationQuery from '@/hooks/query/use-adaptation-query'
import { CheckCircle } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import useAdaptation from '@/providers/adaptation-provider'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import { parseInputLSMapping } from '@/lib/utils/helpers'

import { ELanguage } from '@/types/common'

const AdaptationContainer = () => {
	const { id } = useParams()
	const { initialStoryData } = useEpisodeTableContext()
	const { data: lsSheetData, isLoading: lsSheetLoading } = useAdaptationQuery({
		projectId: id as string,
		language: initialStoryData?.parent_language || ELanguage.ENGLISH,
	})

	const { setFetchingLSSheet, setTableData, setStory, setOpen, step } =
		useAdaptation()

	useEffect(() => {
		setStory(initialStoryData)
		setFetchingLSSheet(lsSheetLoading)
		if (lsSheetData) {
			setTableData(parseInputLSMapping(lsSheetData))
		}
	}, [
		initialStoryData,
		lsSheetData,
		lsSheetLoading,
		setFetchingLSSheet,
		setStory,
		setTableData,
	])

	return (
		<div>
			<Separator className="w-full" />
			<div className="flex h-[60vh] items-center justify-center">
				<Card className="mx-4 w-full max-w-md">
					<CardHeader className="text-center">
						<IfElse condition={step === 1}>
							<If>
								<CheckCircle
									size={48}
									className="mx-auto mb-4 text-green-500"
								/>
								<CardTitle className="text-xl font-semibold">
									Adaptation Completed
								</CardTitle>
								<CardDescription className="text-muted-foreground">
									Your content has been successfully adapted and is ready to
									use. Please refresh to view episodes.
								</CardDescription>
							</If>
							<Else>
								<Spinner className="mx-auto mb-4" />
								<CardTitle className="text-xl font-semibold">
									Adaptation in Progress
								</CardTitle>
								<CardDescription className="text-muted-foreground">
									Your content is being adapted. This may take a few moments.
								</CardDescription>
							</Else>
						</IfElse>
					</CardHeader>
					<CardContent className="text-center">
						<If condition={step !== 1}>
							<Button
								onClick={() => setOpen(true)}
								variant="outline"
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
