export interface LaserToolsParams {
	action: string
	context?: string
	nexttext?: string
	prevtext?: string
	text: string
}

export interface LaserToolsApiResponse {
	data: {
		action: string
		nexttext: string
		prevtext: string
		result: string
		text: string
	}
	message: string
}
