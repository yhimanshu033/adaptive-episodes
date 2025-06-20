import React from 'react'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { motion } from 'framer-motion'

export const TwinkleStarsIcon = () => {
	// Generate random stars data
	const stars = React.useMemo(
		() =>
			Array.from({ length: 200 }, (_, i) => ({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				size: Math.random() * 1 + 0.5,
				animationDelay: Math.random() * 3,
				animationDuration: Math.random() * 2 + 1,
			})),
		[]
	)

	return (
		<AccessibleIcon label="Twinkle Stars Icon">
			<motion.svg
				className="absolute inset-0 h-full w-full opacity-50"
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.5 }}
				transition={{ duration: 1 }}
			>
				<defs>
					{/* Define sparkle animation keyframes */}
					<animateTransform
						id="sparkle"
						attributeName="transform"
						type="scale"
						values="0.8;1.2;0.8"
						dur="2s"
						repeatCount="indefinite"
					/>
				</defs>

				{/* Render all stars */}
				{stars.map((star) => (
					<motion.g
						key={star.id}
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 0.8, scale: 1 }}
						transition={{
							delay: star.id * 0.01,
							duration: 0.6,
							ease: 'easeOut',
						}}
					>
						<circle
							cx={`${star.x}%`}
							cy={`${star.y}%`}
							r={star.size}
							fill="white"
						>
							<animate
								attributeName="opacity"
								values="0.3;1;0.3"
								dur={`${star.animationDuration}s`}
								repeatCount="indefinite"
								begin={`${star.animationDelay}s`}
							/>
						</circle>

						{/* Add some larger twinkling stars */}
						{star.id % 10 === 0 && (
							<g transform={`translate(${star.x}%, ${star.y}%)`}>
								<path
									d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1 Z"
									fill="white"
									opacity="0.6"
								>
									<animate
										attributeName="opacity"
										values="0.2;0.8;0.2"
										dur={`${star.animationDuration * 1.5}s`}
										repeatCount="indefinite"
										begin={`${star.animationDelay}s`}
									/>
									<animateTransform
										attributeName="transform"
										type="rotate"
										values="0;360;0"
										dur={`${star.animationDuration * 2}s`}
										repeatCount="indefinite"
										begin={`${star.animationDelay}s`}
									/>
								</path>
							</g>
						)}
					</motion.g>
				))}

				{/* Add some shooting stars */}
				<motion.g
					initial={{ x: '-100%', opacity: 0 }}
					animate={{ x: '100%', opacity: [0, 1, 0] }}
					transition={{
						duration: 3,
						repeat: Infinity,
						repeatDelay: 2,
						ease: 'easeInOut',
					}}
				>
					<line
						x1="0"
						y1="20%"
						x2="50"
						y2="20%"
						stroke="white"
						strokeWidth="1"
						opacity="0.8"
					/>
				</motion.g>

				<motion.g
					initial={{ x: '-100%', opacity: 0 }}
					animate={{ x: '100%', opacity: [0, 1, 0] }}
					transition={{
						duration: 2.5,
						repeat: Infinity,
						repeatDelay: 3,
						ease: 'easeInOut',
					}}
				>
					<line
						x1="0"
						y1="60%"
						x2="40"
						y2="60%"
						stroke="white"
						strokeWidth="0.8"
						opacity="0.6"
					/>
				</motion.g>
			</motion.svg>
		</AccessibleIcon>
	)
}
