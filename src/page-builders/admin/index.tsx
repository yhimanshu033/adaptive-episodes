import React from 'react'
import Link from 'next/link'
import { COPILOT_LOGO_URL } from '@/constants/global-constants'
import { ArrowLeft } from 'lucide-react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/plate-ui/avatar'
import { Card } from '@/components/ui/card'

export default function AdminPanel() {
	return (
		<div className="container mx-auto space-y-6 p-6">
			<header className="space-y-4">
				<div className="flex items-center gap-6">
					<Avatar>
						<AvatarImage src={COPILOT_LOGO_URL} alt="AI" />
						<AvatarFallback>AI</AvatarFallback>
					</Avatar>
					<h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
				</div>
				<Link
					href="/projects"
					className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors"
				>
					<ArrowLeft className="mr-2 size-4" />
					Go back to Stories
				</Link>
			</header>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Link href="/admin/dashboard">
					<Card className="hover:bg-muted/50 cursor-pointer p-6 transition-colors">
						<h2 className="text-xl font-medium">Dashboard</h2>
					</Card>
				</Link>

				<Link href="/admin/internationalization">
					<Card className="hover:bg-muted/50 cursor-pointer p-6 transition-colors">
						<h2 className="text-xl font-medium">Internationalization</h2>
					</Card>
				</Link>

				<Link href="/admin/llm-writers">
					<Card className="hover:bg-muted/50 cursor-pointer p-6 transition-colors">
						<h2 className="text-xl font-medium">LLM Writers</h2>
					</Card>
				</Link>
			</div>
		</div>
	)
}
