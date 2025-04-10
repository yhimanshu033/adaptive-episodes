import { TLocaleDict } from '@/constants/localization'

import { EProjectAccessActions } from '@/types/admin-types'

export const projectAccessMessages: Record<
	EProjectAccessActions,
	keyof TLocaleDict['toasts']
> = {
	[EProjectAccessActions.GRANT]: 'addedToProject',
	[EProjectAccessActions.REVOKE]: 'removedFromProject',
}

export const VALID_LOC_SHEET_FORMAT =
	/^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+\/edit\?gid=\d+(#gid=\d+)?$/

export const VALID_GOOGLE_DRIVE_FOLDER =
	/^https:\/\/drive\.google\.com\/drive\/folders\/[a-zA-Z0-9-_]+(?:\?usp=[a-zA-Z0-9-_]+)?$/

export const LOC_SHEET_SERVICE_ACCOUNT =
	'text-to-speech-quickstart@pocketfmapp.iam.gserviceaccount.com'
