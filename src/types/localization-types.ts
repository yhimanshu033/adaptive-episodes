export type TUpdateLOCSheetBody = {
	loc_sheet_url: string
	user_id: number
}

export type TGetLOCSheetResponse = {
	last_updated_by: {
		create_time: string
		email: string
		firebase_registration_token: string | null
		firstname: string | null
		fullname: string
		id: number
		is_verified: boolean
		lastname: string | null
		login_type: string | null
		phone_number: string | null
		uid: string
		update_time: string
		username: string | null
	}
	loc_sheet_url: string
}

export type TLOCUrlParams = {
	projectId: number
}
