import React, { useCallback, useEffect, useMemo } from 'react'
import { useUploadSlackChannelResolver } from '@/hooks/form-resolvers/upload-slack-channel-resolver'
import {
	useSlackNotificationMutation,
	useSlackNotificationQuery,
} from '@/hooks/query/use-slack-notification'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/aural-ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/aural-ui/form'
import { IconButton } from '@/components/aural-ui/icon-button'
import Input from '@/components/aural-ui/input'
import { cn } from '@/lib/utils/helpers'

import { TUpdateSlackChannelBody } from '@/types/admin-types'

const UpdateSlackChannel = () => {
	const { data } = useSlackNotificationQuery()

	const defaultChannelId = useMemo(() => data?.slack_channel_id || '', [data])

	const form = useUploadSlackChannelResolver()
	const updateSlackChanelMutation = useSlackNotificationMutation()

	const handleSubmit = ({ slack_channel_id }: TUpdateSlackChannelBody) => {
		updateSlackChanelMutation.mutate({
			slack_channel_id,
		})
	}

	const slack_channel_id = form.watch('slack_channel_id')

	const handleCopy = useCallback(() => {
		void navigator.clipboard.writeText(slack_channel_id)
		toast.success('Slack channel ID copied to clipboard')
	}, [slack_channel_id])

	useEffect(() => {
		if (!defaultChannelId) {
			return
		}

		form.setValue('slack_channel_id', defaultChannelId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultChannelId])

	return (
		<>
			<h3 className="font-fm-brand mt-4 text-sm tracking-wider uppercase">
				Slack Channel Id
			</h3>
			<Form {...form}>
				<form
					onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
					className="mt-2.5 flex w-full items-center gap-2"
				>
					<div className="border-fm-divider-secondary flex w-11/12 items-center justify-between border-1 p-3">
						<FormField
							control={form.control}
							name="slack_channel_id"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											unstyled
											className="w-full border-none pr-4 outline-none"
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
							disabled={updateSlackChanelMutation.isPending}
							variant="text"
							innerClassName={cn(
								(form.getValues('slack_channel_id').length < 3 ||
									updateSlackChanelMutation.isPending) &&
									'text-fm-tertiary',
								'text-sm !p-0 -translate-y-0 uppercase truncate'
							)}
						>
							Update
						</Button>
					</div>
					<IconButton
						shape="square"
						variant="outlined"
						icon={<Copy />}
						label="redirect icon"
						type="button"
						onClick={handleCopy}
					/>
				</form>
			</Form>
		</>
	)
}

export default UpdateSlackChannel
