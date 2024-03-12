import { fakerPT_BR as faker } from '@faker-js/faker'
import { expect, test } from 'playwright/test'

test('Should be create a new user', async ({ page }) => {
	await page.goto('http://localhost:5173/login')

	await page.getByLabel('Email').fill('email@test.com')

	await page.getByLabel('Senha').fill('Senha123@')

	await page.getByRole('button', { name: 'Logar' }).click()

	await page.waitForLoadState('networkidle')

	const mainTitle = page.getByText('Usuários')

	expect(mainTitle).toBeVisible()

	await page.getByRole('button', { name: 'Adicionar' }).click()

	const modal = await page.locator('id=createModal')

	expect(modal).toBeVisible()

	await page.getByLabel('Nome').fill(faker.person.firstName())
	await page
		.getByLabel('Idade')
		.fill(String(faker.number.int({ min: 18, max: 90 })))
	await page.getByLabel('Email').fill(faker.internet.email())
	await page.getByLabel('Password').fill('Senha@123')
	await page.getByLabel('Avatar').fill(faker.image.urlLoremFlickr())

	await page.getByRole('button', { name: 'Adicionar' }).click()

	await page.waitForResponse((response) => response.status() === 201)

	await new Promise((resolve) => setTimeout(() => resolve(true), 2000))

	expect(modal).toBeHidden()

	const toast = await page.getByText('Usuário criado com sucesso!')

	expect(toast).toBeVisible()
})
