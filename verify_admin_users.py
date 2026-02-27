
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        try:
            # 1. Login as Admin
            await page.goto("http://localhost:3000/login")
            await page.fill("input[type='email']", "admin@example.com")
            await page.fill("input[type='password']", "admin123")
            await page.click("button[type='submit']")

            # 2. Navigate to Users Page
            await page.wait_for_url("**/admin")
            await page.click("a[href='/admin/users']")
            await page.wait_for_url("**/admin/users")

            # 3. Verify Users Table
            await page.wait_for_selector("text=Users")
            await page.wait_for_selector("table")
            await page.wait_for_selector("text=Admin User") # Assuming admin user is listed

            await page.screenshot(path="verification/admin_users.png")
            print("Admin Users page verified.")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="verification/users_error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
