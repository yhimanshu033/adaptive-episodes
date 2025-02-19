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

export type SessionData = {
	accessToken: string
	uid: string
	user: UserData
} & Session

export type UserData = {
	create_time: string
	email: string
	firebase_registration_token: string | null
	firstname: string | null
	fullname: string
	id: number
	image: string | null
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
