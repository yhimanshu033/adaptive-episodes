'use client'

import React from 'react'
import Link from 'next/link'
import useAuth from '@/hooks/use-auth'
import { GoogleIcon } from '@/icons/google-icon'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

import { Button } from '@/components/aural-ui/button'
import { FullScreenLoader } from '@/components/loader'

import { TwinkleStarsIcon } from './twinkle-stars'

const SignInWithGoogle = () => {
	const { onSignInWithGoogle } = useAuth()
	const [loading, setIsLoading] = React.useState(false)

	function handleSignIn() {
		setIsLoading(true)
		try {
			onSignInWithGoogle()
		} catch (error) {
			console.error(error)
		}
	}

	if (loading) {
		return <FullScreenLoader />
	}

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.4,
				staggerChildren: 0.1,
			},
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.4,
				ease: 'easeOut',
			},
		},
	}

	const buttonVariants = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.3,
				ease: 'easeOut',
			},
		},
		hover: {
			scale: 1.05,
			transition: {
				duration: 0.2,
				ease: 'easeInOut',
			},
		},
		tap: {
			scale: 0.98,
		},
	}

	return (
		<motion.div
			className="font-fm-text relative flex min-h-screen flex-col overflow-hidden bg-black"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<TwinkleStarsIcon />

			{/* Home button */}
			<motion.div
				className="absolute top-6 left-6 z-20"
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.2, duration: 0.3 }}
			>
				<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
					<Link
						className="bg-fm-surface-frosted/40 hove:bg-fm-surface-frosted/50 leading-fm-md flex items-center gap-2 rounded-full p-3 [font-size:var(--text-fm-md)] text-white backdrop-blur-xs transition-all duration-200 md:px-4 md:py-2"
						href="/"
						aria-label="Home"
						title="Home"
					>
						<Home size={14} className="md:-translate-y-[1px]" />{' '}
						<span className="hidden md:block">Home</span>
					</Link>
				</motion.div>
			</motion.div>

			{/* Main content */}
			<div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
				<motion.div
					className="mx-auto max-w-4xl space-y-8"
					variants={containerVariants}
				>
					<motion.h1
						className="text-fm-5xl md:text-fm-8xl leading-tight font-bold text-white"
						variants={itemVariants}
					>
						<motion.span
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1, duration: 0.4 }}
						>
							Let&apos;s get started!
						</motion.span>
						<br />
						<motion.span
							className="text-white/90"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.4 }}
						>
							Try Copilot for free.
						</motion.span>
					</motion.h1>

					<motion.div className="flex justify-center" variants={itemVariants}>
						<motion.div
							variants={buttonVariants}
							whileHover="hover"
							whileTap="tap"
							className="w-full md:w-auto"
						>
							<Button
								variant="outline"
								size="md"
								className="w-full"
								leftIcon={<GoogleIcon />}
								onClick={handleSignIn}
								aria-label="Sign in with Google"
								title="Sign in with Google"
							>
								Sign in with Google
							</Button>
						</motion.div>
					</motion.div>

					{/* Terms and Privacy */}
					<motion.div
						className="text-fm-secondary md:text-fm-tertiary font-fm-brand absolute bottom-9 left-1/2 w-full -translate-x-1/2 space-y-1 [font-size:var(--text-fm-sm)] leading-normal tracking-wider md:static md:translate-x-0 md:[font-size:var(--text-fm-md)]"
						variants={itemVariants}
					>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4, duration: 0.3 }}
						>
							BY PROCEEDING, YOU AGREE TO OUR{' '}
							<motion.a
								href="#"
								className="text-white underline hover:text-white/90"
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2 }}
							>
								TERMS OF USE
							</motion.a>
						</motion.p>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.3 }}
						>
							AND{' '}
							<motion.a
								href="#"
								className="text-white underline hover:text-white/90"
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2 }}
							>
								PRIVACY POLICY
							</motion.a>
						</motion.p>
					</motion.div>
				</motion.div>
			</div>

			{/* Bottom gradient overlay - matching reference image */}
			<motion.div
				className="pointer-events-none absolute right-0 bottom-0 left-0 h-2/3"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3, duration: 0.8 }}
				style={{
					background: `
            radial-gradient(ellipse at center bottom, 
                rgba(120, 120, 120, 0.8) 0%,
                rgba(90, 90, 90, 0.6) 15%,
                rgba(70, 70, 70, 0.5) 30%,
                rgba(50, 50, 50, 0.4) 50%,
                rgba(30, 30, 30, 0.3) 70%,
                rgba(20, 20, 20, 0.2) 85%,
                transparent 100%
            )
        `,
				}}
			/>
		</motion.div>
	)
}

export default SignInWithGoogle
