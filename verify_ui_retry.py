
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        try:
            # 1. Start at Login (or Setup if first run)
            await page.goto("http://localhost:3000")
            await page.wait_for_load_state("networkidle")

            # Check if we are at Setup
            if "/setup" in page.url:
                print("At Setup page. Creating admin account...")
                await page.fill("input[name='name']", "Admin User")
                await page.fill("input[name='email']", "admin@example.com")
                await page.fill("input[name='password']", "admin123")
                await page.click("button[type='submit']")
                # Should go to next step of setup or dashboard
                await page.wait_for_load_state("networkidle")

                # Check for Workspace Setup
                if "companyName" in await page.content() or "Workspace Name" in await page.content(): # Adjust selector based on actual setup flow
                     # Assuming next step is workspace name
                     # Let's just try to fill generic inputs if found, or inspect the page
                     pass

            # If at Login
            elif "/login" in page.url:
                print("At Login page. Logging in...")
                await page.fill("input[type='email']", "admin@example.com")
                await page.fill("input[type='password']", "admin123")
                await page.click("button[type='submit']")
                await page.wait_for_url("**/workspace/**", timeout=10000)

            # 2. Inside Workspace
            print("Navigated to workspace.")
            await page.screenshot(path="verification/workspace_home.png")

            # 3. Create a Project if none exists (to test Project View)
            # Or just check if we can navigate to one.
            # Assuming the sidebar works, let's look for a project link or create button.

            # Since we don't know the exact ID, let's just verify the sidebar presence and look.
            await page.wait_for_selector("aside")

            # Create a project via API to be sure we have one to view?
            # Or simply verify the Main Table View is accessible if we mock the route?
            # It's easier to verify the sidebar structure first.

            sidebar = await page.query_selector("aside")
            if sidebar:
                print("Sidebar found.")

            # Take a screenshot of the dashboard
            await page.screenshot(path="verification/dashboard_verified.png")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="verification/error_retry.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
