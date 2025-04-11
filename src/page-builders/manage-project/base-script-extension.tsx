import React, { useState } from 'react'
import useBaseExtensionQuery from '@/hooks/query/use-base-extension-data'
import { FileIcon, FileWarningIcon, RotateCcw } from 'lucide-react'

import IfElse, { Else, If } from '@/components/if-else'
import { Loader } from '@/components/loader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import useEpisodeTableContext from '@/providers/episode-table-provider'

import BaseExtensionForm from './base-extension-form'

const BaseScriptExtension = () => {
	const [queryEnabled, setQueryEnabled] = useState(false)
	const { data, refetch, isFetching, isLoading } =
		useBaseExtensionQuery(queryEnabled)
	const { initialStoryData } = useEpisodeTableContext()

	const extendableRange =
		(data?.ranges?.de_end ?? 0) - (data?.ranges?.de_start ?? 0) + 1 || 0

	const handleDialogOpen = () => {
		setQueryEnabled(true)
	}

	return (
		<Dialog>
			<DialogTrigger
				asChild
				disabled={!initialStoryData?.base_script_drive_folder_url}
				onClick={handleDialogOpen}
			>
				<Button>Extend Base Scripts</Button>
			</DialogTrigger>
			<DialogContent
				className="flex w-2/3 max-w-none flex-col items-start"
				autoFocus={false}
			>
				<DialogHeader>
					<DialogTitle>Base Script Extension</DialogTitle>
					<DialogDescription>
						Please verify the extracted info and initiate base script extension.
					</DialogDescription>
				</DialogHeader>
				<IfElse condition={isFetching || isLoading}>
					<If>
						<Loader
							loaderClass="mx-auto mt-4"
							text="Extracting file information..."
						/>
					</If>
					<Else>
						<div className="mx-auto w-1/2 space-y-2">
							<Card className="relative">
								<IfElse condition={!!data?.file_found}>
									<If>
										<CardHeader className="flex flex-row items-center gap-2">
											<FileIcon size={16} />
											<CardTitle className="truncate text-base font-semibold">
												{data?.file_name}
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4 text-sm">
											<div className="flex flex-col gap-2">
												<div>
													<span className="font-medium">
														Extendable DE Range:{' '}
													</span>{' '}
													<Badge variant="outline">
														{data?.ranges?.de_start || 0}
													</Badge>{' '}
													-{' '}
													<Badge variant="outline">
														{data?.ranges?.de_end || 0}
													</Badge>
												</div>
												<div className="text-muted-foreground">
													Total episodes available to extend:{' '}
													<strong>{extendableRange}</strong>
												</div>
											</div>
										</CardContent>
									</If>
									<Else>
										<CardHeader className="pb-2">
											<CardTitle className="flex items-center gap-2 text-base font-semibold text-red-600">
												<FileWarningIcon size={16} /> File Not Found
											</CardTitle>
										</CardHeader>
										<CardContent className="mb-5">
											<p className="text-sm text-muted-foreground">
												The file for base script extension couldn&apos;t be
												located.
											</p>
										</CardContent>
									</Else>
								</IfElse>
								<div className="absolute bottom-1 right-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => void refetch()}
									>
										<RotateCcw size={16} />
									</Button>
								</div>
							</Card>
							<If condition={!!data?.file_found}>
								<BaseExtensionForm
									totalEpisodes={extendableRange}
									data={data ?? undefined}
								/>
							</If>
						</div>
					</Else>
				</IfElse>
			</DialogContent>
		</Dialog>
	)
}

export default BaseScriptExtension
