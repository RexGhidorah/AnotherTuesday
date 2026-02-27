
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

            # 2. Verify Admin Dashboard
            await page.wait_for_url("**/admin")
            print("Redirected to Admin Dashboard.")

            # Verify Sidebar
            await page.wait_for_selector("aside")
            print("Admin Sidebar found.")

            # Verify Dashboard Content
            await page.wait_for_selector("text=Create New Workspace")
            await page.wait_for_selector("text=Active Workspaces")

            await page.screenshot(path="verification/admin_dashboard.png")
            print("Admin Dashboard verified.")

            # 3. Verify Settings Page
            await page.click("a[href='/admin/settings']")
            await page.wait_for_url("**/admin/settings")

            await page.wait_for_selector("text=SMTP Configuration")
            await page.wait_for_selector("text=Quick Presets")

            await page.screenshot(path="verification/admin_settings.png")
            print("Admin Settings verified.")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="verification/admin_error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
