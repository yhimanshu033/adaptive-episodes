import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Home = () => {
	return (
		<main className="flex min-h-screen flex-col bg-black text-white">
			{/* Header */}
			<header className="flex items-center justify-between px-6 py-4">
				<div className="flex items-center gap-2">
					<Image
						src="/assets/pocket-copilot-logo.webp"
						alt="Copilot by PocketFM"
						width={32}
						height={32}
					/>
					<span className="text-lg font-bold tracking-wide">COPILOT</span>
					<span className="ml-1 text-xs text-gray-400">by PocketFM</span>
				</div>
				<nav className="hidden gap-8 text-sm text-gray-300 md:flex">
					<Link href="#" className="hover:text-white">
						AI Features
					</Link>
					<Link href="#" className="hover:text-white">
						Enterprise
					</Link>
					<Link href="#" className="hover:text-white">
						Contact
					</Link>
					<Link href="#" className="hover:text-white">
						Documentation
					</Link>
				</nav>
				<button className="ml-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black">
					Try for free
				</button>
			</header>

			{/* Hero Section */}
			<section className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a23] via-[#1a1a2e] to-[#2d1e3a] py-20 text-center">
				<h1 className="mb-4 text-3xl font-bold md:text-5xl">
					Write smart. Write fast.
					<br />
					Go global.
				</h1>
				<p className="mx-auto mb-6 max-w-xl text-lg text-gray-300 md:text-xl">
					Add your story to 10+ languages, collaborate with other writers, and
					go global with AI-powered Copilot.
				</p>
				<button className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-black shadow-lg transition hover:bg-gray-200">
					Try it for free
				</button>
				<div className="pointer-events-none absolute top-0 right-0 hidden w-1/2 max-w-xl select-none md:block">
					<Image
						src="/assets/map_plot.webp"
						alt="Global writing"
						width={600}
						height={400}
						className="opacity-60"
					/>
				</div>
				<div className="pointer-events-none absolute bottom-0 left-0 hidden w-1/3 max-w-xs select-none md:block">
					<Image
						src="/assets/copilot-logo.gif"
						alt="Copilot pen"
						width={300}
						height={300}
						className="opacity-80"
					/>
				</div>
			</section>

			{/* Features Section */}
			<section className="bg-surface-primary">
				<h2 className="mb-10 text-center text-2xl font-semibold md:text-3xl">
					Tell stories. Like nobody else.
				</h2>
				<div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 md:flex-row">
					<div className="flex w-full flex-col items-center rounded-xl bg-[#181828] p-6 md:w-1/3">
						<Image
							src="/assets/placeholder-user.webp"
							alt="Write smart"
							width={220}
							height={140}
							className="mb-4 rounded-lg"
						/>
						<h3 className="mb-2 text-lg font-bold">[Write smart]</h3>
						<p className="text-center text-sm text-gray-400">
							Copilot ensures a consistent environment across chapters for a
							strong author voice.
						</p>
					</div>
					<div className="flex w-full flex-col items-center rounded-xl bg-[#181828] p-6 md:w-1/3">
						<Image
							src="/assets/placeholder-user.webp"
							alt="Write fast"
							width={220}
							height={140}
							className="mb-4 rounded-lg"
						/>
						<h3 className="mb-2 text-lg font-bold">[Write fast]</h3>
						<p className="text-center text-sm text-gray-400">
							From ideation to written words in hours. Copilot will remove all
							friction from idea to final draft.
						</p>
					</div>
					<div className="flex w-full flex-col items-center rounded-xl bg-[#181828] p-6 md:w-1/3">
						<Image
							src="/assets/placeholder-user.webp"
							alt="Go global"
							width={220}
							height={140}
							className="mb-4 rounded-lg"
						/>
						<h3 className="mb-2 text-lg font-bold">[Go global]</h3>
						<p className="text-center text-sm text-gray-400">
							Reach new readers in 10+ languages. Stories can become Strangers
							Friends.
						</p>
					</div>
				</div>
			</section>

			{/* Editor Preview Section */}
			<section className="bg-[#10101a] py-16">
				<h2 className="mb-10 text-center text-2xl font-semibold md:text-3xl">
					Write it right. Edit it tight.
				</h2>
				<div className="flex justify-center">
					<Image
						src="/assets/placeholder-user.webp"
						alt="Editor preview"
						width={800}
						height={320}
						className="w-full max-w-4xl rounded-xl shadow-lg"
					/>
				</div>
			</section>

			{/* StoryChat AI Section */}
			<section className="bg-black py-16">
				<h2 className="mb-10 text-center text-2xl font-semibold md:text-3xl">
					Go beyond writing. Create with StoryChat AI.
				</h2>
				<div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
					<div className="flex flex-col gap-4 rounded-xl bg-[#181828] p-6">
						<h3 className="mb-2 text-lg font-bold">Content review</h3>
						<p className="text-sm text-gray-400">
							Engagement checks, plot holes, and so much more. Your entire story
							and subplots get super-fast edits.
						</p>
						<button className="w-max rounded bg-[#7c3aed] px-4 py-2 text-xs font-semibold text-white">
							Review done
						</button>
						<div className="mt-2">
							<input
								type="text"
								placeholder="Log: AI checks, suggestions, feedback, and more..."
								className="w-full rounded bg-[#23233a] px-3 py-2 text-xs text-gray-300"
								disabled
							/>
						</div>
					</div>
					<div className="flex flex-col gap-4 rounded-xl bg-[#181828] p-6">
						<h3 className="mb-2 text-lg font-bold">Smart scene assist</h3>
						<p className="text-sm text-gray-400">
							Never fumble scenes! AI directly dialogues, recaps for the story,
							just type a prompt and Copilot will handle the rest.
						</p>
						<button className="w-max rounded bg-[#7c3aed] px-4 py-2 text-xs font-semibold text-white">
							[SHOW A SCENE CHANGE]
						</button>
					</div>
					<div className="flex flex-col gap-4 rounded-xl bg-[#181828] p-6">
						<h3 className="mb-2 text-lg font-bold">
							Logic check and cliffhanger boost
						</h3>
						<p className="text-sm text-gray-400">
							Spot all plot holes, add twists and more. The tool hooks readers
							and leaves them wanting more.
						</p>
					</div>
					<div className="flex flex-col gap-4 rounded-xl bg-[#181828] p-6">
						<h3 className="mb-2 text-lg font-bold">SFX and music</h3>
						<p className="text-sm text-gray-400">
							It works. You can add sound decorations that match the mood.
						</p>
						<h3 className="mt-4 text-lg font-bold">
							Story and character enhancement
						</h3>
						<p className="text-sm text-gray-400">
							AI will enhance your story, fix inconsistencies, and add depth to
							all characters.
						</p>
					</div>
				</div>
			</section>

			{/* Translation/Adaptation Section */}
			<section className="bg-[#10101a] py-16">
				<h2 className="mb-10 text-center text-2xl font-semibold md:text-3xl">
					Don&apos;t just translate. Adapt.
				</h2>
				<p className="mx-auto mb-8 max-w-2xl text-center text-gray-400">
					Copilot brings true local flavour to your story. Names, foods, places,
					even expressions — everything adapts to fit the culture, naturally.
				</p>
				<div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 md:flex-row">
					<div className="flex w-full flex-col items-center rounded-xl bg-[#181828] p-6 md:w-1/2">
						<Image
							src="/assets/placeholder-user.webp"
							alt="Adaptation example 1"
							width={320}
							height={180}
							className="mb-4 rounded-lg"
						/>
						<p className="mt-2 text-sm text-gray-300">
							Peter eats a cheese burger in a New York diner
						</p>
					</div>
					<div className="flex w-full flex-col items-center rounded-xl bg-[#181828] p-6 md:w-1/2">
						<Image
							src="/assets/placeholder-user.webp"
							alt="Adaptation example 2"
							width={320}
							height={180}
							className="mb-4 rounded-lg"
						/>
						<p className="mt-2 text-sm text-gray-300">
							“André enjoys a panini at a café in Paris”
						</p>
					</div>
				</div>
			</section>

			{/* Tools Section */}
			<section className="bg-black py-16">
				<h2 className="mb-10 text-center text-2xl font-semibold md:text-3xl">
					Create faster, better.
					<br />
					With essential tools.
				</h2>
				<div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 md:flex-row">
					<div className="flex w-full flex-col gap-2 rounded-xl bg-[#181828] p-6 md:w-1/2">
						<h3 className="mb-2 text-lg font-bold">Collaboration</h3>
						<p className="text-sm text-gray-400">
							Invite your team, editors and friends and create stories together
							in real time.
						</p>
					</div>
					<div className="flex w-full flex-col gap-2 rounded-xl bg-[#181828] p-6 md:w-1/2">
						<h3 className="mb-2 text-lg font-bold">Story explorer</h3>
						<p className="text-sm text-gray-400">Create modes</p>
					</div>
				</div>
			</section>

			{/* Series Section */}
			<section className="bg-[#10101a] py-16">
				<h2 className="mb-10 text-center text-2xl font-semibold md:text-3xl">
					Series created with Copilot.
					<br />
					Call it a hit-machine.
				</h2>
				<div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
					<div className="flex flex-col items-center">
						<Image
							src="/assets/placeholder-user.webp"
							alt="Aaj Ka Hero"
							width={140}
							height={140}
							className="mb-2 rounded-lg"
						/>
						<span className="text-sm font-semibold">Aaj Ka Hero</span>
						<span className="text-xs text-gray-400">10M PLAYS</span>
					</div>
					<div className="flex flex-col items-center">
						<Image
							src="/assets/placeholder-user.webp"
							alt="Banda Ye Badass Hai"
							width={140}
							height={140}
							className="mb-2 rounded-lg"
						/>
						<span className="text-sm font-semibold">Banda Ye Badass Hai</span>
						<span className="text-xs text-gray-400">12M PLAYS</span>
					</div>
					<div className="flex flex-col items-center">
						<Image
							src="/assets/placeholder-user.webp"
							alt="Super Yoddha"
							width={140}
							height={140}
							className="mb-2 rounded-lg"
						/>
						<span className="text-sm font-semibold">Super Yoddha</span>
						<span className="text-xs text-gray-400">22M PLAYS</span>
					</div>
					<div className="flex flex-col items-center">
						<Image
							src="/assets/placeholder-user.webp"
							alt="Aaj Ka Hero"
							width={140}
							height={140}
							className="mb-2 rounded-lg"
						/>
						<span className="text-sm font-semibold">Aaj Ka Hero</span>
						<span className="text-xs text-gray-400">18M PLAYS</span>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="bg-black py-16">
				<h2 className="mb-10 text-center text-2xl font-semibold md:text-3xl">
					Frequently asked questions
				</h2>
				<div className="mx-auto max-w-2xl">
					<details className="mb-4 rounded-lg bg-[#181828] p-4">
						<summary className="cursor-pointer font-semibold">
							Who all can access Copilot?
						</summary>
						<p className="mt-2 text-sm text-gray-400">
							Anyone who possesses a Pocket FM email address is granted access
							to the Copilot feature.
						</p>
					</details>
					<details className="mb-4 rounded-lg bg-[#181828] p-4">
						<summary className="cursor-pointer font-semibold">
							What are all the plan for Copilot?
						</summary>
						<p className="mt-2 text-sm text-gray-400">
							We offer both free and paid plans. Please contact us for more
							details.
						</p>
					</details>
					<details className="mb-4 rounded-lg bg-[#181828] p-4">
						<summary className="cursor-pointer font-semibold">
							How many stories I can create on Copilot?
						</summary>
						<p className="mt-2 text-sm text-gray-400">
							There is no limit to the number of stories you can create.
						</p>
					</details>
					<details className="mb-4 rounded-lg bg-[#181828] p-4">
						<summary className="cursor-pointer font-semibold">
							Are all features available in the free plan?
						</summary>
						<p className="mt-2 text-sm text-gray-400">
							All core features are available in the free plan. Some advanced
							features may require a paid plan.
						</p>
					</details>
				</div>
			</section>

			{/* Footer */}
			<footer className="mt-auto bg-gradient-to-r from-[#181828] to-[#2d1e3a] px-4 py-10">
				<div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 md:flex-row">
					<div className="flex flex-col gap-2">
						<span className="text-lg font-semibold">
							Ready to write fast, smart, and reach a global audience?
						</span>
						<button className="mt-2 w-max rounded-lg bg-white px-6 py-3 text-base font-semibold text-black shadow-lg">
							Get started
						</button>
					</div>
					<span className="text-xs text-gray-400">
						© 2024 PocketFM Copilot. All rights reserved.
					</span>
				</div>
			</footer>
		</main>
	)
}

export default Home
