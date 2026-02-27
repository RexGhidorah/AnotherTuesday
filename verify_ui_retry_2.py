
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
                # The form doesn't use name='name' directly on the input if it's managed by state?
                # The previous error was timeout on submit button?
                # The code shows <button onClick={() => setStep(2)}>Next</button> which is type="button" not "submit"

                await page.fill("input[placeholder='Full Name']", "Admin User")
                await page.fill("input[type='email']", "admin@example.com")
                await page.fill("input[type='password']", "admin123")

                # Click "Next" button (it's type="button", text="Next")
                await page.click("button:has-text('Next')")

                # Now at Step 2 (SMTP)
                # Click "Complete Setup" (type="submit")
                await page.click("button:has-text('Complete Setup')")

                # Should redirect to login?
                await page.wait_for_url("**/login**")
                print("Setup complete. Redirected to login.")

            # If at Login
            if "/login" in page.url:
                print("At Login page. Logging in...")
                await page.fill("input[type='email']", "admin@example.com")
                await page.fill("input[type='password']", "admin123")
                await page.click("button[type='submit']")

                # Wait for navigation. It might go to /admin or /workspace or /
                await page.wait_for_url("**/workspace/**", timeout=10000)

            # 2. Inside Workspace
            print("Navigated to workspace.")
            await page.screenshot(path="verification/workspace_home.png")

            # 3. Create a Project if none exists (to test Project View)
            # Or just check if we can navigate to one.
            # Assuming the sidebar works, let's look for a project link or create button.

            # Since we don't know the exact ID, let's just verify the sidebar presence and look.
            await page.wait_for_selector("aside")

            sidebar = await page.query_selector("aside")
            if sidebar:
                print("Sidebar found.")

            # Take a screenshot of the dashboard
            await page.screenshot(path="verification/dashboard_verified.png")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="verification/error_retry_2.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
