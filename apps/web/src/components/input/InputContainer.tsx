import { ReactNode } from 'react'

export function InputContainer({ children }: { children: ReactNode }) {
	return (
		<div className="grid w-full max-w-sm items-center gap-2">{children}</div>
	)
}
