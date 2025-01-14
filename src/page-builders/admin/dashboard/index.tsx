import React from 'react'
import { MOCK_WRITERS } from '@/mock-data/admin'
import { PromptAnalytics } from '@/page-builders/admin/dashboard/prompt-analytics'
import { StatsCards } from '@/page-builders/admin/dashboard/stats-card'
import { WriterThroughputTable } from '@/page-builders/admin/dashboard/writer-throughput-table'

import BackButton from '@/components/back-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminDashboard() {
	return (
		<div className="container mx-auto flex-1 space-y-4 p-4 pt-6 md:p-8">
			<div className="flex items-center gap-6">
				<BackButton />
				<h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
			</div>
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-4">
					<StatsCards />
					<WriterThroughputTable writers={MOCK_WRITERS} />
				</TabsContent>
				<TabsContent value="analytics" className="space-y-4">
					<StatsCards />
					<PromptAnalytics />
				</TabsContent>
			</Tabs>
		</div>
	)
}
