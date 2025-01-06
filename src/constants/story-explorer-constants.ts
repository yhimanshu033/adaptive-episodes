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
			PlotAction.Summary,
			PlotAction.Scenes,
			PlotAction.Arcs,
			PlotAction.StorySim,
		],
	},
	{
		mode: ExplorerMode.Character,
		id: ExplorerModeId.Character,
		action: [
			CharacterAction.Bios,
			CharacterAction.Relationships,
			CharacterAction.Arcs,
		],
	},
	{
		mode: ExplorerMode.World,
		id: ExplorerModeId.World,
		action: [WorldAction.Locations, WorldAction.Props, WorldAction.Rules],
	},
]

export const categoryNames = {
	[PlotAction.Summary]: 'Summaries',
	[PlotAction.Scenes]: 'Scenes',
	[PlotAction.Arcs]: 'Arcs',
	[PlotAction.StorySim]: 'StorySim',
	[CharacterAction.Bios]: 'Bios',
	[CharacterAction.Relationships]: 'Relationships',
	[WorldAction.Locations]: 'Locations',
	[WorldAction.Props]: 'Props',
	[WorldAction.Rules]: 'Rules',
}

export const currentlyDisabled = PlotAction.StorySim

export const defaultMode = ExplorerModeId.Plot
