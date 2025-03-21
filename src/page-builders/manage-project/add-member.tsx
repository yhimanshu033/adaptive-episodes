import React from 'react'
import { rolesArray } from '@/constants/global-constants'
import {
	AddUserFormSchema,
	useAddUserFormResolver,
} from '@/hooks/form-resolvers/add-user-resolver'
import useProjectAccessMutation from '@/hooks/mutation/use-project-access-mutation'
import SearchUser from '@/page-builders/manage-project/search-user'

import { IconLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { EProjectAccessActions } from '@/types/admin-types'

const AddMember = () => {
	const form = useAddUserFormResolver()
	const projectAccessMutation = useProjectAccessMutation()

	const onSubmit = (data: AddUserFormSchema) => {
		const { email, role } = data
		projectAccessMutation.mutate({
			action: EProjectAccessActions.GRANT,
			body: { user_email: email, role },
		})
		form.reset()
	}

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
				className="flex items-center gap-2"
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
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger disabled={!form.watch('email')}>
										<SelectValue placeholder="Select Role" />
									</SelectTrigger>
									<SelectContent>
										{rolesArray.map((role, index) => (
											<SelectItem key={index} value={role}>
												{role}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
						</FormItem>
					)}
				/>
				{projectAccessMutation.isPending ? (
					<IconLoader />
				) : (
					<Button size="sm">+ Add User</Button>
				)}
			</form>
		</Form>
	)
}

export default AddMember
