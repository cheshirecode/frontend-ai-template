import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the chat interface', async ({ page }) => {
    // Check for the main chat container
    await expect(page.locator('h1')).toContainText('AI Chat')
  })

  test('should show quick start suggestions when chat is empty', async ({ page }) => {
    // Check for quick start options
    await expect(page.getByText('Start a conversation')).toBeVisible()
  })

  test('should have a message input field', async ({ page }) => {
    const input = page.getByPlaceholder('Type a message...')
    await expect(input).toBeVisible()
    await expect(input).toBeEnabled()
  })

  test('should have a send button', async ({ page }) => {
    const sendButton = page.getByRole('button', { name: /send/i })
    await expect(sendButton).toBeVisible()
  })

  test('should disable send button when input is empty', async ({ page }) => {
    const sendButton = page.getByRole('button', { name: /send/i })
    await expect(sendButton).toBeDisabled()
  })

  test('should enable send button when input has text', async ({ page }) => {
    const input = page.getByPlaceholder('Type a message...')
    await input.fill('Hello')

    const sendButton = page.getByRole('button', { name: /send/i })
    await expect(sendButton).toBeEnabled()
  })

  test('should have AI mode selector', async ({ page }) => {
    const modeSelector = page.getByRole('combobox')
    await expect(modeSelector).toBeVisible()
  })

  test('should allow changing AI mode', async ({ page }) => {
    const modeSelector = page.getByRole('combobox')
    await modeSelector.selectOption('manual')

    await expect(modeSelector).toHaveValue('manual')
  })
})

test.describe('Chat Functionality', () => {
  test('should send a message and show it in the list', async ({ page }) => {
    await page.goto('/')

    const input = page.getByPlaceholder('Type a message...')
    await input.fill('Hello AI')
    await input.press('Enter')

    // User message should appear
    await expect(page.getByText('Hello AI')).toBeVisible()
  })

  test('should clear chat when clear button is clicked', async ({ page }) => {
    await page.goto('/')

    // Send a message first
    const input = page.getByPlaceholder('Type a message...')
    await input.fill('Test message')
    await input.press('Enter')

    // Wait for message to appear
    await expect(page.getByText('Test message')).toBeVisible()

    // Click clear button
    await page.getByRole('button', { name: /clear/i }).click()

    // Message should be gone, quick start should be visible
    await expect(page.getByText('Start a conversation')).toBeVisible()
  })
})
