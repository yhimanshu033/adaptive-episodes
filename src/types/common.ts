import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { LucideProps } from 'lucide-react'
import { Session } from 'next-auth'

export type LucideComponent = ForwardRefExoticComponent<
	Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>

export interface StoryJsonData {
	author_name: string
	created_at: string
	episodes: Array<{
		author: string
		beatsheets: string
		context: string
		created_at: string
		loglines: string
		path: string
		path_us: string
		status: string
		summary_de?: string
		title: string
		title_us: string
		updated_at: string
	}>
	story_title: string
	thumbnail_path: string
	totalEpisodes: number
	updated_at: string
}

export interface GlobalStoreState {
	userData: Session | null
}
