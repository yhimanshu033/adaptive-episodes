import { TLocaleDict } from '.'

const DE_LANG: TLocaleDict = {
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
		localChanges: 'Lokal Ansehen',
		contentChanged: 'Der Inhalt scheint geändert zu sein',
		thinking: 'Denke nach...',
		example: 'Beispiel:',
		words: 'Worte',
	},
	toasts: {
		localizationSuccess: 'URL des Lokalisierungsblatts aktualisiert',
		localizationSync:
			'Synchronisierte Aktualisierungen des Lokalisierungsblatts!',
		localizationError: 'Fehler beim Aktualisieren des Lokalisierungsblatts!',
		gdriveFolderUpdated: 'Google Drive-Ordner aktualisiert!',
		gdriveAuthPrompt:
			'Warten Sie auf die Google Drive-Authentifizierung und versuchen Sie es dann erneut!',
		addedToProject: 'Zum Projekt hinzugefügt!',
		removedFromProject: 'Aus dem Projekt entfernt!',
	},
	error: {
		errorOccurred: 'Es ist ein Fehler aufgetreten !',
		goToHomePage: 'Gehen Sie zur Startseite',
	},
	auth: {
		success: 'Autorisierung erfolgreich!',
		uploadEpisode: 'Bitte übertragen Sie Ihre Episode erneut auf Google Drive!',
	},
}

export default DE_LANG
