import { Locale } from '@/i18n/config'

export const EN_LANG = {
	landing: {
		title: 'Welcome to Pocket CoPilot',
		description:
			"Write, review, & localize Pocket FM's successful audio stories with a creative AI assistant.",
		cta: 'Explore Stories',
		features: {
			title: 'How it works',
			f1_title: 'Explore Stories',
			f1_desc: `Find Pocket FM's most successful stories, generate translations, and organize all drafts & versions in one place.`,
			f2_title: 'Start Writing',
			f3_title: 'AI Collaboration',
			f2_desc:
				'Write, adapt, receive feedback, and finalize your episodes for production.',
			f3_desc: `Enjoy a full suite of AI tools to enhance your storytelling and overcome writer's block.`,
		},
	},
	notFound: {
		title: 'Not Found!',
		description: 'Go to the home page',
	},
	common: {
		unassigned: 'Unassigned',
	},
	placeholders: {
		initialAiMessage: 'How can I help you with your revision today?',
		enterMessage: 'Enter your message...',
		localizationLoading: 'Searching for localized names, please wait...',
		somethingWentWrong: 'Something went wrong',
		notesError: 'Your notes could not be added',
	},
}

export type TLocaleDict = typeof EN_LANG

export const DE_LANG: TLocaleDict = {
	landing: {
		title: 'Willkommen bei Pocket CoPilot',
		description:
			'Schreiben, überprüfen und lokalisieren Sie die erfolgreichen Audiogeschichten von Pocket FM mit einem kreativen KI-Assistenten.',
		cta: 'Entdecken Sie Geschichten',
		features: {
			title: 'Wie es funktioniert',
			f1_title: 'Entdecken Sie Geschichten',
			f1_desc:
				'Finden Sie die erfolgreichsten Geschichten von Pocket FM, erstellen Sie Übersetzungen und organisieren Sie alle Entwürfe und Versionen an einem Ort.',
			f2_title: 'Beginnen Sie mit dem Schreiben',
			f3_title: 'KI-Zusammenarbeit',
			f2_desc:
				'Schreiben Sie, passen Sie an, erhalten Sie Feedback und stellen Sie Ihre Episoden für die Produktion fertig.',
			f3_desc:
				'Profitieren Sie von einer umfassenden Palette an KI-Tools, um Ihr Storytelling zu verbessern und Schreibblockaden zu überwinden.',
		},
	},
	notFound: {
		title: 'Nicht gefunden!',
		description: 'Gehen Sie zur Startseite',
	},
	common: {
		unassigned: 'Nicht zugewiesen',
	},
	placeholders: {
		initialAiMessage: 'Wie kann ich dir heute beim Überarbeiten helfen',
		enterMessage: 'Geben Sie Ihre Nachricht ein...',
		localizationLoading: 'Suche nach lokalisierten Namen, bitte warten...',
		somethingWentWrong: 'Etwas ist schief gelaufen',
		notesError: 'Ihre Notizen konnten nicht hinzugefügt werden',
	},
}

export const DICTS: Record<Locale, TLocaleDict> = {
	en: EN_LANG,
	de: DE_LANG,
}
