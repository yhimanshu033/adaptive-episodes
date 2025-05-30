import React from 'react'
import Image from 'next/image'
import {
	GLITTER_EFFECT_URL,
	STORYCHAT_1_URL,
	STORYCHAT_2_URL,
	STORYCHAT_3_URL,
	STORYCHAT_4_URL,
	STORYCHAT_5_URL,
} from '@/constants/landing-constants'

const AIFeaturesSection = () => {
	return (
		<section id="ai-features" className="relative">
			<h2 className="text-fm-4xl md:text-fm-7xl font-display mb-12 text-center">
				Go beyond writing. Create with StoryChat AI.
			</h2>

			<div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-12">
				<div className="rounded-fm-s relative h-[350px] overflow-hidden md:col-span-5">
					<div className="absolute top-0 z-10 p-5">
						<h3 className="text-fm-2xl">Content review</h3>
						<p className="text-fm-lg text-fm-secondary">
							Fix grammar, boost clarity, refine tone, and do more. Your <br />
							entire story and suggests sharper plot twists.
						</p>
					</div>
					<div className="absolute inset-0">
						<Image
							src={STORYCHAT_1_URL}
							alt="Content review"
							fill
							className="object-cover object-center"
							priority
						/>
					</div>
				</div>
				<div className="rounded-fm-s relative h-[350px] overflow-hidden md:col-span-7">
					<div className="absolute bottom-0 z-10 p-5">
						<h3 className="text-fm-2xl">Smart scene assist</h3>
						<p className="text-fm-lg text-fm-secondary">
							Need sharper scenes? Add punchy dialogues, expand or trim the
							story, <br /> or just type a prompt and Copilot will handle the
							rest.
						</p>
					</div>
					<div className="absolute inset-0">
						<Image
							src={STORYCHAT_2_URL}
							alt="Smart scene assist"
							fill
							className="object-cover object-center"
							priority
						/>
					</div>
				</div>
				<div className="rounded-fm-s relative h-[350px] overflow-hidden md:col-span-5">
					<div className="absolute bottom-0 z-10 p-5">
						<h3 className="text-fm-2xl">Logic check and cliffhanger boost</h3>
						<p className="text-fm-lg text-fm-secondary">
							Spot and fix plot holes, weak twists, and logic slips.
							<br /> Then hook readers and leave them wanting for more.
						</p>
					</div>
					<div className="absolute inset-0">
						<Image
							src={STORYCHAT_3_URL}
							alt="Logic check and cliffhanger boost"
							fill
							className="object-cover object-center"
							priority
						/>
					</div>
				</div>
				<div className="rounded-fm-s relative h-[350px] overflow-hidden md:col-span-3">
					<div className="absolute bottom-0 z-10 p-5">
						<h3 className="text-fm-2xl">SFX and music</h3>
						<p className="text-fm-lg text-fm-secondary">
							You write a scene. It adds sound descriptions that set the mood.
						</p>
					</div>
					<div className="absolute inset-0">
						<Image
							src={STORYCHAT_4_URL}
							alt="SFX and music"
							fill
							className="object-cover object-center"
							priority
						/>
					</div>
				</div>
				<div className="rounded-fm-s relative h-[350px] overflow-hidden md:col-span-4">
					<div className="absolute bottom-0 z-10 p-5">
						<h3 className="text-fm-2xl">
							Story and character <br /> enhancement
						</h3>
						<p className="text-fm-lg text-fm-secondary">
							Dial up the drama and add depth to <br /> your characters.
						</p>
					</div>
					<div className="absolute inset-0">
						<Image
							src={STORYCHAT_5_URL}
							alt="Story and character enhancement"
							fill
							className="object-cover object-center"
							priority
						/>
					</div>
				</div>
			</div>

			<div className="absolute left-1/2 size-96 -translate-x-1/2">
				<Image
					src={GLITTER_EFFECT_URL}
					alt="effect"
					fill
					className="object-contain"
				/>
			</div>
		</section>
	)
}

export default AIFeaturesSection
