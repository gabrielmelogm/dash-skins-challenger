import { fakerPT_BR as faker } from '@faker-js/faker'
import { expect, test } from 'playwright/test'

test('Should be edit a user', async ({ page }) => {
	const user = {
		name: faker.person.firstName(),
		age: faker.number.int({ min: 18, max: 90 }),
		email: faker.internet.email(),
		password: 'Senha@123',
		avatar: faker.image.urlLoremFlickr(),
	}

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

	await page.getByLabel('Nome').fill(user.name)
	await page.getByLabel('Idade').fill(String(user.age))
	await page.getByLabel('Email').fill(user.email)
	await page.getByLabel('Password').fill(user.password)
	await page.getByLabel('Avatar').fill(user.avatar)

	await page.getByRole('button', { name: 'Adicionar' }).click()

	await page.waitForResponse((response) => response.status() === 201)

	await new Promise((resolve) => setTimeout(() => resolve(true), 2000))

	expect(modal).toBeHidden()

	const toast = await page.getByText('Usuário criado com sucesso!')

	expect(toast).toBeVisible()

	const row = await page.locator(`data-test-id=${user.email}`)

	expect(row).toBeVisible()

	const trigger = await page.locator(`data-test-id=actionTrigger-${user.email}`)

	trigger.click()

	await page
		.locator(`data-test-id=editTrigger-${user.email}`, {
			hasText: 'Editar',
		})
		.click()

	const editModal = await page.locator('id=editModal')

	expect(editModal).toBeVisible()

	const titleEditModal = await page.getByText('Editar usuário')

	expect(titleEditModal).toBeVisible()

	await page.getByLabel('Nome').fill(faker.person.firstName())
	await page
		.getByLabel('Idade')
		.fill(String(faker.number.int({ min: 10, max: 50 })))
	await page.getByLabel('Email').fill(faker.internet.email())
	await page.getByLabel('Avatar').fill(faker.image.urlLoremFlickr())

	await page.getByRole('button', { name: 'Atualizar' }).click()

	await page.waitForResponse((response) => response.status() === 200)

	await new Promise((resolve) => setTimeout(() => resolve(true), 2000))

	expect(editModal).toBeHidden()

	const toastEditModal = await page.getByText('Usuário atualizado com sucesso!')

	expect(toastEditModal).toBeVisible()
})
