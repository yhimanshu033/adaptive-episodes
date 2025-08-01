import { Session } from 'next-auth'

export interface Writer {
	cmsThroughputDay: number
	cmsThroughputMonth: number
	id: number
	isWorking: boolean
	name: string
	totalBriefs: number
	totalHours: number
	totalScripts: number
	vacationDays: number
	writingDaysPerWeek: number
}

export interface WriterTableProps {
	writers: Writer[]
}

export type LoginBodyParams = {
	token: string
}

export type LoginResponse = {
	data: {
		access_token: string
		uid: string
	}
}

export type SessionData = Session

export type UserData = {
	create_time: string
	email: string
	firebase_registration_token: string | null
	firstname: string | null
	fullname: string
	google_drive_token?: string | null
	id: number
	image: string | null
	is_verified: boolean
	lastname: string | null
	login_type: string | null
	phone_number: string | null
	recent_projects?: number[]
	uid: string
	update_time: string
	username: string
}

export type UserProject = {
	project: {
		author: string
		create_time: string
		id: number
		image: string
		project_title: string
		props: Record<string, unknown>
		status: string
		update_time: string
		user: null | UserData
	}
	role: ERole
}

export enum ERole {
	ADMIN = 'ADMIN',
	LEAD = 'LEAD',
	READER = 'READER',
	WRITER = 'WRITER', // ONLY IN FE FOR USERS WHO ARE NOT A PART OF THE PROJECT
}

export type MemberData = {
	role: ERole
	user: UserData
}

export type TGetMembersResponse = {
	members: MemberData[]
}

export type TUpdateWritersBody = {
	user_id: number
}

export type TGetAllUsersResponse = {
	data: UserData[]
	message: string
	status: number
}

export type TGetAllUsersQueryParams = {
	q: string
}

export type TProjectAccessURLParams = {
	projectId: number
	userId: number
}

export type TProjectAccessBody = {
	role?: ERole
	user_email: string
}

export enum EProjectAccessActions {
	GRANT = 'grant',
	REVOKE = 'revoke',
}

export enum EProjectUsersHeaderKeys {
	DELETE = 'delete',
	EMAIL = 'email',
	ROLE = 'role',
	SERIAL_NUMBER = 'serial-number',
	USER = 'user',
}

export enum EFolderType {
	BASE_SCRIPT = 'base_script',
	CMS = 'cms',
}

export type TAdminStoreState = {
	addMemberQuery: string
	deleteMemberMail: string
}

export type TUpdateGDriveFolderBody = {
	drive_folder_url: string
	user_id?: number
}

export type TUpdateGDriveFolderUrlParams = {
	projectId: string
}

export type TMessageResponse = { message: string }

export type TBaseScriptExtensionResponse = {
	file_found: boolean
	file_id: string
	file_name: string
	previous_extension_status: {
		message: string
		status: string
		timestamp: string
	}
	ranges: {
		de_end: number
		de_start: number
		file_end: number
		file_start: number
		us_end: number
		us_start: number
	}
}

export type TBaseScriptExtensionBody = {
	file_id: string
	project_id: number
	ranges: {
		de_end: number
		de_start: number
		file_end: number
		file_start: number
		us_end: number
		us_start: number
	}
}

export type TGetSlackChannelParams = {
	projectId: string
}

export type TGetSlackChannelResponse = {
	bot_is_member: boolean
	slack_channel_id?: string
	slack_channel_name?: string
}

export type TUpdateSlackChannelBody = {
	slack_channel_id: string
}
