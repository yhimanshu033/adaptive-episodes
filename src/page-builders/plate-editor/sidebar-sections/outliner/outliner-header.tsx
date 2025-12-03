import React, { useCallback, useMemo } from 'react'
import { sidebarToTitle } from '@/constants/ai-constants'
import { SparklesSoftIcon } from '@/icons/sparkles-soft-icon'
import {
	areOutlinerTabDataEqual,
	getLatestOutlinerSelection,
} from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/fns'
import { EOutlinerTab } from '@/page-builders/plate-editor/sidebar-sections/outliner/lib/types'
import useOutliner from '@/page-builders/plate-editor/sidebar-sections/outliner/provider'
import { ZoomIn, ZoomOut } from 'lucide-react'

import CircularLoader from '@/components/aural-ui/circular-loader'
import { IconButton } from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { Typography } from '@/components/aural-ui/typography'
import { TooltipComponent } from '@/components/ui/tooltip-component'

import { ESidebar } from '@/types/plate-types'

export default function OutlinerHeader() {
	const {
		selectedOutlinerTabData,
		setOutlinerTab,
		setOutlinerTabData,
		outlinerTabData,
		outlinerTab,
		outlinerData,
		isCurrentEpPublishing,
	} = useOutliner()

	const handleTabChange = useCallback(() => {
		setOutlinerTab((prev) => {
			if (prev === EOutlinerTab.GENERATE) {
				return EOutlinerTab.VIEW
			}
			return EOutlinerTab.GENERATE
		})
	}, [setOutlinerTab])

	const handleZoomOut = useCallback(() => {
		setOutlinerTabData((prev) => {
			const newTabData = { ...prev }
			if (newTabData?.beatIdx !== undefined) {
				delete newTabData.beatIdx
			} else if (newTabData?.sceneIdx !== undefined) {
				delete newTabData?.sceneIdx
			} else if (newTabData?.summaryIdx !== undefined) {
				delete newTabData?.summaryIdx
			}
			return newTabData
		})
	}, [setOutlinerTabData])

	const handleZoomIn = useCallback(() => {
		setOutlinerTabData((prev) => {
			if (prev?.summaryIdx === undefined) {
				return {
					summaryIdx: selectedOutlinerTabData?.summaryIdx,
				}
			}
			if (prev?.sceneIdx === undefined) {
				return {
					summaryIdx: selectedOutlinerTabData?.summaryIdx,
					sceneIdx: selectedOutlinerTabData?.sceneIdx,
				}
			}
			return prev
		})
	}, [selectedOutlinerTabData, setOutlinerTabData])

	const zoomInEnabled = useMemo(() => {
		const latestSelection = getLatestOutlinerSelection(
			selectedOutlinerTabData,
			outlinerData
		)
		return (
			!areOutlinerTabDataEqual(outlinerTabData, selectedOutlinerTabData) &&
			latestSelection &&
			('scenes' in latestSelection || 'beats' in latestSelection)
		)
	}, [outlinerTabData, selectedOutlinerTabData, outlinerData])

	const zoomOutEnabled = useMemo(() => {
		return outlinerTabData?.summaryIdx !== undefined
	}, [outlinerTabData])

	const chatbotEnabled = useMemo(() => {
		return outlinerTabData?.summaryIdx === undefined
	}, [outlinerTabData])

	return (
		<section className="border-fm-divider-tertiary bg-fm-surface-primary sticky top-0 left-0 z-20 flex min-h-15.5 items-center justify-between gap-4 border-y py-3 pr-4 pl-7">
			<div className="flex items-center gap-2">
				<Typography variant="body-small" as="h4">
					{sidebarToTitle[ESidebar.OUTLINER]}
				</Typography>
				<If condition={isCurrentEpPublishing}>
					<TooltipComponent tooltip="Regenerating Metadata...">
						<CircularLoader className="size-3" />
					</TooltipComponent>
				</If>
			</div>
			<div className="flex items-center gap-2">
				<IconButton
					disabled={!zoomOutEnabled}
					onClick={handleZoomOut}
					variant="outlined"
					label="Zoom Out"
					tooltip="Zoom Out"
					size="small"
					icon={<ZoomOut />}
				/>
				<IconButton
					disabled={!zoomInEnabled}
					onClick={handleZoomIn}
					label="Zoom In"
					tooltip="Zoom In"
					variant="outlined"
					size="small"
					icon={<ZoomIn />}
				/>
				<IconButton
					onClick={handleTabChange}
					label="Outliner Chat"
					tooltip="Outliner Chat"
					variant={
						outlinerTab === EOutlinerTab.GENERATE ? 'background' : 'ghost'
					}
					disabled={!chatbotEnabled}
					size="small"
					icon={<SparklesSoftIcon />}
				/>
			</div>
		</section>
	)
}
