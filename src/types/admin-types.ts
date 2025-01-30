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
	access_token: string
	uid: string
}

export type SessionData = Session & {
	accessToken: string
	uid: string
}
