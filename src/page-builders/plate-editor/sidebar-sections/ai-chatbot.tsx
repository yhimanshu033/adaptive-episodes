/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import useAIChatbotHook from '@/hooks/mutation/use-aichatbot-hook'
import useAIChatbotHookTest from '@/hooks/mutation/use-aichatbot-repl-hook'
import useEpisodeContent from '@/hooks/query/use-episode-content'
import { useStoriesData } from '@/hooks/query/use-story-data'
import useAIStore, {
	addMessages,
	clearMessages,
	setPrevValue,
	setResponseValue,
	updateMessages,
} from '@/store/ai-store'
import useDiffStore from '@/store/diff-store'
import { useGlobalStore } from '@/store/global-store'
import { useEditorRef } from '@udecode/plate-common/react'
import { TDescendant } from '@udecode/slate'
import { cloneDeep } from 'lodash'
import { LoaderCircle, Send, Trash2 } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

// import { maxify } from '@/lib/utils'

// import { MinifiedValue } from '@/types/common'

const ex = {
	previous: [
		{
			children: [
				{
					text: '"txader\'s Joe, hallo?", meldete sich Alex Ambrose am Telefon des Ladens.\n"Ich brauche eine Packung Kondome und zwei Päckchen Taschentücher. Lieferung an Zimmer 1302 im Sheraton New York. Beeil dich!" Der Anrufer legte auf.\nAlex schüttelte den Kopf. Die Leute schienen nie vorbereitet zu sein.\nEr packte die gewünschten Artikel ein, zog einen',
				},
				{
					text: 'Regenmantel über und schwang',
					bold: true,
				},
				{
					text: 'sich auf sein E-Bike Richtung Sheraton Hotel am Times Square.',
				},
			],
			type: 'p',
			id: 'hfrm6',
		},
		{
			type: 'p',
			id: 'cm4t0',
			children: [
				{
					text: '\nEs war neun Uhr abends und es goss in Strömen. Seine Hose und Schuhe waren bald durchnässt und verdreckt. Zum Glück blieb die Ware trocken, aber er wagte es nicht, sich länger aufzuhalten und beeilte sich, zum Hotel zu kommen.\nAls er an Zimmer 1302 ankam, klopfte er an die Tür, die schnell geöffnet wurde.\n"Guten Abend, hier ist Ihre-" Alex verstummte schlagartig.\nDie Frau vor ihm war niemand anderes als seine Freundin Cathy!\nSie trug einen weißen Bademantel, ihr langes, dunkles Haar hing nass über ihre Schultern. Der Duft von Duschgel und Shampoo stieg ihm in die Nase.\n"Cathy? Was machst du hier?" Er starrte sie ungläubig an, immer noch wie benebelt.\n"Was machst du hier?", fragte Cathy zurück. Ihr Herz setzte einen Schlag aus und sie tat einen kleinen Schritt zurück ins Zimmer. Ihr Kopf war wie leergefegt und begann sich dann zu drehen.\n"Was ist los?" Ein anderer Mann kam zur Tür, in Bademantel und Pantoffeln, und Alex erkannte ihn sofort.\n"Du! Du wagst es, meine Freundin anzufassen?" Alex konnte die in ihm aufsteigende Wut nicht unterdrücken und ging auf Billy zu, fest entschlossen, ihm eine Lektion zu erteilen.\n"Halt!", stellte sich Cathy vor Alex. Nach einem kurzen Anflug von Panik hatte sie ein wenig Kontrolle zurückgewonnen. Da ihr Freund ihren Betrug ohnehin entdeckt hatte, gab es keinen Grund mehr, es zu verheimlichen.\nSie sah ihm direkt in die Augen. "Alex, wir müssen Schluss machen."\n"Schluss machen?" Alex war wie vor den Kopf gestoßen. Er starrte Cathy mit weit aufgerissenen Augen an. "Cathy, wir sind seit über einem Jahr zusammen. Willst du jetzt wirklich mit mir Schluss machen?"\n"Ja. Wir müssen getrennte Wege gehen." Sie hielt seinen Blick fest und sprach mit deutlicher Verachtung. "Bist du überrascht? Du hast kein Geld, Alex. Du kannst dir kaum etwas leisten. Wir unternehmen nie etwas Schönes. Solange ich mit dir zusammen bin, werden die Leute immer über mich lachen, und das ist nicht das Leben, das ich will. Ich bin zu gut, um in solcher Armut zu leben. Ich war zu naiv in meinem ersten Studienjahr und habe mich von einem Verlierer wie dir täuschen lassen!"\nSie umarmte Billys Arm und sagte zu Alex: "Billy ist jetzt mein Freund. Von jetzt an will ich nichts mehr mit dir zu tun haben. Belästige mich nicht wieder!"\n"Tja, sieht so aus, als wärst du jetzt nur noch ihr nichtsnutziger Ex!", meinte Billy mit einem provozierenden Grinsen zu Alex.\nAlex, der in seinem Regenmantel dastand, mit Schlammflecken an Hose und Schuhen, fühlte, dass Cathy Recht hatte. Er war ein kompletter Verlierer. Billy nahm ihm die braune Papiertüte aus der Hand und holte die Packung Kondome heraus. Er wedelte damit vor Alex\' Gesicht und lachte spöttisch: "Ich residiere in einem Luxushotel und lasse mir von der Ex meiner Geliebten Kondome bringen. Und du? Du bist solo. Wie überaus zuvorkommend von dir, mir auszuhelfen."\n"Weshalb verweilst du überhaupt noch hier?", fuhr Cathy Alex barsch an.\n"Nein, es ist durchaus begrüßenswert, dass er nicht das Weite gesucht hat. Vielleicht möchtest du ja Zeugin werden, wie ich ihn verprügle, nicht wahr, Cathy? Man muss einer Dame schließlich geben, wonach ihr der Sinn steht", höhnte Billy.\nAlex fühlte sich gänzlich gebrochen. Langsam wandte er sich ab und verließ das Zimmer.\n"Mensch, du nimmst nicht einmal das Geld? Ha, fabelhaft. Ich habe eine Freundin und obendrein ein Geschenk." Billy ergötzte sich am Anblick von Alex\' gebeugter, niedergeschlagener Haltung, als dieser die Tür hinter sich schloss.\nAls Alex das Hotel verließ, prasselte der Regen noch heftiger als zuvor. Er streifte seinen Regenmantel ab und ließ den kalten Regen seinen gesamten Körper durchdringen, in der Hoffnung, seinen Geist zu klären.\nCathy hatte ihn abgewiesen, weil sie ihn für mittellos hielt. Den Verlust einer derart materialistischen Frau sollte er eigentlich bejubeln, warum also empfand er Trauer?\n[Brumm brumm!]\nSein Mobiltelefon vibrierte in seiner Tasche. Alex zog es hervor und warf einen Blick darauf, doch als er die Nummer erkannte, hielt er inne. Sein ganzer Körper bebte, während er die Nachricht las.\n[Nach eingehender Prüfung hat die Familie Ambrose entschieden, dass ihr Sohn Alexander die Bedingungen für den Anspruch auf sein Erbe erfüllt hat. Ab dem heutigen Tage wird ihm die Kontrolle über sein Vermögen zurückübertragen.]\nDie bohnengroßen Regentropfen prasselten auf den Bildschirm und ließen die Textnachricht allmählich verschwimmen.\nAlex\' Gedanken begannen zu kreisen. Ohne diese Nachricht hätte er beinahe vergessen, dass er ein schwerreicher Erbe war. In den vergangenen sieben Jahren hatte seine Familie ihn beobachtet und sein Vermögen zurückgehalten, bis sie mit der Erfüllung ihrer drakonischen Bedingungen zufrieden waren. Und nun war es endlich vorüber.\nAlles, was rechtmäßig ihm gehörte, konnte er nun endlich beanspruchen.',
				},
			],
		},
	],
	current: [
		{
			children: [
				{
					text: '(Telefonklingeln) "txader\'s Joe, hallo?", meldete sich Alex Ambrose am Telefon des Ladens.\n"Ich brauche eine Packung Kondome und zwei Päckchen Taschentücher. Lieferung an Zimmer 1302 im Sheraton New York. Beeil dich!" (Klicken des aufgelegten Hörers) Der Anrufer legte auf.\nAlex schüttelte den Kopf. Die Leute schienen nie vorbereitet zu sein.\nEr packte die gewünschten Artikel ein, zog einen',
				},
				{
					text: 'Regenmantel über (Rascheln von Stoff) und schwang',
					bold: true,
				},
				{
					text: 'sich auf sein E-Bike (Surren des Elektromotors) Richtung Sheraton Hotel am Times Square.',
				},
			],
			type: 'p',
			id: 'hfrm6',
		},
		{
			type: 'p',
			id: 'cm4t0',
			children: [
				{
					text: '\nEs war neun Uhr abends und es goss in Stxömen. Seine Hose und Schuhe waren bald durchnässt und verdreckt. Zum Glück blieb die Ware txocken, aber er wagte es nicht, sich länger aufzuhalten und beeilte sich, zum Hotel zu kommen.\nAls er an Zimmer 1302 ankam, klopfte er an die Tür, die schnell geöffnet wurde.\n"Guten Abend, hier ist Ihre-" Alex verstummte schlagartig.\nDie Frau vor ihm war niemand anderes als seine Freundin Cathy!\nSie txug einen weißen Bademantel, ihr langes, dunkles Haar hing nass über ihre Schultern. Der Duft von Duschgel und Shampoo stieg ihm in die Nase.\n"Cathy? Was machst du hier?" Er starrte sie ungläubig an, immer noch wie benebelt.\n"Was machst du hier?", fragte Cathy zurück. Ihr Herz setzte einen Schlag aus und sie txat einen kleinen Schritt zurück ins Zimmer. Ihr Kopf war wie leergefegt und begann sich dann zu drehen.\n"Was ist los?" Ein anderer Mann kam zur Tür, in Bademantel und Pantoffeln, und Alex erkannte ihn sofort.\n"Du! Du wagst es, meine Freundin anzufassen?" Alex konnte die in ihm aufsteigende Wut nicht unterdrücken und ging auf Billy zu, fest entschlossen, ihm eine Lektion zu erteilen.\n"Halt!", stellte sich Cathy vor Alex. Nach einem kurzen Anflug von Panik hatte sie ein wenig Kontxolle zurückgewonnen. Da ihr Freund ihren Betxug ohnehin entdeckt hatte, gab es keinen Grund mehr, es zu verheimlichen.\nSie sah ihm direkt in die Augen. "Alex, wir müssen Schluss machen."\n"Schluss machen?" Alex war wie vor den Kopf gestoßen. Er starrte Cathy mit weit aufgerissenen Augen an. "Cathy, wir sind seit über einem Jahr zusammen. Willst du jetzt wirklich mit mir Schluss machen?"\n"Ja. Wir müssen getxennte Wege gehen." Sie hielt seinen Blick fest und sprach mit deutlicher Verachtung. "Bist du überrascht? Du hast kein Geld, Alex. Du kannst dir kaum etwas leisten. Wir unternehmen nie etwas Schönes. Solange ich mit dir zusammen bin, werden die Leute immer über mich lachen, und das ist nicht das Leben, das ich will. Ich bin zu gut, um in solcher Armut zu leben. Ich war zu naiv in meinem ersten Studienjahr und habe mich von einem Verlierer wie dir täuschen lassen!"\nSie umarmte Billys Arm und sagte zu Alex: "Billy ist jetzt mein Freund. Von jetzt an will ich nichts mehr mit dir zu tun haben. Belästige mich nicht wieder!"\n"Tja, sieht so aus, als wärst du jetzt nur noch ihr nichtsnutziger Ex!", meinte Billy mit einem provozierenden Grinsen zu Alex.\nAlex, der in seinem Regenmantel dastand, mit Schlammflecken an Hose und Schuhen, fühlte, dass Cathy Recht hatte. Er war ein kompletter Verlierer. Billy nahm ihm die braune Papiertüte aus der Hand und holte die Packung Kondome heraus. Er wedelte damit vor Alex\' Gesicht und lachte spöttisch: "Ich residiere in einem Luxushotel und lasse mir von der Ex meiner Geliebten Kondome bringen. Und du? Du bist solo. Wie überaus zuvorkommend von dir, mir auszuhelfen."\n"Weshalb verweilst du überhaupt noch hier?", fuhr Cathy Alex barsch an.\n"Nein, es ist durchaus begrüßenswert, dass er nicht das Weite gesucht hat. Vielleicht möchtest du ja Zeugin werden, wie ich ihn verprügle, nicht wahr, Cathy? Man muss einer Dame schließlich geben, wonach ihr der Sinn steht", höhnte Billy.\nAlex fühlte sich gänzlich gebrochen. Langsam wandte er sich ab und verließ das Zimmer.\n"Mensch, du nimmst nicht einmal das Geld? Ha, fabelhaft. Ich habe eine Freundin und obendrein ein Geschenk." Billy ergötzte sich am Anblick von Alex\' gebeugter, niedergeschlagener Haltung, als dieser die Tür hinter sich schloss.\nAls Alex das Hotel verließ, prasselte der Regen noch heftiger als zuvor. Er stxeifte seinen Regenmantel ab und ließ den kalten Regen seinen gesamten Körper durchdringen, in der Hoffnung, seinen Geist zu klären.\nCathy hatte ihn abgewiesen, weil sie ihn für mittellos hielt. Den Verlust einer derart materialistischen Frau sollte er eigentlich bejubeln, warum also empfand er txauer?\n[Brumm brumm!]\nSein Mobiltelefon vibrierte in seiner Tasche. Alex zog es hervor und warf einen Blick darauf, doch als er die Nummer erkannte, hielt er inne. Sein ganzer Körper bebte, während er die Nachricht las.\n[Nach eingehender Prüfung hat die Familie Ambrose entschieden, dass ihr Sohn Alexander die Bedingungen für den Anspruch auf sein Erbe erfüllt hat. Ab dem heutigen Tage wird ihm die Kontxolle über sein Vermögen zurückübertxagen.]\nDie bohnengroßen Regentxopfen prasselten auf den Bildschirm und ließen die Textnachricht allmählich verschwimmen.\nAlex\' Gedanken begannen zu kreisen. Ohne diese Nachricht hätte er beinahe vergessen, dass er ein schwerreicher Erbe war. In den vergangenen sieben Jahren hatte seine Familie ihn beobachtet und sein Vermögen zurückgehalten, bis sie mit der Erfüllung ihrer drakonischen Bedingungen zufrieden waren. Und nun war es endlich vorüber.\nAlles, was rechtmäßig ihm gehörte, konnte er nun endlich beanspruchen.\n**\nAm folgenden Morgen erwachte Alex früh und fuhr in die Stadt. Gut gelaunt stieg er aus seinem Wagen und begab sich direkt zur First Republic Bank, im Herzen des wohlhabendsten Teils des Geschäftsviertels von Manhattan, New York.\nDiverse Luxuskarossen parkten rund um die Bank. Die Menschen, die auf dem umliegenden Platz ein- und ausgingen, waren ausnahmslos wohlhabend; dies war offenkundig an ihrer Garderobe und ihrem Auftxeten zu erkennen.\nAlex schritt zur Eingangstür der Bank und stieß sie auf.\n"Autsch!"\nDie Haupttür ließ sich sowohl nach innen als auch nach außen öffnen, und Alex war etwas unachtsam gewesen, als er sie von außen aufstieß. Dadurch war die Tür gegen eine langhaarige junge Frau geprallt, die gerade das Gebäude verlassen wollte.\nEr entschuldigte sich umgehend: "Es tut mir aufrichtig leid. Ich habe dich nicht wahrgenommen."\n"Was soll das heißen, du hast mich nicht wahrgenommen? Bin ich etwa unsichtbar?" Sie presste ihre Hand an die Stirn und funkelte ihn zornig an.\nDie stellvertxetende Filialleiterin, Karen Matthews, hatte den Zwischenfall bemerkt und eilte herbei. Zunächst widmete sie sich der Frau, ehe ihr missbilligender Blick auf Alex fiel. Als sie ihn musterte, huschte ein Anflug von Argwohn über ihr Gesicht.\nDie First Republic Bank unterschied sich von gewöhnlichen Geldinstituten, da ihre Kundschaft nahezu ausschließlich aus hochrangigen Geschäftsleuten bestand. Karen wusste, dass die junge Frau in Begleitung ihres Vaters hier war, doch Alex\' Anwesenheit blieb ihr ein Rätsel. Seinem Aussehen und Alter nach zu urteilen, entsprach er nicht ihrer üblichen Klientel.\n"Womit kann ich dir behilflich sein?", fragte sie mit einem höflichen, wenn auch gezwungenen Lächeln.\nAlex erwiderte schlicht: "Ich möchte Geld abheben."\n"Geld abheben?", echote die mürrische Frau mit einem spöttischen Grinsen.\n"Hast du eine Karte?", erkundigte sich Karen, ihr höfliches Lächeln beibehaltend.\nEine exklusive First Republic Bank Card zu erhalten, war keine Kleinigkeit. Ein Mindestguthaben von einer Million Dollar war Voraussetzung, um sich dafür zu qualifizieren. Karen war überzeugt, dass der junge Mann vor ihr kaum Erfahrung mit ihrer Bank haben und deren Regularien nicht kennen konnte. Vermutlich nahm er an, dass auch Karten anderer Banken hier akzeptiert würden.\n"Nein", antwortete Alex kopfschüttelnd.\nDie Frau, die er versehentlich mit der Tür angestoßen hatte, konnte sich ein Kichern ob seiner aufrichtigen Antwort nicht verkneifen. Er war keiner weiteren Beachtung mehr wert.\n"Lass uns gehen." Ihr Vater war herangetxeten und ordnete noch die Unterlagen, die er bei sich txug.\n"Mein Vater und ich brechen jetzt auf." Die Frau schüttelte Karen die Hand und warf dann einen Blick zu Alex hinüber. "Frau Matthews, jemanden wie ihn hier zu dulden, könnte dem Ansehen Ihrer Bank schaden und Ihre Kunden verstimmen. Ich hoffe, das wird sich nicht wiederholen."\nDamit hakte sie sich bei ihrem Vater unter und öffnete die Tür.\n"Auf Wiedersehen, Herr Scott." Karen folgte ihnen einige Schritte nach draußen und beobachtete, wie sie in ein Auto stiegen und davonfuhren. Sie wandte sich um und ging wieder hinein, fest entschlossen, Alex so rasch wie möglich zum Gehen zu bewegen.\nAn der Stelle, wo Alex gestanden hatte, war niemand mehr zu sehen. Oh! Wo ist er hin?, fragte sie sich.\nWar es möglich, dass der junge Mann sich geschämt hatte und leise verschwunden war?\nBei dem Gedanken verspürte sie Erleichterung. Doch gerade als sie sich wieder ihrer Arbeit zuwenden wollte, erhaschte sie aus dem Augenwinkel einen Blick auf jemanden.\nDa ist der Bengel! Kein Wunder, dass ich ihn zunächst nicht bemerkt habe, dachte sie. Er hatte bereits den Eingang zur VIP-Lounge erreicht, und eine Säule hatte ihr die Sicht auf ihn versperrt.\nDer VIP-Bereich war ausschließlich Kunden mit hohem Status vorbehalten, die mindestens dreißig Millionen Dollar ihr Eigen nannten, und dieser junge Mann hatte zugegeben, nicht einmal eine Karte zu besitzen. Ließe sie ihn passieren, bekäme sie Ärger mit ihrem Vorgesetzten.\n"Halt! Nicht weitergehen!", rief Karen verzweifelt. Die anderen Kunden wandten sich allesamt nach ihr um, sichtlich verärgert über ihr Geschrei. Sie konnte nur entschuldigend lächeln, während sie eilig auf Alex zuschritt.\nDoch er war bereits durch die Lounge gegangen, hatte die Tür zum VIP-Raum geöffnet und war eingetxeten.\nDoch er war bereits durch die Lounge gegangen, hatte die Tür zum VIP-Raum geöffnet und war eingetxeten.',
				},
			],
		},
	],
}
const AIChatbot = () => {
	const [input, setInput] = useState('')
	const { id } = useParams()
	const messageEndRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const { messages } = useAIStore()
	const { aiChatbotMutation } = useAIChatbotHook()
	const { aiChatbotMutationTest } = useAIChatbotHookTest()
	const { data: aiResponse, isPending } = aiChatbotMutation
	const { data: aiResponseTest } = aiChatbotMutationTest
	const userData = useGlobalStore(useShallow((state) => state.userData))
	const { data: episodeContent } = useEpisodeContent()
	const { data: stories } = useStoriesData()
	const editor = useEditorRef()
	const episodesCount =
		stories?.find((data) => data?.id === Number(id))?.episode_count || 0
	// stories?.find((data) => data.id === (id as string))?.episodesCount || 0

	const diffValue = useDiffStore((state) => state.value)

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim()) return
		addMessages({ role: 'user', content: input })
		setInput('')
		aiChatbotMutation.mutate({
			episodeNumber: episodeContent?.chapter.seq_number || 0,
			episodesCount,
			aiChatbotData: {
				messages,
				query: input,
				ep_number: episodeContent?.chapter.seq_number?.toString(),
				ep_text: episodeContent?.text,
			},
		})
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage(e)
		}
	}

	useEffect(() => {
		if (!isPending && aiResponse) {
			addMessages({ role: 'assistant', content: aiResponse.response })
		}
	}, [aiResponse, isPending])

	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = '40px'
			const scrollHeight = textareaRef.current.scrollHeight
			textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`
		}
	}, [input])

	useEffect(() => {
		if (!aiResponseTest) return
		// const response = JSON.parse(aiResponseTest.response) as MinifiedValue
		// const value = maxify(response, children)
		setResponseValue(cloneDeep(ex.current))
		setPrevValue(cloneDeep(ex.previous))
		addMessages({ role: 'assistant', content: 'accept-reject' })
	}, [aiResponseTest])

	function handleAccept(i: number) {
		editor.tf.setValue(cloneDeep(ex.current))
		updateMessages({ role: 'assistant', content: 'accepted' }, i)
		setResponseValue(null)
		setPrevValue(null)
	}

	function handleReject(i: number) {
		updateMessages({ role: 'assistant', content: 'rejected' }, i)
		setResponseValue(null)
		setPrevValue(null)
	}

	const suggestions = [
		'Add sound effects',
		'Add formatting',
		'Add a scene',
		'Rename Characters',
	]

	const diffRecords = useMemo(() => {
		const diffs: TDescendant[] = []
		function getDiffs(node: TDescendant) {
			if ('diff' in node) {
				diffs.push(node)
			} else if ('children' in node) {
				;(node.children as TDescendant[]).forEach(getDiffs)
			}
		}
		diffValue.forEach(getDiffs)
		return diffs
	}, [diffValue])

	// function onAcceptDiff(ind: number) {
	// 	const diff = diffRecords[ind];
	// 	const updatedCurrent = cloneDeep(ex.current)

	// }

	console.log({ diffRecords })

	return (
		<div className="mx-auto flex h-full max-w-2xl flex-col p-4">
			<h1 className="mb-4 text-2xl font-bold">AI Chatbot</h1>
			<ScrollArea className="mb-4 flex-1 rounded-md border p-4">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`mb-4 flex items-start ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
					>
						{message.role === 'assistant' && (
							<Avatar className="mr-2">
								<AvatarImage src="/pocket-copilot-logo.webp" alt="AI" />
								<AvatarFallback>AI</AvatarFallback>
							</Avatar>
						)}
						{message.role === 'assistant' &&
						message.content === 'accept-reject' ? (
							<div className={`flex max-w-[70%] gap-2 rounded-lg p-3`}>
								<Button onClick={() => handleAccept(index)}>Accept</Button>
								<Button variant="outline" onClick={() => handleReject(index)}>
									Reject
								</Button>
							</div>
						) : message.role === 'assistant' &&
						  (message.content === 'accepted' ||
								message.content === 'rejected') ? (
							<div className={`flex max-w-[70%] gap-2 rounded-lg p-3`}>
								<p className="italic">{message.content} changes from chatbot</p>
							</div>
						) : (
							<div
								dangerouslySetInnerHTML={{
									__html: message.content.replaceAll('\n', '<br/>'),
								}}
								className={`max-w-[70%] rounded-lg p-3 ${message.role === 'assistant' ? 'bg-background' : 'bg-primary'}`}
							/>
						)}
						{message.role === 'user' && (
							<Avatar className="ml-2">
								<AvatarImage
									src={userData?.user?.image || '/placeholder-user.webp'}
									alt="User"
								/>
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
						)}
					</div>
				))}
				<div ref={messageEndRef} />
			</ScrollArea>
			<div className="flex overflow-x-scroll pb-2">
				{suggestions.map((suggestion, index) => (
					<Button
						key={index}
						variant="outline"
						size="sm"
						onClick={() => {
							addMessages({ role: 'user', content: suggestion })
							aiChatbotMutationTest.mutate({
								episodeNumber: episodeContent?.chapter.seq_number || 0,
								episodesCount,
								aiChatbotData: {
									messages,
									query: suggestion,
									ep_number: episodeContent?.chapter.seq_number?.toString(),
									ep_text: episodeContent?.text as string,
								},
							})
						}}
						className="mr-2"
					>
						{suggestion}
					</Button>
				))}
			</div>
			<div className="flex items-end gap-1">
				<form
					onSubmit={handleSendMessage}
					className="flex flex-1 items-end space-x-2 rounded-md border bg-background"
				>
					<Textarea
						ref={textareaRef}
						placeholder="Type your message..."
						disabled={isPending}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						className="min-h-[40px] grow resize-none overflow-y-auto border-none bg-transparent px-3 py-2 leading-relaxed outline-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
						style={{ height: '40px' }}
					/>
					<Button
						variant="ghost"
						size="icon"
						type="submit"
						disabled={isPending}
					>
						{isPending ? (
							<LoaderCircle className="animate-spin" size={16} />
						) : (
							<Send size={16} />
						)}
					</Button>
				</form>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="ghost" size="icon">
							<Trash2 size={16} />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								chat history from our records.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={clearMessages}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	)
}

export default AIChatbot
