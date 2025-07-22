import React from 'react'
import Features from '@/page-builders/home/features'
import Hero from '@/page-builders/home/hero'

import Footer from '@/components/footer'
import Header from '@/components/header'

const Home = () => {
	return (
		<>
			<div className="flex min-h-screen flex-col">
				<Header />
				<Hero />
			</div>
			<div className="flex min-h-screen flex-col">
				<Features />
				<Footer />
			</div>
		</>
	)
}

export default Home
