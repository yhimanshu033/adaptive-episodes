export const episodes_list = [
	{
		id: 1,
		title: 'The Beginning',
		status: 'Published',
		writer: 'Alice Johnson',
		lastUpdated: '2023-06-01',
		wordCount: 2500,
	},
	{
		id: 2,
		title: 'The Plot Thickens',
		status: 'In Progress',
		writer: 'Bob Smith',
		lastUpdated: '2023-06-05',
		wordCount: 3000,
	},
	{
		id: 3,
		title: 'A Twist of Fate',
		status: '1st Draft',
		writer: 'Carol Davis',
		lastUpdated: '2023-06-10',
		wordCount: 2000,
	},
	{
		id: 4,
		title: 'The Climax',
		status: 'In Review',
		writer: 'David Brown',
		lastUpdated: '2023-06-15',
		wordCount: 3500,
	},
	{
		id: 5,
		title: 'The Resolution',
		status: '2nd Draft',
		writer: 'Eve Wilson',
		lastUpdated: '2023-06-20',
		wordCount: 2800,
	},
]

export type EpisodesType = (typeof episodes_list)[0]
