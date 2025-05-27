import React from 'react'
import { rolesArray } from '@/constants/global-constants'
import {
	AddUserFormSchema,
	useAddUserFormResolver,
} from '@/hooks/form-resolvers/add-user-resolver'
import useProjectAccessMutation from '@/hooks/mutation/use-project-access-mutation'
import SearchUser from '@/page-builders/manage-project/search-user'
import { setMemberQuery } from '@/store/admin-store'

import IfElse, { Else, If } from '@/components/if-else'
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
import { Separator } from '@/components/ui/separator'

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
				className="flex w-full flex-1 flex-col justify-between gap-5"
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
										<SelectContent className="bg-background mt-2" align="end">
											{rolesArray.map((role, index) => (
												<SelectItem
													className="hover:bg-muted cursor-pointer"
													key={index}
													value={role}
												>
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
				<div className="space-y-4 text-end">
					<Separator className="-mx-6 w-[calc(100%+48px)]" />
					<IfElse condition={projectAccessMutation.isPending}>
						<If>
							<IconLoader />
						</If>
						<Else>
							<Button disabled={!form.watch('email') || !form.watch('role')}>
								Add
							</Button>
						</Else>
					</IfElse>
				</div>
			</form>
		</Form>
	)
}

export default AddMemberForm
