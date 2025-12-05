import React from 'react'
import { AlertIcon } from '@/icons/alert-icon'
import { CircleTickIcon } from '@/icons/circle-tick-icon'
import { CrossCircleIcon } from '@/icons/cross-circle-icon'
import { LightBulbSimpleIcon } from '@/icons/light-bulb-simple-icon'
import { VariantProps } from 'class-variance-authority'

import { bannerVariants } from '@/components/aural-ui/banner'

import { EBSEStatus } from '@/types/admin-types'

export const LARGE_TEXT_THRESHOLD = 100

export const BSE_STATUS_MAP: Record<
	EBSEStatus | 'default',
	{
		Icon: React.ReactNode
		bannerVariant: Exclude<VariantProps<typeof bannerVariants>['variant'], null>
		className: string
	}
> = {
	[EBSEStatus.SUCCESS]: {
		bannerVariant: 'positive',
		className: '!text-fm-positive-sec',
		Icon: <CircleTickIcon className="size-5" />,
	},
	[EBSEStatus.ERROR]: {
		bannerVariant: 'negative',
		className: '!text-fm-negative-sec',
		Icon: <CrossCircleIcon className="size-5" />,
	},
	[EBSEStatus.RUNNING]: {
		bannerVariant: 'info',
		className: '!text-fm-info-sec',
		Icon: <LightBulbSimpleIcon className="size-5" />,
	},
	default: {
		bannerVariant: 'warning',
		className: '!text-fm-warning-sec',
		Icon: <AlertIcon className="size-5" />,
	},
}
