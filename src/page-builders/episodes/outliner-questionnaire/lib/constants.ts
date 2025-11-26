import {
	TStoryDataKey,
	TStoryIdeaData,
	TWriterProfileKey,
} from '@/page-builders/episodes/outliner-questionnaire/lib/types'

import { EAction, EMessenger, TMessage } from '@/types/ai-types'

export const sampleStoryData: TStoryIdeaData[] = [
	{
		title: 'The Silent Observer',
		logline:
			'A reclusive photographer captures a crime on film, becoming entangled in a dangerous game of cat and mouse with both the criminals and the detective investigating the case.',
		synopsis:
			"Marcus Reed, a socially anxious photographer who prefers capturing urban landscapes to interacting with people, accidentally photographs a murder while shooting city nightscapes from his apartment window. When the killers realize they've been photographed, they begin hunting for the witness, while Detective Sloane pressures Marcus to help with the investigation. As Marcus reluctantly becomes involved, he discovers connections between the crime and a powerful political figure, forcing him to navigate a world of corruption he's spent his life avoiding. His photographic eye and attention to detail become his greatest tools as he learns to use his observer status to his advantage, ultimately finding his voice through the very isolation that once defined him.",
		main_character:
			'Marcus Reed is a talented but reclusive photographer who has built walls between himself and the world, preferring to experience life through his camera lens. His social anxiety and preference for solitude have made him an exceptional observer of human behavior and environmental details, though he struggles with direct confrontation and emotional connections.',
		world:
			"Contemporary urban setting in a mid-sized American city with stark contrasts between wealthy districts and struggling neighborhoods. The story moves between Marcus's sparse, carefully arranged apartment filled with photography equipment, the gritty streets he documents through his lens, and the sterile police precinct where he reluctantly shares his observations.",
		key_relationships:
			"Marcus develops an uneasy alliance with Detective Sloane, who recognizes his observational talents but grows frustrated with his reluctance to engage. There's also tension with Eliza, a journalist who wants to use Marcus's photos for a story, challenging his desire to remain uninvolved while offering a potential romantic connection that forces him to confront his isolation.",
		tone_and_style:
			"Tense and atmospheric with moments of quiet introspection. The narrative often focuses on visual details and observations, mirroring Marcus's photographic perspective. Dialogue is sparse but meaningful, with Marcus's internal thoughts providing rich contrast to his limited verbal communication.",
		narrative_journey:
			"A reluctant hero's journey that forces an observer to become a participant in his own life. The pacing builds gradually as Marcus moves from passive witness to active investigator, with tension escalating as both criminals and corruption close in around him.",
		themes:
			"The power and limitations of observation, the moral responsibility of witnessing, isolation versus connection, and finding courage through one's unique perspective.",
		why_this_fits:
			"This story centers on a character who embodies the observer archetype, allowing for rich character development as they're forced to engage with the world. The narrative naturally builds tension through the protagonist's reluctance to participate, creating compelling internal and external conflicts.",
	},
	{
		title: 'Echoes of Silence',
		logline:
			'When a deaf librarian discovers she can read the thoughts of anyone touching the ancient books in her care, she becomes entangled in a centuries-old secret society desperate to control her ability.',
		synopsis:
			"Eliza Chen, a deaf librarian working in a prestigious university's rare manuscript collection, discovers she has developed a strange ability: when people touch the ancient books in her care, she can 'hear' their thoughts as clear as spoken words. This newfound power reveals that a professor researching the collection belongs to the Custodians, a secret society that has protected—and exploited—these thought-transmitting texts for centuries. When Eliza learns that previous 'readers' like herself have either joined the Custodians or disappeared, she must decide whether to flee or use her unique perspective to uncover the society's true agenda. As she investigates, Eliza realizes the books contain knowledge that could either enlighten humanity or be weaponized by those seeking control, forcing her to determine who can be trusted with such power—including herself.",
		main_character:
			'Eliza Chen is a methodical, observant deaf librarian who has built her life around books and the quiet sanctuary of the library. Her deafness has made her exceptionally attuned to visual cues and body language, allowing her to notice details others miss. Though initially content with her observer role, her new ability forces her to become an active participant in a dangerous game where her perspective as an outsider becomes her greatest strength.',
		world:
			'Set in a prestigious East Coast university with Gothic architecture and a labyrinthine library housing rare manuscripts. The world expands to include hidden chambers beneath the city where the Custodians meet, and global locations connected to the ancient texts. The setting blends academic mystery with secret society intrigue.',
		key_relationships:
			"Eliza forms a cautious alliance with Marcus, a junior member of the Custodians questioning their methods. She also navigates a complex relationship with her mentor, Professor Harlow, who initially seems supportive but may have hidden motives. Throughout, Eliza's relationship with the library itself—and the knowledge it contains—serves as a central dynamic.",
		tone_and_style:
			"Atmospheric and contemplative with moments of intense suspense. The narrative often explores the contrast between silence and communication, with rich descriptions of Eliza's unique sensory experience. The story features thoughtful exploration of knowledge, power, and perspective.",
		narrative_journey:
			"A discovery narrative that evolves into a thriller as Eliza moves from passive recipient of her ability to active investigator and eventual decision-maker about the fate of the books. The story builds through revelations about the Custodians' history and Eliza's growing understanding of her power's potential.",
		themes:
			'The power of observation versus participation, knowledge as both liberation and danger, communication beyond conventional means, and finding strength in perceived limitations.',
		why_this_fits:
			'This story creates a unique observer character whose very limitations become her strength. The narrative naturally positions the protagonist as someone who watches from the outside before being drawn into active participation, creating a compelling character arc that explores the power of perspective.',
	},
	{
		title: 'The Memory Collector',
		logline:
			'A museum night guard with hyperthymesia—perfect autobiographical memory—becomes obsessed with solving the mystery behind a visitor who appears nightly in security footage but never on camera in person.',
		synopsis:
			"Samuel Thorne works as a night guard at the Metropolitan Museum of Art, where his condition of hyperthymesia—the ability to remember every detail of his life with perfect clarity—makes him exceptional at noticing when artifacts have been moved even slightly. When reviewing security footage, Samuel notices a woman in a distinctive red coat who appears on camera night after night, studying specific artifacts, but whom he has never encountered in person despite his meticulous rounds. As Samuel becomes obsessed with identifying this visitor, he discovers subtle changes to exhibits after her appearances and realizes she's somehow manipulating the cameras. His investigation leads him to uncover that she's collecting specific memories embedded in artifacts by a forgotten 19th-century inventor—memories that, when assembled, could reveal a historical secret that powerful people want to remain buried. As Samuel pursues her, his perfect memory becomes both his greatest asset and his vulnerability, as he questions which of his recollections he can trust when faced with technology that can manipulate perception itself.",
		main_character:
			"Samuel Thorne is a middle-aged museum guard whose hyperthymesia has made ordinary life challenging—relationships are difficult when you remember every slight and disappointment with perfect clarity—but has found purpose in his role protecting historical artifacts. He's methodical, detail-oriented, and prefers the quiet company of historical objects to the unpredictability of people. His perfect memory makes him an ideal observer, though he struggles with analysis and making connections between the facts he recalls.",
		world:
			'Set primarily in the atmospheric, labyrinthine Metropolitan Museum after hours, with its shadowy galleries, forgotten storage rooms, and hidden passages. The museum becomes a character itself—a repository of history where the past and present coexist. The story expands to include historical archives and the secret workshops where memory-embedding technology was developed.',
		key_relationships:
			"Samuel develops an unusual connection with the mysterious visitor, Elena, whose motives remain ambiguous—is she preserving these memories or stealing them? Their cat-and-mouse game evolves into reluctant collaboration. Samuel also navigates a strained relationship with the museum's curator, who may know more about the artifacts' secrets than he admits.",
		tone_and_style:
			"Atmospheric mystery with elements of historical fiction and light science fiction. The narrative often contrasts Samuel's precise, detail-oriented perspective with the emotional weight of the memories he discovers. The story has a contemplative pace punctuated by moments of revelation and tension.",
		narrative_journey:
			"An investigation narrative that becomes increasingly personal as Samuel discovers connections between the historical memories and his own past. The story builds through the gradual revelation of the visitor's purpose and the larger conspiracy surrounding the memory-embedded artifacts.",
		themes:
			'The reliability and fallibility of memory, observation versus understanding, the ethical implications of preserving versus altering history, and finding connection through shared experience.',
		why_this_fits:
			"This story creates a protagonist who is the ultimate observer—someone whose very nature is to notice and remember everything—and places them in a mystery that challenges the reliability of observation itself. The character's journey from passive recorder to active investigator creates natural tension and growth.",
	},
]

export const storyDataKeyToTitle: Record<TStoryDataKey, string> = {
	title: 'Title',
	logline: 'Logline',
	synopsis: 'Synopsis',
	main_character: 'Main Character',
	world: 'World / Setting',
	key_relationships: 'Key Relationships',
	tone_and_style: 'Tone & Style',
	narrative_journey: 'Narrative Journey',
	themes: 'Themes',
	why_this_fits: 'Why This Fits',
}

export const storyDataKeyToRegenerateEnabled: Partial<
	Record<TStoryDataKey, boolean>
> = {}

export const storyDataKeyToMultiSelect: Partial<
	Record<TStoryDataKey, boolean>
> = {}

export const writerProfileKeyToTitle: Record<TWriterProfileKey, string> = {
	genre: 'Genre',
	world: 'World / Setting',
	journey: 'Character Journey',
	show_style: 'Show / Narrative Style',
	relationship: 'Relationship Focus',
	story_length: 'Story Length',
	character_type: 'Character Type',
	dialogue_style: 'Dialogue Style',
}

export const INITIAL_CHAT_MESSAGE: TMessage = {
	role: EMessenger.ASSISTANT,
	action: EAction.BLOCK,
	content:
		"Hey there! Before we jump into your story, I'd love to get a feel for what kind of stories you dream up. Sound good?",
	taskId: '',
}

export const EMPTY_STORY_DATA: TStoryIdeaData = {
	key_relationships: '',
	logline: '',
	main_character: '',
	narrative_journey: '',
	synopsis: '',
	themes: '',
	title: '',
	tone_and_style: '',
	why_this_fits: '',
	world: '',
}
