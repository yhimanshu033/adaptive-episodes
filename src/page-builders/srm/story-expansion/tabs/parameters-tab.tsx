'use client'

import React from 'react'
import { MessageIcon } from '@/icons/message-icon'

import { Button } from '@/components/aural-ui/button'
import { Divider } from '@/components/aural-ui/divider'
import { IconButton } from '@/components/aural-ui/icon-button'
import { Label } from '@/components/aural-ui/label'
import { Switch } from '@/components/aural-ui/switch'
import TextArea from '@/components/aural-ui/textarea'
import { cn } from '@/lib/aural-ui/utils'

import useStoryExpansion from '../provider'
import GlobalChatTab from './global-chat-tab'

export default function ParametersTab() {
	const {
		parameters,
		setParameters,
		parameterSummary,
		handleSaveParameterSummary,
		handleFinalizePlanFromParameters,
		isSavingParameterSummary,
		isFinalizingFromParameters,
		isGlobalChatOpen,
		setIsGlobalChatOpen,
	} = useStoryExpansion()

	const handleParameterChange = (
		field: 'character' | 'plot' | 'world',
		value: string
	) => {
		setParameters((prev) => ({
			...prev,
			[field]: value,
		}))
	}

	const handleFocusToggle = (field: 'character' | 'plot' | 'world') => {
		setParameters((prev) => ({
			...prev,
			focus: prev.focus === field ? null : field,
		}))
	}

	return (
		<div className="flex h-full">
			{/* Left: Parameters Summary */}
			<div
				className={cn(
					'border-fm-divider-primary flex flex-col border-r p-6 transition-all duration-200',
					isGlobalChatOpen ? 'w-1/3' : 'w-1/2'
				)}
			>
				<div className="space-y-4">
					<h3 className="text-fm-2xl font-fm-brand text-fm-primary">
						Parameters Summary
					</h3>
					<Divider />
					<div className="flex-1">
						{parameterSummary ? (
							<p className="text-fm-md text-fm-secondary whitespace-pre-wrap">
								{parameterSummary.content}
							</p>
						) : (
							<p className="text-fm-md text-fm-tertiary">
								{
									"No summary available. Click 'Save' to generate a summary from the parameters."
								}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Middle: Parameters */}
			<div
				className={cn(
					'flex flex-col space-y-6 p-6 transition-all duration-200',
					isGlobalChatOpen ? 'w-1/3' : 'w-1/2'
				)}
			>
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<h3 className="text-fm-2xl font-fm-brand text-fm-primary">
							Parameters
						</h3>
						<p className="text-fm-md text-fm-tertiary">
							Define the key parameters for your episodes
						</p>
					</div>
					<IconButton
						type="button"
						label={isGlobalChatOpen ? 'Close Chat' : 'Open Chat'}
						tooltip={isGlobalChatOpen ? 'Close Chat' : 'Open Chat'}
						onClick={() => setIsGlobalChatOpen(!isGlobalChatOpen)}
						variant="outlined"
						icon={<MessageIcon width={18} height={18} />}
					/>
				</div>

				<div className="flex-1 space-y-6 overflow-y-auto">
					{/* Character */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="character">Character</Label>
							<Switch
								checked={parameters.focus === 'character'}
								onCheckedChange={() => handleFocusToggle('character')}
							/>
						</div>
						<TextArea
							id="character"
							value={parameters.character}
							onChange={(e) =>
								handleParameterChange('character', e.target.value)
							}
							placeholder="Enter character details..."
							decoration="outline"
							autoGrow
							minHeight={100}
							maxHeight={200}
						/>
					</div>

					{/* Plot */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="plot">Plot</Label>
							<Switch
								checked={parameters.focus === 'plot'}
								onCheckedChange={() => handleFocusToggle('plot')}
							/>
						</div>
						<TextArea
							id="plot"
							value={parameters.plot}
							onChange={(e) => handleParameterChange('plot', e.target.value)}
							placeholder="Enter plot details..."
							decoration="outline"
							autoGrow
							minHeight={100}
							maxHeight={200}
						/>
					</div>

					{/* World */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="world">World</Label>
							<Switch
								checked={parameters.focus === 'world'}
								onCheckedChange={() => handleFocusToggle('world')}
							/>
						</div>
						<TextArea
							id="world"
							value={parameters.world}
							onChange={(e) => handleParameterChange('world', e.target.value)}
							placeholder="Enter world details..."
							decoration="outline"
							autoGrow
							minHeight={100}
							maxHeight={200}
						/>
					</div>
				</div>

				<div className="border-fm-divider-primary flex justify-end gap-2 border-t pt-4">
					<Button
						onClick={handleSaveParameterSummary}
						isDisabled={isSavingParameterSummary}
						variant="secondary"
						size="sm"
					>
						{isSavingParameterSummary ? 'Saving...' : 'Save'}
					</Button>
					<Button
						onClick={handleFinalizePlanFromParameters}
						isDisabled={isFinalizingFromParameters || !parameterSummary}
						variant="primary"
						size="sm"
					>
						{isFinalizingFromParameters
							? 'Finalizing...'
							: 'Finalise Rewrite Plan'}
					</Button>
				</div>
			</div>

			{/* Right: Global Chat */}
			{isGlobalChatOpen && (
				<div className="border-fm-divider-primary w-1/3 border-l">
					<GlobalChatTab />
				</div>
			)}
		</div>
	)
}
