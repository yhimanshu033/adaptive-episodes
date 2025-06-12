import React from 'react'
import {
	AddUserFormSchema,
	useAddUserFormResolver,
} from '@/hooks/form-resolvers/add-user-resolver'
import useProjectAccessMutation from '@/hooks/mutation/use-project-access-mutation'
import { setMemberQuery } from '@/store/admin-store'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from '@/components/aural-ui/form'

import { EProjectAccessActions } from '@/types/admin-types'

export default function SearchMembers() {
	const form = useAddUserFormResolver()
	const projectAccessMutation = useProjectAccessMutation()

	const onSubmit = (data: AddUserFormSchema) => {
		const { email, role } = data
		projectAccessMutation.mutate({
			action: EProjectAccessActions.GRANT,
			body: { user_email: email, role },
		})
		form.reset()
		setMemberQuery('')
	}

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
				className="my-6"
				// className="border-fm-divider-secondary bg-fm-surface-frosted/20 rounded-fm-3xl font-fm-text text-fm-placeholder relative my-6 flex items-center border-1 p-3 text-sm"
			>
				<FormField
					control={form.control}
					name="email"
					render={() => (
						<FormItem className="flex-1">
							<FormControl>
								{/*<SearchMembersForm*/}
								{/*	selectedValue={field.value}*/}
								{/*	onUserSelect={field.onChange}*/}
								{/*/>*/}
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
