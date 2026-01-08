export type DemoStory = {
	coverUrl: string
	genre: string
	id: string
	isCompleted?: boolean
	isNew?: boolean
	isTrending?: boolean
	plays: string
	rating: number
	title: string
	topRank?: number // For TOP 10 badge (1-10)
}

// Dummy stories with placeholder images
export const demoStories: DemoStory[] = [
	{
		id: 'st_01',
		title: 'Saving Nora',
		genre: 'Drama',
		plays: '855.8M',
		rating: 4.61,
		coverUrl: '/assets/saving-nora.webp',
		isTrending: true,
		topRank: 8,
		isCompleted: true,
	},
	{
		id: 'st_02',
		title: 'Shaktimaan - returns',
		genre: 'Action',
		plays: '1.2M',
		rating: 4.7,
		coverUrl: '/assets/shaktimaan-returns.webp',
		isNew: true,
	},
	{
		id: 'st_03',
		title: 'Insta Millionaire',
		genre: 'Suspense',
		plays: '1.4B',
		rating: 4.5,
		coverUrl: '/assets/insta-millionaire.webp',
		isTrending: true,
		topRank: 5,
		isCompleted: true,
	},
]
