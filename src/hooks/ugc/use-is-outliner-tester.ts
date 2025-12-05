import useIsExternalUser from '@/hooks/ugc/use-is-external-user'
import useOutlinerEnabled from '@/page-builders/plate-editor/sidebar-sections/outliner/hooks/use-outliner-enabled'

export default function useIsOutlinerTester() {
	const isOutlinerAccessible = useOutlinerEnabled()
	const isExternal = useIsExternalUser()

	return isOutlinerAccessible && isExternal
}
