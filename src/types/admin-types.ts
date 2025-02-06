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

export type SessionData = Session & {
	accessToken: string
	uid: string
	user?: UserData // TODO: make mandatory once API live
}

export type UserData = {
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
	username: string
}

export enum ERole {
	ADMIN = 'ADMIN',
	LEAD = 'LEAD',
	WRITER = 'WRITER',
}
