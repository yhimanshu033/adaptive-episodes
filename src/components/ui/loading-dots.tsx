import React from 'react'

const LoadingDots = () => {
	return (
		<div className="flex h-screen items-center justify-center space-x-2">
			<span className="sr-only">Loading...</span>
			<div className="size-8 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]"></div>
			<div className="size-8 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]"></div>
			<div className="size-8 animate-bounce rounded-full bg-muted"></div>
		</div>
	)
}

export default LoadingDots
