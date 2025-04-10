import { TLocaleDict } from '.'

const DE_LANG: TLocaleDict = {
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
}

export default DE_LANG
