import { useEpisodeContext } from '@/providers/episode-id-provider'

import { PlateStoreData } from '@/types/plate-types'

export function usePlateStore() {
	const { usePlateStoreContext } = useEpisodeContext()

	const setSidebar = (sidebar: PlateStoreData['sidebar'], toggle?: boolean) => {
		usePlateStoreContext.setState((state) => {
			return { sidebar: toggle && state.sidebar === sidebar ? null : sidebar }
		})
	}

	const setResolved = (resolved: boolean, toggle?: boolean) => {
		usePlateStoreContext.setState((state) => {
			return { resolved: toggle ? !state.resolved : resolved }
		})
	}

	const setScale = (scale: number) => {
		usePlateStoreContext.setState({ scale })
	}

	const setActiveDiffId = (activeDiffId: PlateStoreData['activeDiffId']) => {
		usePlateStoreContext.setState({ activeDiffId })
	}

	const setCurrentDiffValue = (
		currentDiffValue: PlateStoreData['currentDiffValue']
	) => {
		usePlateStoreContext.setState({ currentDiffValue })
	}

	const setViewMode = (viewMode: boolean) => {
		usePlateStoreContext.setState({ viewMode })
	}

	return {
		store: usePlateStoreContext,
		setSidebar,
		setResolved,
		setScale,
		setActiveDiffId,
		setCurrentDiffValue,
		setViewMode,
	}
}

export default usePlateStore
