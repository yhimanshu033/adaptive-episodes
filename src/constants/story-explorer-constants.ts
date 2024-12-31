import { ExplorerCategories } from '@/types/ai-types'

export enum ExplorerMode {
	Character = 'Character',
	Plot = 'Plot',
	World = 'World',
}

export enum ExplorerModeId {
	Character = 'character',
	Plot = 'plot',
	World = 'world',
}

export enum PlotAction {
	Arcs = 'arcs',
	Scenes = 'scenes',
	StorySim = 'storysim',
	Summary = 'summary',
}

export enum CharacterAction {
	Arcs = 'arcs',
	Bios = 'bios',
	Relationships = 'relationships',
}

export enum WorldAction {
	Locations = 'locations',
	Props = 'props',
	Rules = 'rules',
}

export const categories: ExplorerCategories = [
	{
		mode: ExplorerMode.Plot,
		id: ExplorerModeId.Plot,
		action: [
			{ id: PlotAction.Summary, name: 'Summaries' },
			{ id: PlotAction.Scenes, name: 'Scenes' },
			{ id: PlotAction.Arcs, name: 'Arcs' },
			{ id: PlotAction.StorySim, name: 'StorySim' },
		],
	},
	{
		mode: ExplorerMode.Character,
		id: ExplorerModeId.Character,
		action: [
			{ id: CharacterAction.Bios, name: 'Bios' },
			{ id: CharacterAction.Relationships, name: 'Relationships' },
			{ id: CharacterAction.Arcs, name: 'Arcs' },
		],
	},
	{
		mode: ExplorerMode.World,
		id: ExplorerModeId.World,
		action: [
			{ id: WorldAction.Locations, name: 'Locations' },
			{ id: WorldAction.Props, name: 'Props' },
			{ id: WorldAction.Rules, name: 'Rules' },
		],
	},
]

export const currentlyDisabled = PlotAction.StorySim

export const defaultMode = ExplorerModeId.Plot
