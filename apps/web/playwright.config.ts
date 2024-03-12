import { devices } from '@playwright/test'

export default {
	projects: [
		{
			name: 'Desktop',
			use: { ...devices['Desktop 1920x1080'] },
			testDir: './tests',
		},
	],
}
