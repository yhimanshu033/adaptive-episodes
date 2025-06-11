import React, { useState } from 'react'
import useBaseExtensionMutation from '@/hooks/mutation/use-base-extension-mutation'
import useBaseExtensionQuery from '@/hooks/query/use-base-extension-data'
import {
	AlertTriangle,
	CheckCircle2,
	FileIcon,
	FileWarningIcon,
	RotateCcw,
} from 'lucide-react'

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
import { formatDate } from '@/lib/format-date'

import BaseExtensionForm from './base-extension-form'
import BaseScriptStatus from './base-script-status'

const BaseScriptExtension = () => {
	const [queryEnabled, setQueryEnabled] = useState(false)
	const { data, refetch, isFetching, isLoading } =
		useBaseExtensionQuery(queryEnabled)
	const { initialStoryData } = useEpisodeTableContext()

	const baseExtensionMutation = useBaseExtensionMutation()
	const { data: taskId, reset } = baseExtensionMutation

	const extendableRange = !(data && 'message' in data)
		? (data?.ranges?.de_end ?? 0) - (data?.ranges?.de_start ?? 1) + 1
		: 0

	const baseTaskId =
		taskId || (data && 'taskId' in data ? data.taskId : undefined)

	return (
		<Dialog open={queryEnabled} onOpenChange={setQueryEnabled}>
			<DialogTrigger
				asChild
				disabled={!initialStoryData?.base_script_drive_folder_url}
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

				{baseTaskId ? (
					<BaseScriptStatus taskId={baseTaskId} reset={reset} />
				) : (
					<IfElse condition={isFetching || isLoading}>
						<If>
							<Loader
								loaderClass="mx-auto mt-4"
								text="Extracting file information..."
							/>
						</If>

						<Else>
							{!(data && 'message' in data) && (
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
													<p className="text-muted-foreground text-sm">
														The file for base script extension couldn&apos;t be
														located.
													</p>
												</CardContent>
											</Else>
										</IfElse>
										<div className="absolute right-1 bottom-1">
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
											baseExtensionMutation={baseExtensionMutation}
										/>
									</If>
									<If condition={!!data?.previous_extension_status}>
										<Card
											className={`w-full ${
												data?.previous_extension_status.status === 'success'
													? 'text-success'
													: 'text-destructive'
											}`}
										>
											<CardContent className="flex items-start gap-2 px-4 py-3 text-sm">
												{data?.previous_extension_status.status ===
												'success' ? (
													<CheckCircle2 className="mt-0.5 size-4" />
												) : (
													<AlertTriangle className="mt-0.5 size-4" />
												)}

												<div className="flex flex-col">
													<p className="font-medium">
														{data?.previous_extension_status.message}
													</p>
													<span className="text-muted-foreground text-xs">
														{formatDate(
															data?.previous_extension_status.timestamp || '',
															true
														)}
													</span>
												</div>
											</CardContent>
										</Card>
									</If>
								</div>
							)}
						</Else>
					</IfElse>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default BaseScriptExtension
