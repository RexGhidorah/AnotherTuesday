import time
from playwright.sync_api import sync_playwright

def verify_sidebar_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        print("Navigating to setup page...")
        try:
            page.goto("http://localhost:3000/setup", timeout=60000)
        except Exception as e:
            print(f"Error navigating: {e}")
            return

        print("Completing setup...")
        try:
            # Step 1: Admin Account
            # Check if we are on step 1 or step 2 (SMTP)
            if page.locator("button:has-text('Complete Setup')").count() == 0:
                print("Filling Step 1: Admin Account")
                page.fill("input[placeholder='Full Name']", "Sarah Connor")
                page.fill("input[placeholder='Email Address']", "sarah@example.com")
                page.fill("input[type='password']", "password123")
                page.click("button:has-text('Next')")
                print("Step 1 submitted.")
                # Wait for next step content
                page.wait_for_selector("button:has-text('Complete Setup')", timeout=5000)

            # Step 2: SMTP Settings (Optional)
            print("Filling Step 2: SMTP Settings (skipping inputs)")
            # It's optional, so we can just click "Complete Setup"
            page.click("button:has-text('Complete Setup')")
            print("Step 2 submitted.")

            # Wait for redirect to home
            page.wait_for_url("http://localhost:3000/", timeout=30000)
            print("Redirected to home.")

        except Exception as e:
            print(f"Setup interaction failed: {e}")
            page.screenshot(path="verification/setup_error_2.png")
            # If we are redirected to login, try to login
            if "login" in page.url:
                 print("Redirected to login, trying to login...")
                 page.fill("input[id='email']", "sarah@example.com")
                 page.fill("input[id='password']", "password123")
                 page.click("button[type='submit']")
                 page.wait_for_url("http://localhost:3000/", timeout=10000)

        # Wait for the sidebar to be visible
        try:
            page.wait_for_selector("text=Tuesday", timeout=20000)
            print("Sidebar loaded.")
        except:
            print("Sidebar not found or page took too long to load.")
            page.screenshot(path="verification/error_state.png")
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
