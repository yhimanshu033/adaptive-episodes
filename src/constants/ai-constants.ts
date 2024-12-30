import { EAction, EMessenger, TMessage } from '@/types/ai-types'

export const aiInitialMessage: TMessage[] = [
	{
		role: EMessenger.ASSISTANT,
		content: 'Wie kann ich dir heute beim Überarbeiten helfen?',
		action: EAction.MESSAGE,
	},
]
export enum AiDiffOperation {
	DELETE = 'delete',
	INSERT = 'insert',
	UPDATE = 'update',
}

export enum DiffStatus {
	ACCEPTED = 'accepted',
	PENDING = 'pending',
	REJECTED = 'rejected',
}

export enum LocalizationType {
	CONCEPT = 'concept',
	PERSON = 'character',
	PLACE = 'place',
}

export const quickPrompts = [
	`Analyze this episode's beats and suggest where dramatic tension drops or needs escalation.`,
	'Review the dialogue scenes and suggest character-revealing inner thoughts, more theatrical exchanges, and heightened emotional stakes.',
	'Identify moments where conflicts between characters could be intensified and suggest ways to make their dynamics more dramatic without changing the core plot.',
	'Map the emotional journey of the protagonist in this episode and enhance their reactions, focusing on external obstacles rather than internal flaws.',
	'Review this episode opening/ending and suggest ways to create a more compelling hook or cliffhanger that establishes immediate tension.',
	'Review this episode and suggest ways to escalate the drama by:\n1. Adding more theatrical dialogue\n2. Heightening emotional stakes\n3. Creating stronger conflicts\n4. Building tension progressively\n5. Adding powerful inner monologues',
	'Provide a beat-by-beat outline of the enhanced episode.',
	'Analyze and improve this episode opening. Create a stronger hook by:\n1. Starting with immediate tension\n2. Adding compelling character stakes\n3. Creating intrigue or mystery\n4. Setting up clear dramatic questions\n5. Establishing emotional investment',
	'Review this episode ending and suggest improvements to:\n1. Create stronger suspense\n2. Leave unresolved questions\n3. Raise the stakes\n4. Add emotional impact\n5. Drive curiosity for the next episode',
	'Analyze the dramatic function of the scenes in this episode by identifying:\n1. Their core dramatic purpose\n2. How they advance the overall plot\n3. Their emotional impact on characters\n4. Key character development moments\n5. Opportunities to strengthen their purpose',
	"Map this episode's dramatic structure:\n1. Identify all major and minor beats\n2. Evaluate the effectiveness of each beat\n3. Suggest improvements for weak beats\n4. Recommend additional beats where needed",
	'Review this episode and identify:\n1. Sections that need more emotional depth\n2. Opportunities for dramatic escalation\n3. Moments to insert revealing inner thoughts\n4. Areas to increase conflict or tension',
	'Provide an improved scene/dialogue outline that amplifies these elements.',
	'Analyze the following scene: [SCENE DESCRIPTION]\n\n1. Identify each emotional beat\n2. Note any sections lacking sufficient emotional impact\n3. Suggest opportunities for heightened drama\n4. Outline potential inner monologue additions',
	"Review this character's development: [INSERT CHARACTER]\n1. How has their emotional state changed?\n2. What realizations have they had?\n3. How have their relationships evolved?\n4. What inner conflicts are revealed?\n5. How can their arc be strengthened?",
	'Analyze this episode and identify dialogue sections that need emotional enhancement. Reply with an improved dialogue outline.',
	'Review the dialogue between [Character A] and [Character B].',
	'Map the tension points in this episode by:\n1. Rating tension levels from 1-10 throughout\n2. Identifying the climactic moment\n3. Noting where tension drops unnecessarily\n4. Suggesting additional conflict points',
	"Analyze the episode for character motivations:\n1. What does each character want?\n2. What's stopping them from getting it?\n3. Where are the conflicts between characters?\n4. How can these conflicts be heightened?\n5. What inner thoughts would reveal deeper motivations?",
]
