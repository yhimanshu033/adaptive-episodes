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
