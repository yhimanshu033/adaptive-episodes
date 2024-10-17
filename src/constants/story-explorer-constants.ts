export const categories: Array<{
	action: Array<{ id: string; name: string }>
	id: 'plot' | 'character' | 'world'
	mode: string
}> = [
	{
		mode: 'Plot',
		id: 'plot',
		action: [
			{ id: 'summary', name: 'Summaries' },
			{ id: 'scenes', name: 'Scenes' },
			{ id: 'arcs', name: 'Arcs' },
			{ id: 'storysim', name: 'StorySim' },
		],
	},
	{
		mode: 'Character',
		id: 'character',
		action: [
			{ id: 'bios', name: 'Bios' },
			{ id: 'relationships', name: 'Relationships' },
			{ id: 'arcs', name: 'Arcs' },
		],
	},
	{
		mode: 'World',
		id: 'world',
		action: [
			{ id: 'locations', name: 'Locations' },
			{ id: 'props', name: 'Props' },
			{ id: 'rules', name: 'Rules' },
		],
	},
]

export const defaultMode = 'plot'
