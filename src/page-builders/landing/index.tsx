'use client'

import React from 'react'

import AIFeaturesSection from './ai-features'
import CTA from './cta'
import EditorPreviewSection from './editor-preview'
import FAQ from './faq'
import Hero from './hero'
import HighlightSection from './highlights'
import LocalizationSection from './localization'
import SeriesShowcase from './series-showcase'
import ToolsSection from './tools'

const LandingPage = () => {
	return (
		<main className="bg-fm-surface-primary relative">
			<Hero />
			<div className="container not-sm:px-4">
				<HighlightSection />
				<EditorPreviewSection />
				<AIFeaturesSection />
			</div>
			<LocalizationSection />
			<ToolsSection />
			<SeriesShowcase />
			<FAQ />
			<CTA />
		</main>
	)
}

export default LandingPage
