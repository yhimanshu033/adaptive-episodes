import React, { useCallback, useEffect, useMemo } from 'react'
import { useUploadSlackChannelResolver } from '@/hooks/form-resolvers/upload-slack-channel-resolver'
import {
	useSlackNotificationMutation,
	useSlackNotificationQuery,
} from '@/hooks/query/use-slack-notification'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

import IfElse, { If } from '@/components/if-else'
import { IconLoader } from '@/components/loader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { TUpdateSlackChannelBody } from '@/types/admin-types'

const UpdateSlackChannel = () => {
	const { data } = useSlackNotificationQuery()

	const defaultChannelId = useMemo(() => data?.slack_channel_id || '', [data])

	const defaultChannelName = useMemo(
		() => data?.slack_channel_name || '',
		[data]
	)

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
		<Form {...form}>
			<form
				onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}
				className="flex flex-1 items-end gap-2"
			>
				<FormField
					control={form.control}
					name="slack_channel_id"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>
								Slack Channel ID
								<If
									condition={
										!!slack_channel_id && slack_channel_id === defaultChannelId
									}
								>
									<Badge className="ml-4">{defaultChannelName}</Badge>
								</If>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Paste the slack channel ID here"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					size="icon"
					variant="outline"
					type="button"
					onClick={handleCopy}
				>
					<Copy size={16} />
				</Button>
				<IfElse
					condition={updateSlackChanelMutation.isPending}
					if={<IconLoader />}
					else={<Button>Update</Button>}
				/>
			</form>
		</Form>
	)
}

export default UpdateSlackChannel
