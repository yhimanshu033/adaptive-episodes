/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import React, { useCallback, useMemo } from 'react'
import { QUICK_PROMPTS_EN } from '@/constants/ai-constants'
import {
	CLOSED_SIDEBAR_VALUE,
	configurationDialogTabToTitle,
	configurationDialogTabToTooltipName,
	DEFAULT_CONFIGURATION_DATA,
} from '@/constants/editor-constants'
import ChevronRightIcon from '@/icons/chevron-right-icon'
import { CrossIcon } from '@/icons/cross-icon'
import { MoonIcon } from '@/icons/moon-icon'
import { SunIcon } from '@/icons/sun-icon'
import EpisodeConfig, {
	EpisodeConfigProps,
} from '@/page-builders/plate-editor/configuration-dialog/episode-config'
import { ConfigurationContentItem } from '@/page-builders/plate-editor/configuration-dialog/items'
import QuickPrompts from '@/page-builders/plate-editor/configuration-dialog/quick-prompts'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import {
	ConfigurationStore,
	ESidebar,
	sidebarToTitle,
	useConfiguration,
} from 'unified-editor'

import { Button } from '@/components/aural-ui/button'
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/aural-ui/dialog'
import { Divider } from '@/components/aural-ui/divider'
import {
	IconButton,
	iconButtonVariants,
} from '@/components/aural-ui/icon-button'
import { If } from '@/components/aural-ui/if-else'
import { ScrollArea } from '@/components/aural-ui/scroll-area'
import { Tabs, TabsContent } from '@/components/aural-ui/tabs'
import { DialogHeader } from '@/components/ui/dialog'
import ForEach from '@/components/ui/for-each'

import { TQuickPrompt } from '@/types/ai-types'
import {
	EConfigurationContentItemDataType,
	EConfigurationDialogContentTab,
	ESuggestionViewingType,
	EThemeMode,
	TConfigurationContentItem,
} from '@/types/editor-types'

export interface ConfigurationDialogContentProps extends EpisodeConfigProps {
	fallbackQuickPrompts?: TQuickPrompt[]
	showEpisodeSpecificActions?: boolean
}

export default function ConfigurationDialogContent({
	fallbackQuickPrompts = QUICK_PROMPTS_EN,
	showEpisodeSpecificActions,
	...episodeConfigProps
}: ConfigurationDialogContentProps) {
	const { configurationData, handleConfigurationDataChange } =
		useConfiguration()
	const { setConfigurationDialogTab } = ConfigurationStore
	const configurationItems: TConfigurationContentItem[] = useMemo(() => {
		return [
			{
				title: 'Default Sidebar Panel',
				description: 'Select which sidebar opens by default.',
				data: {
					type: EConfigurationContentItemDataType.DROPDOWN,
					onSelect: (newDefaultSidebar) =>
						handleConfigurationDataChange({
							defaultSidebar:
								newDefaultSidebar === CLOSED_SIDEBAR_VALUE
									? null
									: (newDefaultSidebar as ESidebar),
						}),
					selectedValue:
						configurationData.defaultSidebar || CLOSED_SIDEBAR_VALUE,
					dropdownItems: [
						ESidebar.CHATBOT,
						ESidebar.OUTLINE,
						ESidebar.COMMENTS,
						ESidebar.FAR,
						ESidebar.NOTES,
						CLOSED_SIDEBAR_VALUE,
					].map((sidebar) => {
						return {
							value: sidebar,
							title: sidebarToTitle[sidebar as ESidebar] || 'Closed',
						}
					}),
				},
			},
			{
				title: 'Editor Theme',
				description:
					'Choose between light and dark modes for your editor interface.',
				data: {
					type: EConfigurationContentItemDataType.TOGGLE,
					onSelect: (dark) =>
						handleConfigurationDataChange({
							theme: dark ? EThemeMode.DARK : EThemeMode.LIGHT,
						}),
					selectedValue: configurationData.theme === EThemeMode.DARK,
					onIcon: <MoonIcon />,
					offIcon: <SunIcon />,
				},
			},
			{
				title: 'Hide Deleted Suggestions',
				description:
					'Toggle between showing desired suggestions or correction-focused ones.',
				data: {
					type: EConfigurationContentItemDataType.TOGGLE,
					onSelect: (desired) =>
						handleConfigurationDataChange(
							{
								suggestionDisplay: desired
									? ESuggestionViewingType.DESIRED
									: ESuggestionViewingType.CORRECTIONS,
							},
							true
						),
					selectedValue:
						configurationData.suggestionDisplay ===
						ESuggestionViewingType.DESIRED,
				},
			},
			{
				title: 'Quick Prompts',
				description:
					'Manage and edit your personalized quick prompts for faster interactions.',
				data: {
					type: EConfigurationContentItemDataType.CUSTOM,
					customHandler: (
						<IconButton
							onClick={() =>
								setConfigurationDialogTab(
									EConfigurationDialogContentTab.QUICK_PROMPTS
								)
							}
							icon={<ChevronRightIcon />}
							label="Edit Quick Prompts"
							variant="ghost"
							size="small"
						/>
					),
				},
			},
		] as TConfigurationContentItem[]
	}, [configurationData, handleConfigurationDataChange])

	const handleRestoreClick = useCallback(() => {
		if (
			configurationData.configurationDialogTab ===
			EConfigurationDialogContentTab.OPTIONS
		) {
			handleConfigurationDataChange({
				...DEFAULT_CONFIGURATION_DATA,
				defaultSidebar: ESidebar.CHATBOT,
			})
		} else if (
			configurationData.configurationDialogTab ===
			EConfigurationDialogContentTab.QUICK_PROMPTS
		) {
			handleConfigurationDataChange({
				quickPrompts: fallbackQuickPrompts,
			})
		}

		toast.success(
			`Restored default settings for ${configurationDialogTabToTooltipName[configurationData.configurationDialogTab]}`
		)
	}, [
		fallbackQuickPrompts,
		configurationData.configurationDialogTab,
		handleConfigurationDataChange,
	])

	return (
		<DialogContent
			noise="none"
			showCloseButton={false}
			opacity="high"
			glass="high"
			borderConfig={['left', 'right']}
			className="h-[90vh] w-[90vh] max-w-137.5 gap-2 px-0 [box-shadow:none]"
		>
			<DialogHeader className="space-y-0 px-8">
				<DialogTitle className="mb-0 flex h-14 items-center justify-between gap-4">
					Personalize Your Pocket Copilot Experience
					<DialogClose
						className={iconButtonVariants({
							variant: 'ghost',
							size: 'small',
							shape: 'square',
						})}
					>
						<CrossIcon className="h-4 w-4" />
					</DialogClose>
				</DialogTitle>

				<DialogDescription className="sr-only">
					Fine-tune Pocket Copilot to match your workflow. Adjust themes,
					panels, and AI behavior for a seamless creative experience.
				</DialogDescription>

				<Divider variant="dashed" className="border-fm-divider-secondary" />
			</DialogHeader>
			<ScrollArea className="h-[calc(90vh-200px)]">
				<Tabs className="px-8" value={configurationData.configurationDialogTab}>
					<If
						condition={
							!!configurationDialogTabToTitle[
								configurationData.configurationDialogTab
							]
						}
					>
						<div className="border-fm-divider-secondary flex items-center gap-4 border-b border-dashed py-2">
							<IconButton
								onClick={() =>
									setConfigurationDialogTab(
										EConfigurationDialogContentTab.OPTIONS
									)
								}
								icon={<ArrowLeft />}
								label="Back"
								size="small"
								variant="ghost"
							/>
							<p>
								{
									configurationDialogTabToTitle[
										configurationData.configurationDialogTab
									]
								}
							</p>
						</div>
					</If>
					<TabsContent value={EConfigurationDialogContentTab.OPTIONS}>
						<ForEach data={configurationItems}>
							{(item, idx) => (
								<ConfigurationContentItem
									key={`config-content-item-${idx}`}
									item={item}
								/>
							)}
						</ForEach>
						<If
							condition={
								showEpisodeSpecificActions && !!episodeConfigProps.episodeId
							}
						>
							<EpisodeConfig {...episodeConfigProps} />
						</If>
					</TabsContent>

					<TabsContent value={EConfigurationDialogContentTab.QUICK_PROMPTS}>
						<QuickPrompts
							quickPrompts={
								configurationData.quickPrompts.length
									? configurationData.quickPrompts
									: fallbackQuickPrompts
							}
							setQuickPrompts={(prompts) =>
								handleConfigurationDataChange({ quickPrompts: prompts })
							}
						/>
					</TabsContent>
				</Tabs>
			</ScrollArea>
			<div className="flex justify-end px-8">
				<Button
					onClick={handleRestoreClick}
					tooltip={`Restore default settings for ${configurationDialogTabToTooltipName[configurationData.configurationDialogTab]}`}
					leftIcon={<RotateCcw />}
					size="sm"
					variant="outline"
				>
					Restore Defaults
				</Button>
			</div>
		</DialogContent>
	)
}
