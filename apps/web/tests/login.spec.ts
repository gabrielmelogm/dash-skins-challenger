import { expect, test } from '@playwright/test'

test('Should be title', async ({ page }) => {
	await page.goto('http://localhost:5173/login')

	const title = await page.title()
	expect(title).toContain('Dashskins')
})

test('Should be possible to log in', async ({ page }) => {
	await page.goto('http://localhost:5173/login')

	await page.getByLabel('Email').fill('email@test.com')

	await page.getByLabel('Senha').fill('Senha123@')

	await page.getByRole('button', { name: 'Logar' }).click()

	await page.waitForLoadState('networkidle')

	const mainTitle = await page.getByText('Usuários')

	expect(mainTitle).toBeVisible()
})

test('Should return an error message spam because of incorrect password format', async ({
	page,
}) => {
	await page.goto('http://localhost:5173/login')

	await page.getByLabel('Email').fill('email@test.com')

	await page.getByLabel('Senha').fill('wrong_password')

	await page.getByRole('button', { name: 'Logar' }).click()

	const passwordError = await page.getByText(
		'O campo deve conter 8 caracteres incluindo letras e números, 1 letra maiúscula, 1 caractere especial',
	)

	expect(passwordError).toBeVisible()
})

test('Should be show a toast error if incorrect user credentials', async ({
	page,
}) => {
	await page.goto('http://localhost:5173/login')

	await page.getByLabel('Email').fill('email@test.com')

	await page.getByLabel('Senha').fill('Wrong@password123')

	await page.getByRole('button', { name: 'Logar' }).click()

	await page.waitForResponse((response) => response.status() === 401)

	const toast = await page.getByText('Email e/ou senha incorreto')

	expect(toast).toBeVisible()
})
