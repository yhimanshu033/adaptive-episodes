export enum countries {
	Australia = 'Australia',
	France = 'France',
	Germany = 'Germany',
	Norway = 'Norway',
	Portugese = 'Portugese',
	Spain = 'Spain',
	UK = 'UK',
	USA = 'USA',
}

export enum storyID {
	IM = 'im',
	MVS = 'mvs',
	SN = 'SN',
}

export const stories = [
	{
		id: storyID.IM,
		versions: {
			[countries.Germany]: {
				title: 'Insta-Millionär',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/IM_German.jpgIM_German.jpg',
			},
			[countries.France]: {
				title: 'Millionaire en un Instant',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/IM_France.jpgIM_France.jpg',
			},
			[countries.Portugese]: {
				title: 'De Repente Milionário',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/Portugese.jpgPortugese.jpg',
			},
			[countries.Spain]: {
				title: 'Millonario Instataneo',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/IM_Spain.jpgIM_Spain.jpg',
			},
			[countries.UK]: {
				title: 'Insta-Millionaire',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/IM_UK.jpgIM_UK.jpg',
			},
		},
	},
	{
		id: storyID.MVS,
		versions: {
			[countries.Germany]: {
				title: 'Mein Vampir-System',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/German.jpgGerman.jpg',
			},
			[countries.France]: {
				title: 'Mon Système de Vampire',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/France.jpgFrance.jpg',
			},
			[countries.Portugese]: {
				title: 'Meu Sistema de Vampiro',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/Portugese.jpgPortugese.jpg',
			},
			[countries.Spain]: {
				title: 'Mi Sistema de Vampiros',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/Spain.jpgSpain.jpg',
			},
			[countries.Australia]: {
				title: 'My Vampire System',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/MVS_Australia.jpgMVS_Australia.jpg',
			},
			[countries.USA]: {
				title: 'My Vampire System',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/USA.jpgUSA.jpg',
			},
		},
	},
	{
		id: storyID.SN,
		versions: {
			[countries.Germany]: {
				title: 'Nora retten',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/saving-nora.webpsaving-nora.webp',
			},
			[countries.France]: {
				title: 'Sauver Nora',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/SN_France.jpgSN_France.jpg',
			},
			[countries.Portugese]: {
				title: 'Salvando Nora',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/SN_Portugese.jpgSN_Portugese.jpg',
			},
			[countries.Spain]: {
				title: 'Salvando a Nora',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/SN_Spain.jpgSN_Spain.jpg',
			},
			[countries.UK]: {
				title: 'Saving Nora',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/SN_UK.jpgSN_UK.jpg',
			},
			[countries.Australia]: {
				title: 'Saving Nora',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/Australia.jpgAustralia.jpg',
			},
			[countries.Norway]: {
				title: 'Redde Nora',
				image:
					'https://storage.googleapis.com/prod-pocketfm-generative-ai/uploads/SN_Norway.jpgSN_Norway.jpg',
			},
		},
	},
]

export const countryFlags = {
	[countries.Australia]: '🇦🇺',
	[countries.France]: '🇫🇷',
	[countries.Germany]: '🇩🇪',
	[countries.Norway]: '🇳🇴',
	[countries.Portugese]: '🇵🇹',
	[countries.Spain]: '🇪🇸',
	[countries.UK]: '🇬🇧',
	[countries.USA]: '🇺🇸',
}
