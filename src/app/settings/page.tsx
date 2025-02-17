import React from 'react'
import SettingsPage from '@/page-builders/settings'

import Footer from '@/components/footer'
import Header from '@/components/header'

export default function Page() {
	return (
		<>
			<Header />
			<SettingsPage />
			<Footer />
		</>
	)
}
