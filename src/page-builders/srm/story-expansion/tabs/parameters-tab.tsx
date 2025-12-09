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

import { TParameter } from '../lib/types'
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
		field: Exclude<keyof TParameter, 'focus'>,
		value: string
	) => {
		setParameters((prev) => ({
			...prev,
			[field]: value,
		}))
	}

	const handleFocusToggle = (field: Exclude<keyof TParameter, 'focus'>) => {
		setParameters((prev) => {
			const currentFocus = prev.focus || []
			const isFocused = currentFocus.includes(field)
			return {
				...prev,
				focus: isFocused
					? currentFocus.filter((f) => f !== field)
					: [...currentFocus, field],
			}
		})
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
					{/* Active & Unresolved Plot Threads */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="activePlotThreads">
								ACTIVE & UNRESOLVED PLOT THREADS
							</Label>
							<Switch
								checked={
									parameters.focus?.includes('activePlotThreads') || false
								}
								onCheckedChange={() => handleFocusToggle('activePlotThreads')}
							/>
						</div>
						<TextArea
							id="activePlotThreads"
							value={parameters.activePlotThreads}
							onChange={(e) =>
								handleParameterChange('activePlotThreads', e.target.value)
							}
							placeholder="Where story left off, what should happen next? (suggest threads that are dangling need to be wrapped up / or an old thread that can come back - from NWM or generated)"
							decoration="outline"
							autoGrow
							minHeight={100}
							maxHeight={200}
						/>
					</div>

					{/* Key Moments & Escalations */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="keyMoments">KEY MOMENTS & ESCALATIONS</Label>
							<Switch
								checked={parameters.focus?.includes('keyMoments') || false}
								onCheckedChange={() => handleFocusToggle('keyMoments')}
							/>
						</div>
						<TextArea
							id="keyMoments"
							value={parameters.keyMoments}
							onChange={(e) =>
								handleParameterChange('keyMoments', e.target.value)
							}
							placeholder="What are some big events you want to happen next? A shocking reveal, character transformation, plot twist? Any escalations / mysteries you want to develop over multiple episodes? (suggest ?)"
							decoration="outline"
							autoGrow
							minHeight={100}
							maxHeight={200}
						/>
					</div>

					{/* Recurring Characters */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="recurringCharacters">RECURRING CHARACTERS</Label>
							<Switch
								checked={
									parameters.focus?.includes('recurringCharacters') || false
								}
								onCheckedChange={() => handleFocusToggle('recurringCharacters')}
							/>
						</div>
						<TextArea
							id="recurringCharacters"
							value={parameters.recurringCharacters}
							onChange={(e) =>
								handleParameterChange('recurringCharacters', e.target.value)
							}
							placeholder="Who should we focus on? What arcs do you want to establish? Any relationships that change? Any new character ideas? (suggest characters that can reappear)"
							decoration="outline"
							autoGrow
							minHeight={100}
							maxHeight={200}
						/>
					</div>

					{/* Themes / Motifs */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="themes">THEMES / MOTIFS</Label>
							<Switch
								checked={parameters.focus?.includes('themes') || false}
								onCheckedChange={() => handleFocusToggle('themes')}
							/>
						</div>
						<TextArea
							id="themes"
							value={parameters.themes}
							onChange={(e) => handleParameterChange('themes', e.target.value)}
							placeholder="What theme do you want to explore in your story expansion? (suggest trust / betrayal or self-discovery etc, based on what show is about)"
							decoration="outline"
							autoGrow
							minHeight={100}
							maxHeight={200}
						/>
					</div>

					{/* Experiments (Danger Zone) */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="experiments">EXPERIMENTS (Danger Zone)</Label>
							<Switch
								checked={parameters.focus?.includes('experiments') || false}
								onCheckedChange={() => handleFocusToggle('experiments')}
							/>
						</div>
						<TextArea
							id="experiments"
							value={parameters.experiments}
							onChange={(e) =>
								handleParameterChange('experiments', e.target.value)
							}
							placeholder="Do you want to wildly shift the genre of your story? Do you want to kill your main character? Do you want to big time jump?"
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
