import React, { useCallback, useEffect } from 'react'
import { useUploadSlackChannelResolver } from '@/hooks/form-resolvers/upload-slack-channel-resolver'
import {
	useSlackNotificationMutation,
	useSlackNotificationQuery,
} from '@/hooks/query/use-slack-notification'
import { CopyIcon } from '@/icons/copy-icon'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import CircularLoader from '@/components/aural-ui/circular-loader'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/aural-ui/form'
import { IconButton } from '@/components/aural-ui/icon-button'
import { InputBase } from '@/components/aural-ui/input'
import { Typography } from '@/components/aural-ui/typography'
import IfElse from '@/components/if-else'
import { cn } from '@/lib/utils/helpers'

import { TUpdateSlackChannelBody } from '@/types/admin-types'

const UpdateSlackChannel = () => {
	const { data } = useSlackNotificationQuery()
	const defaultChannelId = data?.slack_channel_id || ''

	const form = useUploadSlackChannelResolver()
	const updateSlackChannelMutation = useSlackNotificationMutation()

	const slack_channel_id = form.watch('slack_channel_id')

	const handleSubmit = ({ slack_channel_id }: TUpdateSlackChannelBody) => {
		updateSlackChannelMutation.mutate({ slack_channel_id })
	}

	useEffect(() => {
		if (defaultChannelId) {
			form.reset({ slack_channel_id: defaultChannelId })
		}
	}, [defaultChannelId, form])

	const isSubmitDisabled =
		updateSlackChannelMutation.isPending ||
		!form.formState.isDirty ||
		slack_channel_id.trim().length < 3

	const handleCopy = useCallback(() => {
		void navigator.clipboard.writeText(slack_channel_id)
		toast.success('Slack channel ID copied to clipboard')
	}, [slack_channel_id])

	return (
		<div className="space-y-3">
			<Typography
				transform="uppercase"
				variant="caption-medium"
				className="font-fm-brand"
			>
				Slack Channel ID
			</Typography>
			<Form {...form}>
				<form
					onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
					className="flex h-11 w-full items-center gap-3"
				>
					<div className="border-fm-divider-secondary focus-within:border-fm-divider-contrast flex w-11/12 items-center justify-between rounded-xs border-1 px-4 py-2 transition-all duration-300">
						<FormField
							control={form.control}
							name="slack_channel_id"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<InputBase
											unstyled
											className="placeholder:text-fm-md text-fm-md w-full border-none pr-4 outline-none"
											placeholder="Paste the slack channel ID here"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={isSubmitDisabled}
							variant="text"
							innerClassName={cn('text-sm !p-0 translate-y-0 uppercase', {
								'text-fm-tertiary cursor-disabled': isSubmitDisabled,
							})}
						>
							<IfElse
								condition={updateSlackChannelMutation.isPending}
								else={<span>Update</span>}
								if={<CircularLoader />}
							/>
						</Button>
					</div>
					<IconButton
						shape="square"
						disabled={!slack_channel_id}
						variant="outlined"
						className="border-fm-divider-secondary"
						icon={<CopyIcon />}
						label="copy icon"
						type="button"
						onClick={handleCopy}
					/>
				</form>
			</Form>
		</div>
	)
}

export default UpdateSlackChannel
