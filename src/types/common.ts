import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { LucideProps } from 'lucide-react'
import { Session } from 'next-auth'

export type LucideComponent = ForwardRefExoticComponent<
	Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>

export interface GlobalStoreState {
	isFullScreenLoading: boolean
	userData: Session | null
}

export enum EStatus {
	AB_TEST = 'AB_TEST',
	FIRST_DRAFT = '1ST_DRAFT',
	IN_REVIEW = 'IN_REVIEW',
	POLISH = 'POLISH',
	PUBLISHED = 'PUBLISHED',
	REOPENED = 'REOPENED',
	SECOND_DRAFT = '2ND_DRAFT',
}

export const BASE_STATUS = 'BASE'

export type TNoParams = Record<string, never>

export type IndexedText = {
	id: string
	text: string
}

export type MinifiedValue = Array<IndexedText>
