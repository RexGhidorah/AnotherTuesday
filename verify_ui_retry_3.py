
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        try:
            # 1. Start at Login
            await page.goto("http://localhost:3000")
            await page.wait_for_load_state("networkidle")

            if "/login" in page.url:
                print("At Login page. Logging in...")
                await page.fill("input[type='email']", "admin@example.com")
                await page.fill("input[type='password']", "admin123")
                await page.click("button[type='submit']")

            # 2. Handle Redirection (Admin vs Workspace)
            # The admin is SUPER_ADMIN, so it redirects to /admin.
            # We need to create a workspace here to verify the workspace UI.

            await page.wait_for_url("**/admin**", timeout=10000)
            print("Redirected to Admin Dashboard.")

            # 3. Create a Workspace
            print("Creating a test workspace...")
            await page.fill("input[placeholder='Workspace Name']", "Test Workspace")
            await page.fill("input[placeholder='Slug (e.g., marketing)']", "test-ws")
            await page.click("button:has-text('Create')")

            # Wait for creation (it might just refresh or show in list)
            await page.wait_for_selector("text=Test Workspace")
            print("Workspace created.")

            # 4. Navigate to the new workspace
            # The admin dashboard doesn't seem to link directly to the USER VIEW of the workspace in the list?
            # It links to `/admin/workspace/[id]`.
            # But as a SUPER_ADMIN, we should be able to access `/workspace/test-ws` directly.

            print("Navigating to workspace view...")
            await page.goto("http://localhost:3000/workspace/test-ws")

            # 5. Verify Sidebar
            await page.wait_for_selector("aside")
            print("Sidebar found in Workspace view.")

            # 6. Verify Main Table View (default) or navigate to a project
            # The workspace home page `/workspace/test-ws` currently redirects to the first project?
            # Or shows "Home"?
            # Let's check `saas-pm/app/workspace/[slug]/page.tsx` logic?
            # It doesn't seem to exist in my previous `read_file` calls?
            # Wait, I looked at `saas-pm/app/workspace/[slug]/project/[projectId]/page.tsx`.
            # I did NOT create `saas-pm/app/workspace/[slug]/page.tsx`.
            # Let's see what happens.

            await page.screenshot(path="verification/workspace_view.png")

            # If we are at `/workspace/test-ws`, and there is no project, what shows?
            # If `page.tsx` is missing, it's a 404?
            # I should verify if `saas-pm/app/workspace/[slug]/page.tsx` exists.

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="verification/error_retry_3.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
