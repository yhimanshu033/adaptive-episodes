import React from 'react'
import { rolesArray } from '@/constants/global-constants'
import {
	AddUserFormSchema,
	useAddUserFormResolver,
} from '@/hooks/form-resolvers/add-user-resolver'
import useProjectAccessMutation from '@/hooks/mutation/use-project-access-mutation'
import { PlusIcon } from '@/icons/plus-icon'
import SearchUser from '@/page-builders/manage-project/search-user'
import { setMemberQuery } from '@/store/admin-store'

import { Button } from '@/components/aural-ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from '@/components/aural-ui/form'
import { SelectField, SelectItem } from '@/components/aural-ui/select'
import { If } from '@/components/if-else'

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
	console.log(form.watch('email'), form.watch('role'))
	return (
		<Form {...form}>
			<form
				onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
				className="relative my-6"
				// className="border-fm-divider-secondary bg-fm-surface-frosted/20 rounded-fm-3xl font-fm-text text-fm-placeholder relative my-6 flex items-center border-1 p-3 text-sm"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<SearchUser
									selectedValue={field.value}
									onUserSelect={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<If condition={!!form.getValues('email')}>
					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<div className="mt-2 flex items-center justify-between gap-2">
								<FormItem className="w-full">
									<FormControl>
										<SelectField
											decoration="filled"
											fullWidth
											className="!rounded-3xl"
											onValueChange={field.onChange}
											placeholder="Select Role"
											value={field.value}
										>
											{rolesArray.map((role, index) => (
												<SelectItem
													key={index}
													value={role}
													classes={{
														root: '!text-xs',
													}}
												>
													{role}
												</SelectItem>
											))}
										</SelectField>
									</FormControl>
								</FormItem>
								<Button
									disabled={!form.watch('email') || !form.watch('role')}
									variant="outline"
									size="sm"
								>
									<PlusIcon width={20} height={20} />
									<span>Add</span>
								</Button>
							</div>
						)}
					/>
				</If>
			</form>
		</Form>
	)
}
