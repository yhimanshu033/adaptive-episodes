import React from 'react'
import useBeatsheetStore from '@/store/beatsheet-store'
import { Plus, Trash2 } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/aural-ui/button'
import { IconButton } from '@/components/aural-ui/icon-button'
import TextArea from '@/components/aural-ui/textarea'
import EditableText from '@/components/editable-text'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

export default function Characters() {
	const {
		beatsheetStore,
		updateCharacterField,
		addNewCharacter,
		deleteCharacter,
	} = useBeatsheetStore()
	const characters = beatsheetStore(useShallow((state) => state.characters))

	const handleSaveCharacter = (characterId: string) => {
		console.log('Saving character with ID:', characterId)
	}

	return (
		<>
			<Accordion type="multiple" className="w-full">
				{characters.map((character) => (
					<AccordionItem key={character.id} value={character.id}>
						<AccordionTrigger className="flex items-center">
							<div className="flex flex-1 items-center justify-between">
								<EditableText
									isEditable
									text={character.name || 'Untitled Character'}
									onComplete={(text) =>
										updateCharacterField(character.id, 'name', text)
									}
								/>
								<IconButton
									label="Delete Character"
									icon={<Trash2 size={18} />}
									onClick={() => deleteCharacter(character.id)}
									variant="ghost"
									size="small"
								/>
							</div>
						</AccordionTrigger>

						<AccordionContent className="space-y-4">
							<div className="space-y-4 rounded-md border p-3">
								<div>
									<h4 className="mb-2 text-sm font-bold">Bio</h4>
									<TextArea
										value={character.bio}
										placeholder="Character Bio"
										onChange={(e) =>
											updateCharacterField(character.id, 'bio', e.target.value)
										}
									/>
								</div>

								<div>
									<h4 className="mb-2 text-sm font-bold">Appearance</h4>
									<TextArea
										value={character.appearance}
										placeholder="Character Appearance"
										onChange={(e) =>
											updateCharacterField(
												character.id,
												'appearance',
												e.target.value
											)
										}
									/>
								</div>
								<div>
									<h4 className="mb-2 text-sm font-bold">Recent Arc</h4>
									<TextArea
										value={character.recent_arc}
										placeholder="Recent Arc"
										onChange={(e) =>
											updateCharacterField(
												character.id,
												'recent_arc',
												e.target.value
											)
										}
									/>
								</div>
								<div>
									<h4 className="mb-2 text-sm font-bold">Voice</h4>
									<TextArea
										value={character.voice}
										placeholder="Voice"
										onChange={(e) =>
											updateCharacterField(
												character.id,
												'voice',
												e.target.value
											)
										}
									/>
								</div>

								<Button
									onClick={() => handleSaveCharacter(character.id)}
									className="w-full"
								>
									Save
								</Button>
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

			<Button onClick={addNewCharacter} className="mt-4">
				<Plus size={18} className="mr-1" /> Add Character
			</Button>
		</>
	)
}
