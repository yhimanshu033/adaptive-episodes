import { withCn } from '@udecode/cn'

import { Toolbar } from '@/components/plate-ui/toolbar'

export const FixedToolbar = withCn(
	Toolbar,
	'supports-backdrop-blur:bg-fm-surface-primary/60 sticky left-0 top-0 z-50 w-full justify-between overflow-visible rounded-t-lg border bg-fm-surface-primary/95 backdrop-blur-sm border-fm-divider-tertiary'
)
