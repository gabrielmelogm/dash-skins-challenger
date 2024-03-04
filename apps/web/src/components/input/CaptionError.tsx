import { ReactNode } from 'react'

export function CaptionError({ children }: { children: ReactNode }) {
	return (
		<span className="text-xs text-black dark:text-red-400">{children}</span>
	)
}
