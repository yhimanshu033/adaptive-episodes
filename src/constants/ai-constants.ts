export const aiInitialMessage: {
	content: string
	role: 'assistant' | 'user'
}[] = [
	{
		role: 'assistant',
		content: 'Wie kann ich dir heute beim Überarbeiten helfen?',
	},
]
export enum AiDiffOperation {
	DELETE = 'delete',
	INSERT = 'insert',
	UPDATE = 'update',
}

export enum DiffStatus {
	ACCEPTED = 'accepted',
	PENDING = 'pending',
	REJECTED = 'rejected',
}
