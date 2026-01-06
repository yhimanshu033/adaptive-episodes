'use client'

import React from 'react'

import { Card } from '@/components/aural-ui/card'

import { EStoryExpansionTab } from '../lib/types'
import useStoryExpansion from '../provider'

export default function StartTab() {
	const { setStoryExpansionTab } = useStoryExpansion()

	const handleChatWithAI = () => {
		setStoryExpansionTab(EStoryExpansionTab.CHAT)
	}

	const handleSetParameters = () => {
		setStoryExpansionTab(EStoryExpansionTab.PARAMETERS)
	}

	return (
		<div className="flex flex-col gap-6 p-6">
			<div className="space-y-2">
				<h2 className="text-fm-3xl font-fm-brand text-fm-primary">
					Choose Your Approach
				</h2>
				<p className="text-fm-md text-fm-tertiary">
					Select how you want to create your episodes
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card
					className="hover:bg-fm-surface-secondary w-full! cursor-pointer p-6 transition-colors"
					onClick={handleChatWithAI}
				>
					<div className="space-y-4">
						<h3 className="text-fm-2xl font-fm-text text-fm-primary">
							Chat with AI
						</h3>
						<p className="text-fm-md text-fm-tertiary">
							Have a conversation with AI to discuss and plan your episodes
						</p>
					</div>
				</Card>

				<Card
					className="hover:bg-fm-surface-secondary w-full! cursor-pointer p-6 transition-colors"
					onClick={handleSetParameters}
				>
					<div className="space-y-4">
						<h3 className="text-fm-2xl font-fm-text text-fm-primary">
							Set Parameters
						</h3>
						<p className="text-fm-md text-fm-tertiary">
							Define character, plot, and world parameters for your episodes
						</p>
					</div>
				</Card>
			</div>
		</div>
	)
}
