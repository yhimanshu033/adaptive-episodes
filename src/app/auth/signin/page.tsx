import React from 'react'
import SignInWithGoogle from '@/page-builders/auth/signin-with-google'

import Footer from '@/components/footer'
import Header from '@/components/header'

export default function Page() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="animate-fade-in-up flex flex-1 items-center justify-center">
				<SignInWithGoogle />
			</main>
			<Footer />
		</div>
	)
}
