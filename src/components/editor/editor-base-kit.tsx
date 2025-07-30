import { BaseAlignKit } from './plugins/align-base-kit'
import { BaseBasicBlocksKit } from './plugins/basic-blocks-base-kit'
import { BaseBasicMarksKit } from './plugins/basic-marks-base-kit'
import { BaseFontKit } from './plugins/font-base-kit'
import { BaseLineHeightKit } from './plugins/line-height-base-kit'
import { BaseListKit } from './plugins/list-base-kit'

// COMMENTING UNNECESSARY KITS FOR OPTIMIZATION
export const BaseEditorKit = [
	...BaseBasicBlocksKit,
	// ...BaseCodeBlockKit,
	// ...BaseTableKit,
	// ...BaseToggleKit,
	// ...BaseTocKit,
	// ...BaseMediaKit,
	// ...BaseCalloutKit,
	// ...BaseColumnKit,
	// ...BaseMathKit,
	// ...BaseDateKit,
	// ...BaseLinkKit,
	// ...BaseMentionKit,
	...BaseBasicMarksKit,
	...BaseFontKit,
	...BaseListKit,
	...BaseAlignKit,
	...BaseLineHeightKit,
	// ...BaseCommentKit,
	// ...BaseSuggestionKit,
	// ...MarkdownKit,
]
