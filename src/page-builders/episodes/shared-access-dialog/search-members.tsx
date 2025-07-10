import React, { useEffect } from 'react'
import { rolesArray } from '@/constants/global-constants'
import {
	AddUserFormSchema,
	useAddUserFormResolver,
} from '@/hooks/form-resolvers/add-user-resolver'
import useProjectAccessMutation from '@/hooks/mutation/use-project-access-mutation'
import { PlusIcon } from '@/icons/plus-icon'
import SearchUser from '@/page-builders/manage-project/search-user'
import { setMemberQuery } from '@/store/admin-store'
import { useEpisodeStore } from '@/store/episode-store'

import { Button } from '@/components/aural-ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from '@/components/aural-ui/form'
import {
	SelectField,
	SelectItem,
	SelectSeparator,
} from '@/components/aural-ui/select'
import { If } from '@/components/if-else'
import { cn } from '@/lib/aural-ui/utils'

import { EProjectAccessActions } from '@/types/admin-types'

export default function SearchMembers() {
	const form = useAddUserFormResolver()
	const projectAccessMutation = useProjectAccessMutation()
	const { useEpisodeTableStore } = useEpisodeStore()
	const isSharedAccessDialogOpen = useEpisodeTableStore(
		(state) => state.isSharedAccessDialogOpen
	)

	const reset = () => {
		form.reset()
		setMemberQuery('')
	}

	const onSubmit = (data: AddUserFormSchema) => {
		const { email, role } = data
		projectAccessMutation.mutate({
			action: EProjectAccessActions.GRANT,
			body: { user_email: email, role },
		})
		reset()
	}

	useEffect(() => {
		if (!isSharedAccessDialogOpen) {
			reset()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSharedAccessDialogOpen])

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
				className="relative p-8 pb-10"
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
							<div className="relative z-51 mt-3 flex items-center justify-between gap-2">
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
												<div key={`role-option-${index}`}>
													<SelectItem
														value={role}
														classes={{
															root: '!text-xs',
														}}
													>
														{role}
													</SelectItem>
													<If condition={index < rolesArray.length - 1}>
														<div className="px-2">
															<SelectSeparator />
														</div>
													</If>
												</div>
											))}
										</SelectField>
									</FormControl>
								</FormItem>
								<Button
									disabled={!form.watch('email') || !form.watch('role')}
									isDisabled={!form.watch('email') || !form.watch('role')}
									size="sm"
									leftIcon={<PlusIcon width={20} height={20} />}
									innerClassName={cn({
										'translate-y-0':
											!form.watch('email') || !form.watch('role'),
									})}
								>
									Add
								</Button>
							</div>
						)}
					/>
				</If>
			</form>
		</Form>
	)
}
