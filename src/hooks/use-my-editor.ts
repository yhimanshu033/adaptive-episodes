/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { useMemo } from 'react'
import { TrailingBlockPlugin, Value } from 'platejs'
import { usePlateEditor } from 'platejs/react'

import { AlignKit } from '@/components/editor/plugins/align-kit'
import { AutoformatKit } from '@/components/editor/plugins/autoformat-kit'
import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { CommentKit } from '@/components/editor/plugins/comment-kit'
import { discussionPlugin } from '@/components/editor/plugins/discussion-kit'
import { DocxKit } from '@/components/editor/plugins/docx-kit'
import { ExitBreakKit } from '@/components/editor/plugins/exit-break-kit'
import { FindAndReplaceKit } from '@/components/editor/plugins/find-and-replace-kit'
import { FloatingToolbarKit } from '@/components/editor/plugins/floating-toolbar-kit'
import { FontKit } from '@/components/editor/plugins/font-kit'
import { LaserKit } from '@/components/editor/plugins/laser-kit'
import { LaserPromptKit } from '@/components/editor/plugins/laser-prompt-kit'
import { LineHeightKit } from '@/components/editor/plugins/line-height-kit'
import { suggestionPlugin } from '@/components/editor/plugins/suggestion-kit'
import {
	SuggestionLeaf,
	SuggestionLineBreak,
} from '@/components/plate-ui-v2/suggestion-node'
import { SuggestionRenderer } from '@/components/plate-ui-v2/suggestion-renderer'
import useProjectId from '@/providers/project-id-provider'
import { migrateOldComments } from '@/lib/plate/migrateOldComments'
import { migrateOldSuggestions } from '@/lib/plate/migrateOldSuggestions'
import { breakDownValue } from '@/lib/utils/plate'

import { TCommentGeneric } from '@/types/plate-types'

const useMyEditor = ({
	content,
	id = 'plate-editor',
	comments = [],
}: {
	comments?: TCommentGeneric[]
	content: string
	id?: string
	simplified?: boolean
}) => {
	const {
		users,
		me: { user: userData },
	} = useProjectId()

	const value = useMemo(() => {
		if (!content) {
			return ''
		}
		try {
			return migrateOldSuggestions(JSON.parse(content) as Value)
		} catch {
			return breakDownValue(content)
		}
	}, [content])

	const discussions = migrateOldComments(comments, value)

	const editor = usePlateEditor(
		{
			plugins: [
				// Marks
				...BasicNodesKit,
				...FontKit,

				// Block Style
				...AlignKit,
				...LineHeightKit,

				// Collaboration
				discussionPlugin.configure({
					options: {
						currentUserId: String(userData?.user.id),
						discussions,
						users,
					},
					render: {
						aboveNodes: SuggestionRenderer,
					},
				}),
				...CommentKit,
				suggestionPlugin.configure({
					options: {
						currentUserId: String(userData?.user.id),
					},
					render: {
						node: SuggestionLeaf,
						belowNodes: SuggestionLineBreak as any,
					},
				}),

				// Editing
				...AutoformatKit,
				...ExitBreakKit,
				TrailingBlockPlugin,
				...FindAndReplaceKit,

				// UI
				...FloatingToolbarKit,

				//Parsers
				...DocxKit,

				//laser
				...LaserKit,
				...LaserPromptKit,
			],
			value: [
				{
					type: 'p',
					children: [
						{
							text: '"Try not to die by tripping over yourself, Quinn!" A boy shouted down the hallway, laughing uncontrollably right after.\nQuinn dismissed the petty mockery as he carried on walking down the school corridor. The harassment had become a daily occurrence for him, but it still bothered him just as much as it did every other day. Thus, he wasn\'t able to hold back his desire to retaliate.\nQuinn slowed down his stride and stopped. He pushed his glasses back up onto the ridge of his nose as they had slipped down from his face. Just from looking at the glasses, it was clear that he needed a new pair - One could tell that they were heavily worn. The glasses looked crooked as he wore them, and even the temples had tape covering them.\nHe then turned around and immediately raised his middle finger, responding to the slander, "I bet you don\'t even know how many fingers I\'m holding up!"\nUpon hearing the taunt, the boy clenched his fist and started running towards Quinn.\n"You level 1 piece of crap! When are you going to learn that you don\'t belong in this world?"\nThe boy placed both of his hands together, and a green ball of light started to form between them. When he was only a few meters away from Quinn, the boy threw his hands forward and a green beam shot out from the palm of his hands.\nQuinn had nowhere to go, and the ray of light was too fast for him to dodge. Hence, he knew that all he could do was grit his teeth and bear the pain. As the light hit him, his body was lifted into the air and sent flying backward on to the far end corridor wall.\n"What\'s going on?" A student among the crowd said. "Are they fighting on the last day of school?"\nA crowd had immediately formed outside, interested in what the commotion was all about. One of the female students ran over to the wall\'s damaged part to check on the assaulted student\'s safety.\nAs the dust started to settle down, Quinn\'s slightly curly black hair slowly came into view. When the smoke eventually cleared up, the female student finally saw who it was. She instantly backed away and continued on with her business as if nothing happened.\nThe moment that the female student had returned to her friends, he could see that they were laughing at her.\n"I can\'t believe you tried to help him."\n"I didn\'t see who it was." The girl retorted, her cheeks flushed.\nAfter that, Quinn stood up and lifted his glasses that were thrown on the floor. To his dismay, one of the hinges had fallen off once again. Instead of wearing the worn-out pair, he let it hang on his hand.\n"Damn it. Not again..."',
						},
					],
					id: 'ZCk9b5Ia4hp3Qu-_TXyzE',
					scene_id: 'scene_1',
				},
				{
					type: 'p',
					children: [
						{
							text: "It was the last day of school for Quinn, so he hoped that someone wouldn't try anything with him. He was sick and tired of their doings, but he wasn't the type to ignore those either. He had seen people who had chosen to keep their heads down and tolerate the harassment. However, their treatment was far worse than what he received.\nHe didn't bother to stay at school like the rest of the students, he picked up his broken glasses and proceeded to leave school. As he walked past, he saw the students having conversations among themselves in their circles. Some were laughing while some had tears, thinking it was the last time they would ever see each other again. However, Quinn wasn't a part of any of that and he didn't want to be. Cliques would not welcome him anyway. He was the weird one.\nWhen he finally arrived home, he immediately went to work. Living in a single bedroom apartment with just enough space to fit a single bed and desk was enough for him. A TV was mounted on the wall, but Quinn would merely use it as a background noise source and didn't watch anything.\n",
						},
					],
					id: 'irKiXXETIKmDtL0FSZ97H',
					scene_id: 'scene_2',
				},
				{
					type: 'p',
					children: [
						{
							text: 'The apartment was provided to him by the government since he had no living relatives and was only sixteen years of age. On top of his bed was a single suitcase that contained all of his belongings that were neatly packed.\nHe walked towards a cabinet, immediately pulling a drawer open which accommodated a single book. It was a large and thick hard-bound book, weighing about half a kilo. The front cover of the book was in a colour that mimicked a lighter shade of blood. In the centre, the lonesome fronts of an upper and lower jaw bone could be seen, both coloured in the swampy shade of brown. The upper jaw sort of had four separated fangs. Meanwhile, the lower one had two sharp teeth on the two far ends on the overhead and five evenly spaced underneath.\n"Let\'s try again today," Quinn said as he lifted the book and placed it on top of the desk.\nHe then quickly went to his bag to pull out a little test tube that was half-filled with a colourless liquid.\n"Test 112, Hydrochloric acid. Let\'s see how it goes?" He then started to slowly pour the liquid out of the test tube onto the book.\n"So far, there is no reaction." He proceeded to continue to pour all of the test tube contents on the book, but there was no reaction at the end of his experiment.\nCarefully, he examined the book while jotting down the results in his notebook. Seeing if there was any damage done, yet the book looked the same as always.\n"Another failure. Why won\'t you open? Why did mum and dad even have this thing?"\nOne hundred and twelve times - This was the number of different ways that Quinn had tried to open the book. Not only did the book not open, but it seemed like it cannot be damaged either. He had even tried burning the book, cutting the book, melting the book, though nothing had worked against the book that seemed utterly durable.\nLying on his bed, he turned on the TV for its sole purpose, making background noises. He never really paid attention to what was on. With it, the sound of other voices made him feel less lonely.the book, which seemed completely resistant.\n\nLying on his bed, he turned on the television for its only purpose – to create background noise. He never really paid attention to what was on. This way, he felt less lonely through the voices of others.\n',
						},
					],
					id: 'UZS1nlztDMmfTz7pIFroV',
					scene_id: 'scene_3',
				},
				{
					type: 'p',
					children: [
						{
							text: 'Upon turning on, the TV displayed an ongoing NEWS show.\n"The peace treaty with the Dalki race has lasted for five years now, but officials are saying that tension is rising once again. Now, we must prepare for another war…."\nThe mention of war had always been shown on the TV nonstop ever since a certain day thirty years ago. The human race received a visit from the so-called Dalki. They had the physique of humans, except for their skins that were riddled with scales and the presence of tails that were similar to what the dragons had.\nWith no real clue of why they had suddenly appeared, they immediately demanded that the Human race hand over their resources and wanted to use them as slaves. Of course, the humans decided to fight back, but they quickly found out that their modern technology was useless against them. Bullets couldn\'t penetrate their skin, and as for tanks, well, Dalki had airships.\nEvery individual, disregarding the gender, was told to fight for their planet, and that included Quinn\'s parents. The war went on for years, so he grew up not knowing what his parents looked like.\nWhen the humans were on the brink of defeat, a select group of people came forward - These people had special abilities. They began sharing their knowledge of how they obtained such power in hopes of turning the tide in the war, and thankfully, it worked. Even so, the Dalki were still strong, and a seemingly endless stalemate led to the peace treaty signing five years ago.\nObviously enough, human greed got the better of humanity, and instead of sharing these powers with everybody else, the higher-ranked governmental officials decided to keep them for themselves. Only those with money could learn the more powerful abilities while everyone else was left with scraps.\nIt was something that needed to be done. Poverty had taken over the world, but people had powers and were using them uncontrollably, unlike before.\nQuinn was given nothing when his parents died. The government agreed to pay for his living expenses while he was still in school, but that was it. When his parents died, him being at the age of ten, an agent appeared at his doorstep and handed him a book. He was told that it was the only thing that his parents possessed - One that they passed down when they died.\n"Why is the world so unfair?" He uttered, lamenting about his situation.one. Poverty had taken over the world, but now humans possessed powers and used them uncontrollably – unlike before.\n\nQuinn got nothing when his parents died. The government agreed to cover his living expenses as long as he went to school, but that was all. When his parents died and he was ten years old, an agent appeared at his front door and handed him a book. He was told it was the only thing his parents had owned – something they had left behind when they died.\n\n"Why is the world so unfair?" he murmured, lamenting his fate.',
						},
					],
					id: 'foj9jwE3I7PAT9xsSnQwJ',
					scene_id: 'scene_4',
				},
				{
					type: 'p',
					children: [
						{
							text: 'Getting out of his bed, he started sauntering towards his desk. He picked up his glasses that were still slightly broken and decided that he needed to fix them. He noticed that one of the lenses was slightly out of place, and tried to punch it back into its frame.\n"Come on! Just get in!" He shouted as he tried to forcefully fix the glasses. The frustration he had been bottling up was on his face as he struggled furiously with the lens.\nUnfortunately, the lens suddenly crumbled into pieces, one of the shards of plastic even created a deep gash in his thumb.\nHe screamed and kicked at the table.\n"Why does the world hate me?"\nAfter a while, he calmed down and started to clean up the little pieces of glass, noticing that a piece had landed on top of his book. As Quinn removed the piece of glass, a drop of blood from his thumb landed on top of the book.\nThe object plastered on the centre of the book started to glow, and suddenly, the book began to float, hovering until it was on eye-level with Quinn.\nQuinn darted back and away from it. The glow form the book made his room look emptier with the little bed at the corner and the solitary seat beside it.\n"What the hell is happening?!"\nThe book started to emit a blinding radiance as it shook uncontrollably. A few seconds later, it finally opened up, pages after pages were being turned. Quinn couldn\'t take his eyes off of the shining book - It was as if he was in a deep trance. The words written on the pages of the book weren\'t in any language that he had seen before. Nevertheless, for some reason, he felt like he could understand it.\nWhen the book reached its last page, it started to disappear, gradually turning into dust. At the same time, his body suddenly felt weak. Quinn\'s vision was starting to fade, and with that, his eyes pulled shut.\nBut just before he passed out, there was a single message that he heard.\n<Congratulations you have been granted the Va....>\nUnable to maintain consciousness long enough to hear the final words, Quinn duly passed out.\n',
						},
					],
					id: 'eRgXhavXp5Ls3jw7AsOGl',
					scene_id: 'scene_5',
				},
			],
			id,
		},
		[value, users, userData?.user.id, discussions, id]
	)

	return editor
}

export default useMyEditor
