'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { QUICK_PROMPTS, QUICK_PROMPTS_EN } from '@/constants/ai-constants'
import { downloadLOCSheet } from '@/hooks/mutation/use-localize-hook'
import { fetchChapterCharacters } from '@/hooks/query/use-chapter-characters'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { getNextEpContent } from '@/hooks/query/use-next-episode-content'
import { getPrevEpContent } from '@/hooks/query/use-prev-episode-content'
import { getScenesMetadata } from '@/hooks/query/use-scenes-metadata-query'
import ViewLS from '@/page-builders/episodes/info/view-ls'
import { getEpisodeContent } from '@/server-action/content-action'
import { getNotes, updateNotes } from '@/server-action/episode-action'
import { getLOCSheet } from '@/server-action/localization-action'
import { getMetadata } from '@/server-action/metadata-action'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
	ContentDisplay,
	EEditorKit,
	EPlatform,
	ESidebar,
	RteData,
	ToolbarTypes,
	TRteContent,
	TRteDualViewRenderData,
} from 'unified-editor'

import { Button } from '@/components/aural-ui/button'
import { ToolbarGroup } from '@/components/plate-ui/toolbar'
import useConfiguration from '@/providers/configuration-provider'
import useEpisodeTableContext from '@/providers/episode-table-provider'
import useProjectId from '@/providers/project-id-provider'
import { hasNWMRan } from '@/lib/utils/helpers'
import { getTextFromTextOrValue } from '@/lib/utils/plate'

import { ELanguage } from '@/types/common'
import {
	DUAL_VIEW_MODES,
	EDualVIewMode,
	MODE_TO_TITLE,
} from '@/types/episode-type'

export default function useEditorConfig() {
	const contentRef = useRef<null | TRteContent>(null)
	const savedContentRef = useRef<null | TRteContent>(null)
	const session = useSession()
	const {
		data: contentData,
		isPending: isContentPending,
		latestStatus,
	} = useEpisodeContent()
	const { initialStoryData } = useEpisodeTableContext()

	// const { data: prevEpData } = usePreviousEpisodeContent()
	// const { data: baseContent } = useBaseData()
	// const { data: nextEpData, isPending } = useNextEpisodeContent()

	const { isWriter, users } = useProjectId()

	async function handleContentChange() {
		const props = contentRef?.current
		const savedProps = savedContentRef?.current
		if (!props) {
			return
		}
		if (
			savedProps &&
			JSON.stringify(savedProps.content) === JSON.stringify(props.content)
		) {
			console.log('Already saved')
			return 'Already saved'
		}
		console.log('Saving...')
		savedContentRef.current = JSON.parse(JSON.stringify(props))
	}

	const onContentChange = useCallback(async (props: TRteContent) => {
		contentRef.current = props
	}, [])

	const modes = useMemo(() => {
		const excludedModes: EDualVIewMode[] = []
		const extraModes = Object.keys(contentData?.additional_view || {}).map(
			(k) => k as EDualVIewMode
		)
		if (!contentData?.previous_parent_id) {
			excludedModes.push(EDualVIewMode.PREV_EP)
		}
		if (!contentData?.next_parent_id) {
			excludedModes.push(EDualVIewMode.NEXT_EP)
		}
		// if (!localDiffValue) {
		excludedModes.push(EDualVIewMode.LOCAL_DIFF)
		// }
		return [...DUAL_VIEW_MODES, ...extraModes].filter(
			(item) => !excludedModes.includes(item)
		)
	}, [
		contentData?.previous_parent_id,
		contentData?.next_parent_id,
		// localDiffValue,
		contentData?.additional_view,
	])

	const modeToTitle = useMemo(() => {
		if (contentData?.chapter?.language !== ELanguage.GERMAN_ORIGINAL) {
			MODE_TO_TITLE[EDualVIewMode.US_TRANSLATION] = 'Source Script'
		}
		return MODE_TO_TITLE
	}, [contentData])

	const extraViews = useMemo(() => {
		if (!contentData?.additional_view) {
			return {}
		}
		console.log({ additional: contentData?.additional_view })
		return Object.keys(contentData.additional_view).reduce(
			(acc, k) => {
				return {
					...acc,
					[k as EDualVIewMode]: {
						component: (
							<ContentDisplay
								content={contentData?.additional_view?.[k]}
								customButton={
									<Button
										tooltip="Copy Content"
										variant="outline"
										size="sm"
										onClick={() => {
											void navigator.clipboard.writeText(
												getTextFromTextOrValue(
													contentData?.additional_view?.[k] || ''
												)
											)
											toast.success('Content copied successfully!')
										}}
									>
										Copy
									</Button>
								}
								enableDiff
								reverseDiff
							/>
						),
					},
				}
			},
			{} as Record<EDualVIewMode, { component: React.ReactNode }>
		)
	}, [contentData])

	const modeToComponent: Record<string, TRteDualViewRenderData> = useMemo(
		() => ({
			[EDualVIewMode.US_TRANSLATION]: {
				content: contentData?.translation_text,
			},
			[EDualVIewMode.BASE_SCRIPT]: {
				fetchContent: async () =>
					(
						await getEpisodeContent(
							Number(contentData?.chapter?.parent || contentData?.chapter?.id)
						)
					)?.text || '',
			},
			[EDualVIewMode.PREV_EP]: {
				fetchContent: () => getPrevEpContent(contentData),
			},
			[EDualVIewMode.NEXT_EP]: {
				fetchContent: () => getNextEpContent(contentData),
			},
			// [EDualVIewMode.LOCAL_DIFF]: { component: <LocalDiffSection /> },
			...extraViews,
		}),
		[extraViews, contentData]
	)

	useEffect(() => {
		const intervalId = setInterval(() => {
			handleContentChange().catch(console.error)
		}, 2000)

		return () => clearInterval(intervalId)
	}, [])

	const editorConfig = useMemo(() => {
		const data: RteData = {
			auth: {
				accessToken: session.data?.accessToken || '',
				platform: EPlatform.COPILOT,
				uid: session.data?.user.id || '',
			},
			contentConfig: {
				content: contentData?.text || '',
				comments: contentData?.chapter?.props?.comments,
				id: contentData?.chapter?.id,
				language: contentData?.chapter?.language,
				llmProps: contentData?.chapter?.props?.llm_memories,
				seqNumber: contentData?.chapter?.seq_number,
				title: contentData?.chapter?.chapter_title,
				isLoading: isContentPending,
				onContentChange,
			},
			userData: {
				...session?.data?.user,
				name: session?.data?.user?.fullname || 'User',
				id: String(session?.data?.user?.id),
			},
			sidebarConfig: {
				activeSidebar: ESidebar.CHATBOT,
				enabledDefaultSidebars: [
					ESidebar.CHATBOT,
					ESidebar.COMMENTS,
					ESidebar.DUAL_VIEW,
					ESidebar.FAR,
					ESidebar.NOTES,
					ESidebar.OUTLINE,
					ESidebar.BEAT_SHEET,
				],
				sidebarButtons: [ESidebar.CHATBOT, ESidebar.OUTLINE],
				defaultSidebarConfig: {
					[ESidebar.CHATBOT]: {
						quickPrompts:
							contentData?.chapter?.language === ELanguage.GERMAN_ORIGINAL
								? QUICK_PROMPTS
								: QUICK_PROMPTS_EN,
					},
					[ESidebar.BEAT_SHEET]: {
						enableBeatSheetEditor: hasNWMRan(contentData?.chapter),
						getChapterCharacters: () =>
							fetchChapterCharacters({
								chapter_id: Number(contentData?.chapter.id || 0),
							}),
						getScenesMetadata: () => getScenesMetadata(contentData?.chapter.id),
					},
					[ESidebar.NOTES]: {
						getNotes: () => getNotes(Number(contentData?.chapter.project)),
						updateNotes: ({ params }) =>
							updateNotes({
								project_id: contentData?.chapter?.project || 0,
								params,
							}),
					},
					[ESidebar.FAR]: {
						downloadLOCSheetFunc: () =>
							downloadLOCSheet(String(contentData?.chapter?.project || 0)),
						getLOCSheet: () =>
							getLOCSheet(Number(contentData?.chapter?.project)),
						showAddForm:
							contentData?.chapter.language === ELanguage.GERMAN_ORIGINAL,
						showSuggestions:
							contentData?.chapter.language === ELanguage.GERMAN_ORIGINAL,
						// remaining
					},
					outline: {
						enableCustomSearch: true,
					},
				},
			},
			pluginConfig: {
				plugins: [
					EEditorKit.Align,
					EEditorKit.Autoformat,
					EEditorKit.BasicNodes,
					EEditorKit.Comment,
					EEditorKit.Discussion,
					EEditorKit.Docx,
					EEditorKit.ExitBreak,
					EEditorKit.FindAndReplace,
					EEditorKit.FloatingToolbar,
					EEditorKit.Font,
					EEditorKit.Laser,
					EEditorKit.LaserPrompt,
					EEditorKit.LineHeight,
					EEditorKit.Suggestion,
					EEditorKit.TrailingBlock,
				],
			},
			extraConfig: {
				getMetadata: async ({ start, end }) =>
					(
						await getMetadata(
							Number(contentData?.chapter?.project),
							start,
							end,
							contentData?.chapter?.language
						)
					).data,
				storyData: initialStoryData,
			},
			accessControlConfig: {
				disableEditing:
					!isWriter || latestStatus !== contentData?.chapter?.status,
				enableAccessControl:
					!isWriter || latestStatus !== contentData?.chapter?.status,
				members: Object.values(users),
			},
			toolbarConfig: {
				floatingToolbar: [
					{
						type: ToolbarTypes.FLOATING_TURN_INTO,
					},
					{
						type: ToolbarTypes.FLOATING_BOLD,
					},
					{
						type: ToolbarTypes.FLOATING_ITALIC,
					},
					{
						type: ToolbarTypes.FLOATING_UNDERLINE,
					},
					{
						type: ToolbarTypes.FLOATING_COLOR,
					},
					{
						type: ToolbarTypes.FLOATING_BACKGROUND_COLOR,
					},
					{
						type: ToolbarTypes.FLOATING_LASER,
					},
					{
						type: ToolbarTypes.COMMENT_TOOLBAR,
					},
					{
						type: ToolbarTypes.SUGGESTION_TOOLBAR,
					},
				],
				fixedToolbar: [
					{
						type: ToolbarTypes.UNDO,
					},
					{
						type: ToolbarTypes.REDO,
					},
					{
						type: ToolbarTypes.ZOOM_DROPDOWN,
					},
					{
						type: ToolbarTypes.FONT_FAMILY,
					},
					{
						type: ToolbarTypes.FONT_SIZE,
					},
					{
						type: ToolbarTypes.BOLD,
					},
					{
						type: ToolbarTypes.ITALIC,
					},
					{
						type: ToolbarTypes.UNDERLINE,
					},
					{
						type: ToolbarTypes.TURN_INTO,
					},
					{
						type: ToolbarTypes.COLOR,
					},
					{
						type: ToolbarTypes.BACKGROUND_COLOR,
					},
					{
						type: ToolbarTypes.LINE_HEIGHT,
					},
					{
						type: ToolbarTypes.ALIGN,
					},
					{
						type: 'custom',
						component: <div className="w-full" />,
					},
					...(contentData?.chapter.language === ELanguage?.GERMAN_ORIGINAL
						? [
								{
									type: ToolbarTypes.TTS,
								},
							]
						: []),
					{
						type: ToolbarTypes.FIND_REPLACE,
					},
					{
						type: ToolbarTypes.BEAT_SHEET_EDITOR_TOGGLE,
					},
					{
						type: ToolbarTypes.TRANSLATION,
					},
					{
						type: 'custom',
						component: <ViewLS />,
					},
				],
			},
			dualViewConfig: {
				dualViewButtons: modes,
				dualViewKeyToTitle: modeToTitle,
				dualViewMap: modeToComponent,
			},
		}
		return data
	}, [
		onContentChange,
		contentData,
		session,
		isContentPending,
		modeToComponent,
		modeToTitle,
		modes,
		initialStoryData,
		latestStatus,
	])

	return { editorConfig }
}
