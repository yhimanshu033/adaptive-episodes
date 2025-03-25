import React from 'react'
import { rolesArray } from '@/constants/global-constants'
import {
	AddUserFormSchema,
	useAddUserFormResolver,
} from '@/hooks/form-resolvers/add-user-resolver'
import useProjectAccessMutation from '@/hooks/mutation/use-project-access-mutation'
import SearchUser from '@/page-builders/manage-project/search-user'
import { setMemberQuery } from '@/store/admin-store'

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

const AddMemberForm = () => {
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
				className="space-y-5 text-center"
			>
				<div className="flex w-full gap-2">
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
				</div>
				{projectAccessMutation.isPending ? (
					<IconLoader />
				) : (
					<Button
						className="w-full"
						disabled={!form.watch('email') || !form.watch('role')}
					>
						Add
					</Button>
				)}
			</form>
		</Form>
	)
}

export default AddMemberForm
