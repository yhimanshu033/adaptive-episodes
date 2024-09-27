import React from 'react'

import Footer from '@/components/footer'
import Header from '@/components/header'

import Features from './features'
import Hero from './hero'

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
