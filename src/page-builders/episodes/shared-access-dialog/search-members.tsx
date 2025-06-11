import React from 'react'
import {
	AddUserFormSchema,
	useAddUserFormResolver,
} from '@/hooks/form-resolvers/add-user-resolver'
import useProjectAccessMutation from '@/hooks/mutation/use-project-access-mutation'
import { SearchIcon } from '@/icons/search-icon'
import { setMemberQuery } from '@/store/admin-store'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from '@/components/aural-ui/form'
import Input from '@/components/aural-ui/input'

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
				className="border-fm-divider-secondary bg-fm-surface-frosted/20 rounded-fm-3xl font-fm-text text-fm-placeholder relative my-6 flex items-center border-1 p-3 text-sm"
			>
				<SearchIcon className="mx-2" width={16} height={16} />
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<Input
									unstyled
									className="text-fm-primary w-full border-none pr-4 outline-none"
									placeholder="Add people to share access"
									onChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
			{/*<List variant="elevated" className="absolute z-99 w-[93%]">*/}
			{/*  <ListItem classes={{ content: 'block' }}>*/}
			{/*    <h3 className="text-sm">Aniket Mahajan</h3>*/}
			{/*    <span className="text-fm-secondary text-xs">*/}
			{/*						aniket.mahajan@pocketfm.com*/}
			{/*					</span>*/}
			{/*  </ListItem>*/}
			{/*  <ListItem size="default" classes={{ content: 'block' }} selected>*/}
			{/*    <h3 className="text-sm">Aniket Mahajan</h3>*/}
			{/*    <span className="text-fm-secondary text-xs">*/}
			{/*						aniket.mahajan@pocketfm.com*/}
			{/*					</span>*/}
			{/*  </ListItem>*/}
			{/*</List>*/}
		</Form>
	)
}
