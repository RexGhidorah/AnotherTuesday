from playwright.sync_api import sync_playwright

def verify_admin_features():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a new context and load the auth state
        context = browser.new_context()
        page = context.new_page()

        # Login
        print("Navigating to Login...")
        page.goto("http://localhost:3000/login")

        # Check if we are redirected to setup
        if "setup" in page.url:
            print("⚠️ Redirected to Setup page. Please run setup first.")
            browser.close()
            return

        print("Logging in...")
        try:
            # Using the IDs from the React component
            page.wait_for_selector("#email", timeout=5000)
            page.fill("#email", "admin@example.com")
            page.fill("#password", "password123")

            # Click the sign in button
            page.click("button[type='submit']")

            # Handle potential alert
            # page.on("dialog", lambda dialog: dialog.accept())

        except Exception as e:
            print(f"❌ Error finding login fields: {e}")
            page.screenshot(path="verification/login_error.png")
            browser.close()
            return

        # Wait for redirect to dashboard
        try:
            # Wait for dashboard content instead of strict URL match
            # This handles potential redirects/delays better
            page.wait_for_selector("h1:has-text('Dashboard')", timeout=15000)
            print("✅ Logged in and reached Dashboard")
        except:
             print("❌ Login failed or timed out (stuck on login page?)")
             page.screenshot(path="verification/login_failed.png")
             browser.close()
             return

        # 1. Verify Admin Dashboard (Active Workspaces Stats)
        print("\n--- Verifying Admin Dashboard ---")
        try:
            # Check for Workspace Stats (Projects, Members, Tasks)
            # We verify visibility of "Projects" text which indicates stats are rendering
            # Using first=True to avoid strict mode violation if multiple exist
            projects_label = page.get_by_text("Projects").first

            if projects_label.is_visible():
                 print("✅ Workspace Stats (Projects) are visible")
            else:
                 print("⚠️ Workspace Stats NOT found (Are there workspaces created?)")

            # Check for System Overview Stats
            users_stat = page.get_by_text("Total Users")
            if users_stat.is_visible():
                 print("✅ System Overview (Total Users) is visible")

            page.screenshot(path="verification/admin_dashboard.png")
            print("📸 Dashboard screenshot saved to verification/admin_dashboard.png")

        except Exception as e:
            print(f"❌ Failed to verify Dashboard: {e}")
            page.screenshot(path="verification/error_dashboard.png")

        # 2. Verify Admin Users Page (Invite & Actions)
        print("\n--- Verifying Admin Users Page ---")
        try:
            page.goto("http://localhost:3000/admin/users")
            page.wait_for_selector("h1:has-text('Users')", timeout=5000)

            # Verify Invite Button
            invite_btn = page.get_by_role("button", name="Invite User")
            if invite_btn.is_visible():
                print("✅ Invite User button is visible")
                invite_btn.click()

                # Verify Modal Content
                page.wait_for_selector("text=System Role", timeout=3000)
                role_select = page.locator("select")
                if role_select.is_visible():
                     print("✅ Invite Modal Role Selector is visible")

                page.screenshot(path="verification/admin_users_invite_modal.png")
                print("📸 Invite Modal screenshot saved to verification/admin_users_invite_modal.png")

                # Close modal
                page.get_by_role("button", name="Cancel").click()
            else:
                print("❌ Invite User button NOT visible")

            # Verify Actions Menu (Dropdown)
            # Find the first actions button (MoreHorizontal icon) in the table body
            # Using a locator for the button in the last cell of a row
            actions_btns = page.locator("tbody tr td:last-child button")

            if actions_btns.count() > 0:
                print(f"✅ Found {actions_btns.count()} user rows with action buttons")
                # Click the first one
                actions_btns.first.click()

                # Check for "Change Role" and "Delete User"
                # Wait for dropdown menu to appear
                # Using specific text locators for menu items
                change_role = page.get_by_role("button", name="Change Role")
                delete_user = page.get_by_role("button", name="Delete User")

                # Wait a bit for animation/rendering
                page.wait_for_timeout(500)

                if change_role.is_visible() and delete_user.is_visible():
                    print("✅ User Actions Menu items (Change Role, Delete User) are visible")
                    page.screenshot(path="verification/admin_users_actions.png")
                    print("📸 User Actions Menu screenshot saved to verification/admin_users_actions.png")
                else:
                     print("❌ User Actions Menu items NOT visible")
            else:
                print("⚠️ No users found in the table to test actions")

        except Exception as e:
             print(f"❌ Failed to verify Users Page: {e}")
             page.screenshot(path="verification/error_users.png")

        browser.close()

if __name__ == "__main__":
    verify_admin_features()
