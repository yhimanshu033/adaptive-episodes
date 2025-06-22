import { EMessenger, TMessage } from '@/types/ai-types'
import { EEpisodeType, ELanguage } from '@/types/common'
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

export const dummyUserMessages: TMessage[] = [
	{
		content:
			"I'm working on a complex fantasy novel and need help developing the intricate world-building elements. The story takes place in a realm where magic is tied to emotions, and different emotional states can manifest as physical phenomena in the environment. I want to explore how this affects the political landscape, social hierarchies, and daily life of the inhabitants. Can you help me brainstorm how a society might function when people's inner emotional states directly influence their surroundings? Consider aspects like governance, law enforcement, education systems, and interpersonal relationships. I'm particularly interested in how conflicts might arise between those who can control their emotions well versus those who cannot, and how this might create new forms of discrimination or privilege.",
		role: EMessenger.USER,
	},
	{
		content:
			"I'm struggling with character development for my protagonist in a science fiction thriller. She's a bioengineering researcher who discovers that her company has been conducting illegal human enhancement experiments on unwilling subjects. The moral dilemma she faces is that the research could potentially cure degenerative diseases that affect millions of people, including her own daughter who suffers from a rare genetic condition. I want to make her decision-making process realistic and emotionally compelling, showing the internal conflict between her scientific ethics, maternal instincts, and sense of justice. How can I develop her character arc to show this internal struggle without making her seem indecisive or weak? What kind of supporting characters and plot devices could help reveal different aspects of her personality and moral compass throughout the story?",
		role: EMessenger.USER,
	},
	{
		content:
			"I need assistance with creating a compelling dialogue scene between two characters who have a complicated romantic history. They're former lovers who broke up five years ago due to a misunderstanding that was never fully resolved. Now they're forced to work together on a high-stakes project that could determine the fate of their small coastal town, which is facing environmental destruction due to climate change. The tension between them needs to be palpable, but I also want to show glimpses of their former chemistry and the possibility of reconciliation. The dialogue should reveal backstory naturally without feeling forced or exposition-heavy, and it should advance both the romantic subplot and the main environmental crisis plot. How can I balance the personal drama with the larger stakes of the story while keeping the conversation feeling authentic and emotionally resonant?",
		role: EMessenger.USER,
	},
	{
		content:
			"I'm developing a historical fiction novel set during the Great Depression, focusing on a family of migrant workers traveling from Oklahoma to California. I want to accurately portray the hardships they faced while also highlighting their resilience and humanity. The story follows three generations of the same family as they navigate economic desperation, social prejudice, and the search for dignity in impossible circumstances. I need help with historical accuracy regarding the living conditions, work opportunities, and social dynamics of the time period. Additionally, I want to explore themes of hope, community, and the American Dream while avoiding both romanticizing poverty and creating an overly bleak narrative. How can I research and incorporate authentic details about this era while ensuring my characters feel like real people rather than historical archetypes or symbols?",
		role: EMessenger.USER,
	},
	{
		content:
			"I'm working on a mystery novel with multiple POV characters, and I'm having trouble managing the pacing and information reveal across different storylines. The plot involves a series of art thefts from museums around the world, and each character has a piece of the puzzle without knowing how their story connects to the others. One character is an insurance investigator, another is a museum security guard with a secret past, a third is an art historian who discovers forgeries, and the fourth is a young artist whose work is being copied by the thieves. I want each storyline to be compelling on its own while building toward a satisfying convergence where all the pieces come together. How can I structure the narrative to maintain tension and mystery in each thread while ensuring that the final revelation feels earned and logical? What techniques can I use to plant clues fairly while keeping readers guessing?",
		role: EMessenger.USER,
	},
	{
		content:
			"I need help developing a coming-of-age story about a teenager who discovers they have synesthesia - a neurological condition where stimulation of one sensory pathway leads to involuntary experiences in another sensory pathway. For my protagonist, they see colors when they hear music and taste flavors when they see certain shapes or numbers. I want to explore how this discovery affects their identity, relationships, and understanding of the world around them. The story should touch on themes of neurodiversity, self-acceptance, and finding your place in a world that doesn't always understand differences. I'm particularly interested in how their synesthetic experiences might influence their artistic abilities and how they might use this gift to help solve a mystery or conflict in their community. How can I accurately represent synesthesia while creating a compelling narrative that celebrates neurodiversity?",
		role: EMessenger.USER,
	},
	{
		content:
			"I'm crafting a psychological thriller about a woman who starts receiving mysterious packages containing objects from her childhood - toys, photos, and mementos she thought were lost forever. Each package comes with a cryptic note that seems to know intimate details about her past, including traumatic events she's never told anyone about. As the packages continue to arrive, she begins to question her own memories and sanity, wondering if someone from her past is trying to communicate with her or if she's experiencing some kind of psychological breakdown. The story needs to maintain ambiguity about whether the threat is real or imagined while building psychological tension and exploring themes of repressed trauma, memory, and identity. How can I create a narrative that keeps readers uncertain about what's real while still providing a satisfying resolution that doesn't feel like a cop-out?",
		role: EMessenger.USER,
	},
	{
		content:
			"I'm developing an urban fantasy series set in modern-day Chicago where mythological creatures from various cultures live hidden among humans. The magic system is based on the idea that belief and cultural knowledge give power to these beings - the more people who remember and believe in their stories, the stronger they become. My protagonist is a young librarian who discovers this hidden world when she inherits her grandmother's rare book collection, which turns out to be a repository of knowledge about these creatures and their histories. I want to respectfully incorporate mythologies from different cultures while avoiding appropriation or stereotypes. The main conflict revolves around a threat that could expose the hidden world to humans, potentially causing chaos and persecution. How can I research and represent various mythologies authentically while creating an original story that honors the source cultures?",
		role: EMessenger.USER,
	},
	{
		content:
			"I'm writing a literary fiction novel about a family dealing with the aftermath of a devastating wildfire that destroyed their small mountain town. The story spans several years and follows different family members as they navigate grief, displacement, and the complex process of rebuilding not just their physical lives but their emotional connections to each other and their sense of home. I want to explore themes of environmental change, community resilience, and what it means to belong somewhere when that place no longer exists in the same way. Each family member responds differently to the trauma - some want to rebuild exactly as before, others want to start fresh elsewhere, and still others become environmental activists. How can I structure this multi-generational narrative to show the long-term impacts of disaster while maintaining hope and avoiding climate fiction clichés?",
		role: EMessenger.USER,
	},
	{
		content:
			"I need assistance with creating a compelling antagonist for my space opera adventure series. This character isn't purely evil but believes they're saving humanity by forcibly uniting all human colonies under a single authoritarian government. They've witnessed the devastating effects of inter-colony wars and resource conflicts, and genuinely believe that individual freedom is a luxury humanity can't afford if it wants to survive in a hostile galaxy filled with alien threats. Their methods are ruthless, but their goals come from a place of genuine concern for human survival. I want readers to understand their perspective even while opposing their actions. The challenge is making them formidable and intelligent enough to be a real threat to my protagonists while also showing the logical progression that led them to their current beliefs. How can I develop their backstory and motivations to create moral complexity without excusing their harmful actions?",
		role: EMessenger.USER,
	},
]
