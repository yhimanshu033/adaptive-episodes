import {
	EEpisodeType,
	ELanguage,
	ELSMappingChineseGender,
	ELSMappingType,
	LSMappingInput,
} from '@/types/common'
import { TGetEpisodeResponse, TGetEpisodesResponse } from '@/types/episode-type'

export const sampleEpisodeDetails: TGetEpisodesResponse = {
	count: 1,
	next: null,
	previous: null,
	results: {
		data: [
			{
				chapter_title: 'Chapter 1',
				comments: '',
				context: '',
				create_time: '2023-10-01T12:00:00Z',
				file_url: 'test',
				id: 1,
				type: EEpisodeType.ORIGINAL,
				is_deleted: false,
				latest_version: 1,
				original_seq_number: 1,
				parent: null,
				project: 1,
				seq_number: 1,
				status: 'BASE',
				translation_url: '',
				update_time: '2023-10-01T12:00:00Z',
				word_count: 45,
				language: ELanguage.ENGLISH,
			},
			{
				chapter_title: 'Chapter 1 Spanish',
				comments: '',
				context: '',
				create_time: '2023-10-01T12:00:00Z',
				file_url: 'test',
				id: 2,
				type: EEpisodeType.ADAPTED,
				is_deleted: false,
				latest_version: 1,
				original_seq_number: 1,
				parent: 1,
				project: 1,
				seq_number: 1,
				status: 'BASE',
				translation_url: '',
				update_time: '2023-10-01T12:00:00Z',
				word_count: 45,
				language: ELanguage.MEXICAN_SPANISH,
			},
		],
		message: 'success',
	},
}

export function getSampleGetEpisodeResponse(id: number): TGetEpisodeResponse {
	const episode = sampleEpisodeDetails.results.data.find((ep) => ep.id === id)

	return {
		chapter: episode || sampleEpisodeDetails.results.data[0],
		next_parent_id: null,
		previous_parent_id: null,
		text: 'EPISODE ' + id,
		translation_text: 'EPISODE TRANSLATED' + id,
	}
}

export const sampleLSMappingInput: LSMappingInput = {
	ls_mapping: {
		'Localization Details': {
			'han sen': {
				type: ELSMappingType.CHARACTER,
				ID: 'char_1',
				localised_name: 'Cassian Thorne',
				'First Name (Original)': 'Sen',
				'Last Name (Original)': 'Han',
				'First Name (Localized)': 'Cassian',
				'Last Name (Localized)': 'Thorne',
				gender: ELSMappingChineseGender.MALE,
				'Localization Reason':
					"In line with the 'Americanize' directive, 'Han Sen' is localized to a classic Western fantasy name. 'Cassian' is a strong, Latinate name suggesting sophistication and power. The surname 'Thorne' is Anglo-Saxon and evokes a sense of mystery and danger, fitting for a protagonist concealing his true abilities. The alias 'San Mu' (literally 'Three Woods') is localized to 'Sam Wood', a simple, unassuming name that serves as an effective disguise while subtly nodding to the original meaning.",
				Description:
					"Han Sen (韩森), a powerful individual of the crystallizer race, has been a guest of Long Shan's family on Dragon Pool Island for two weeks. To conceal his true identity during his stay, he uses the alias 'San Mu'. Han Sen is highly observant and strategic, traits evident in his noticing the scrutiny of Dragon Fifteen and the unusual behavior of Spiky Turtles being drawn to the Dragon Pool. He feels a strong sense of duty to the family, a result of their hospitality.\n\nInitially, Han Sen attempted to conceal his full power. However, he was compelled to reveal his abilities to protect the family from an overwhelming attack by Spiky Turtles. His demonstrated powers include a potent speed-reduction technique, referred to as both 'jade light' and 'Turtle spell,' which proved effective even against Marquise-class creatures. His name follows Chinese naming conventions, with 'Han' (韩) being the family name and 'Sen' (森) the given name.",
				created_by: 'adaptation',
			},
			'dragon fifteen': {
				type: ELSMappingType.CHARACTER,
				ID: 'char_2',
				localised_name: 'Dragon Fifteen',
				'First Name (Original)': '',
				'Last Name (Original)': '',
				'First Name (Localized)': 'Dragon Fifteen',
				'Last Name (Localized)': '',
				gender: ELSMappingChineseGender.MALE,
				'Localization Reason':
					"As per the 'foreign_character_rules', the name 'Dragon Fifteen' is preserved. 'Dragon' clearly identifies his faction, and the numerical designation 'Fifteen' is a key cultural marker that highlights his 'otherness' and the hierarchical nature of his race, which enriches the world-building as intended by the strategy.",
				Description:
					"Known as Dragon Fifteen, this perceptive and intelligent member of the Dragon race observes events on Dragon Pool Island from afar, always accompanied by his maid. His name, with 'Fifteen' likely indicating a numerical designation, rank, or title within his organization, clearly identifies his lineage. Dragon Fifteen notably recognized Han Sen's potential early on. He asserts the Dragon race's authority over the region, having issued a veiled warning to Xius. Although he claims to be in the Return Ruin Sea to investigate a strange, unrelated incident, this statement is likely a deception. Xius familiarly refers to him as 'Fifteen,' and he is also descriptively known as 'The Dragon man.'",
				created_by: 'adaptation',
			},
			'long shan': {
				type: ELSMappingType.CHARACTER,
				ID: 'char_3',
				localised_name: 'Corbin Drake',
				'First Name (Original)': 'Shan',
				'Last Name (Original)': 'Long',
				'First Name (Localized)': 'Corbin',
				'Last Name (Localized)': 'Drake',
				gender: ELSMappingChineseGender.MALE,
				'Localization Reason':
					"The 'Long' family name, meaning 'dragon,' is localized to 'Drake,' a direct and resonant Western equivalent rooted in draconic lore. As the patriarch, 'Long Shan' is given the name 'Corbin,' a strong, classic name of Latin origin that conveys authority and fits the epic fantasy setting. This establishes a clear naming convention for the family.",
				Description:
					"Long (龙) is the patriarch and primary defender of his family, who reside on Dragon Pool Island. His family name, meaning 'dragon,' is fitting given their home's location under the Dragon race's domain. A Marquise-class warrior, Long is capable of fighting a Marquise Spiky Turtle independently, though he initially struggles in such engagements. He demonstrated this during a recent confrontation where he gained the upper hand only after Han Sen intervened to slow his opponent. As the family's leader, he is responsible for defending their home and has been hosting Han Sen for two weeks.",
				created_by: 'adaptation',
			},
		},
		'Mention Mappings': {
			'han sen': {
				type: ELSMappingType.CHARACTER,
				ID: 'char_1',
				'Canonical Name': 'Han Sen',
				localised_name: 'Cassian Thorne',
				gender: ELSMappingChineseGender.MALE,
				'Chapter Numbers': 2,
				created_by: 'adaptation',
			},
			'san mu': {
				type: ELSMappingType.CHARACTER,
				ID: 'char_1',
				'Canonical Name': 'Han Sen',
				localised_name: 'Sam Wood',
				gender: ELSMappingChineseGender.MALE,
				'Chapter Numbers': 2,
				created_by: 'adaptation',
			},
			'dragon fifteen': {
				type: ELSMappingType.CHARACTER,
				ID: 'char_2',
				'Canonical Name': 'Dragon Fifteen',
				localised_name: 'Dragon Fifteen',
				gender: ELSMappingChineseGender.MALE,
				'Chapter Numbers': 2,
				created_by: 'adaptation',
			},
		},
	},
}
