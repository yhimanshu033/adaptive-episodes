import React from 'react'
import { Brain, Clock, FileText, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StatsCards() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Writers</CardTitle>
					<Users className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">17</div>
					<p className="text-muted-foreground text-xs">
						Active writers this month
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Avg. Scripts/Day
					</CardTitle>
					<FileText className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">3.1</div>
					<p className="text-muted-foreground text-xs">+2.1% from last month</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Hours</CardTitle>
					<Clock className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">142.5</div>
					<p className="text-muted-foreground text-xs">Hours this week</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">AI Usage</CardTitle>
					<Brain className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">24%</div>
					<p className="text-muted-foreground text-xs">
						Average AI content ratio
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
