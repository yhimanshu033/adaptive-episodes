import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { TAdminStoreState } from '@/types/admin-types'

const initialState: TAdminStoreState = {
	deleteMemberMail: '',
	addMemberQuery: '',
}

const useAdminStore = create(devtools(immer(() => initialState)))

export const setDeleteMemberMail = (deleteMemberMail: string) => {
	useAdminStore.setState({ deleteMemberMail })
}

export const setMemberQuery = (addMemberQuery: string) => {
	useAdminStore.setState({ addMemberQuery })
}

export default useAdminStore
