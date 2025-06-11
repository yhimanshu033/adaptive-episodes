'use client'

import React from 'react'
import {
	MOCK_FREQUENT_PROMPTS,
	MOCK_RATIO_STORY,
	MOCK_SUCCESSFUL_PROMPTS,
} from '@/mock-data/admin'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { trim } from '@/lib/utils/helpers'

export function PromptAnalytics() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Prompt Analytics</CardTitle>
				<CardDescription>
					View most frequent prompts and their success rates
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="frequent">
					<TabsList>
						<TabsTrigger value="frequent">Most Frequent</TabsTrigger>
						<TabsTrigger value="success">Success Rate</TabsTrigger>
						<TabsTrigger value="ai-ratio">AI Ratio</TabsTrigger>
					</TabsList>
					<TabsContent value="frequent" className="space-y-4">
						<div className="grid gap-4">
							{MOCK_FREQUENT_PROMPTS.map((prompt, i) => (
								<div key={i} className="flex items-center justify-between">
									<span className="text-sm font-medium">{trim(prompt)}</span>
									<span className="text-muted-foreground text-sm">
										{100 - i * 20}x used
									</span>
								</div>
							))}
						</div>
					</TabsContent>
					<TabsContent value="success" className="space-y-4">
						<div className="grid gap-4">
							{MOCK_SUCCESSFUL_PROMPTS.map((prompt, i) => (
								<div key={i} className="flex items-center justify-between">
									<span className="text-sm font-medium">{trim(prompt)}</span>
									<span className="text-muted-foreground text-sm">
										{90 - i * 5}% success
									</span>
								</div>
							))}
						</div>
					</TabsContent>
					<TabsContent value="ai-ratio" className="space-y-4">
						<div className="grid gap-4">
							{MOCK_RATIO_STORY.map((type, i) => (
								<div key={i} className="flex items-center justify-between">
									<span className="text-sm font-medium">{trim(type)}</span>
									<span className="text-muted-foreground text-sm">
										{30 - i * 5}% AI content
									</span>
								</div>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
