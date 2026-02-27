import time
from playwright.sync_api import sync_playwright

def verify_sidebar_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        print("Navigating to login page...")
        page.goto("http://localhost:3000/login")

        # If we are on setup page, we need to setup
        if "setup" in page.url:
             print("On setup page. Filling setup...")
             page.fill("input[placeholder='Full Name']", "Sarah Connor")
             page.fill("input[placeholder='Email Address']", "sarah@example.com")
             page.fill("input[type='password']", "password123")
             page.click("button:has-text('Next')")
             page.wait_for_selector("button:has-text('Complete Setup')", state="visible")
             page.click("button:has-text('Complete Setup')")
             page.wait_for_url("**/login**", timeout=30000)

        print("Logging in...")
        page.fill("input[id='email']", "sarah@example.com")
        page.fill("input[id='password']", "password123")
        page.click("button[type='submit']")

        # Wait for either home or admin
        try:
             page.wait_for_url("http://localhost:3000/", timeout=10000)
             print("Logged in. Redirected to home.")
        except:
             # Check if we are at admin
             if "/admin" in page.url:
                 print("Redirected to admin.")
             else:
                 print("Unknown redirect or stay.")

        # If on Admin, create workspace if needed
        if "/admin" in page.url:
             print("On Admin Dashboard. Checking if we need to create workspace...")
             # Check if there are existing workspaces
             if page.locator("text=Existing Workspaces").count() > 0:
                 # Try to find a link to a workspace or just create one
                 # The dashboard lists workspaces but the links go to /admin/workspace/ID
                 # We need to create a new one to be sure or use an existing slug if we can find it

                 # Let's just create one to be safe and easy
                 print("Creating workspace...")
                 page.fill("input[placeholder='Workspace Name']", "Test Workspace")
                 page.fill("input[placeholder='Slug (e.g., marketing)']", "test-workspace")
                 page.click("button:has-text('Create')")
                 # Wait for it to appear
                 page.wait_for_selector("text=Test Workspace", timeout=5000)

                 # Now navigate to the actual workspace view, not admin view
                 print("Navigating to workspace view...")
                 page.goto("http://localhost:3000/workspace/test-workspace")

        # Now we should be on a workspace page with the sidebar
        # Wait for the sidebar to be visible
        try:
            page.wait_for_selector("text=Tuesday", timeout=20000)
            print("Sidebar loaded.")
        except:
            print("Sidebar not found or page took too long to load.")
            page.screenshot(path="verification/error_state_final.png")
            return

        # Check for the new button elements
        # 1. Workspace toggle
        workspace_btn = page.locator("button:has-text('Workspace')")
        if workspace_btn.count() > 0:
            print("Workspace toggle is a button: ✅")
            # Check aria-expanded
            is_expanded = workspace_btn.get_attribute("aria-expanded")
            print(f"Workspace aria-expanded: {is_expanded}")

            # Focus it to show focus styles in screenshot
            workspace_btn.focus()
            page.screenshot(path="verification/workspace_focus.png")
            print("Took screenshot of workspace button focus.")
        else:
            print("Workspace toggle is NOT a button: ❌")

        # 2. Favorites toggle
        favorites_btn = page.locator("button:has-text('Favorites')")
        if favorites_btn.count() > 0:
            print("Favorites toggle is a button: ✅")
            is_expanded = favorites_btn.get_attribute("aria-expanded")
            print(f"Favorites aria-expanded: {is_expanded}")
        else:
            print("Favorites toggle is NOT a button: ❌")

        # 3. User Footer
        # It's a button containing "Sarah Connor"
        user_btn = page.locator("button:has-text('Sarah Connor')")
        if user_btn.count() > 0:
            print("User footer is a button: ✅")
            user_btn.focus()
            page.screenshot(path="verification/user_focus.png")
            print("Took screenshot of user button focus.")
        else:
            print("User footer is NOT a button: ❌")

        browser.close()

if __name__ == "__main__":
    verify_sidebar_accessibility()
