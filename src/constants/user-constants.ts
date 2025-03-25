import { EProjectAccessActions } from '@/types/admin-types'

export const projectAccessMessages = {
	[EProjectAccessActions.GRANT]: 'Zum Projekt hinzugefügt!',
	[EProjectAccessActions.REVOKE]: 'Aus dem Projekt entfernt!',
}

export const VALID_LOC_SHEET_FORMAT =
	/^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+\/edit\?gid=\d+(#gid=\d+)?$/

export const LOC_SHEET_SERVICE_ACCOUNT =
	'text-to-speech-quickstart@pocketfmapp.iam.gserviceaccount.com'
