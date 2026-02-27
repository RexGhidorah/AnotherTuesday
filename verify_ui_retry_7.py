import time
from playwright.sync_api import sync_playwright

def verify_sidebar_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        print("Navigating to login page...")
        page.goto("http://localhost:3000/login")

        # Check if we are logged in (redirected to / or /admin)
        if page.url == "http://localhost:3000/" or "/admin" in page.url:
            print("Already logged in.")
        else:
            print("Logging in...")
            page.fill("input[id='email']", "sarah@example.com")
            page.fill("input[id='password']", "password123")
            page.click("button[type='submit']")
            page.wait_for_url("http://localhost:3000/", timeout=10000)
            print("Logged in.")

        # If on Admin, create workspace if needed
        if "/admin" in page.url:
             print("On Admin Dashboard. Checking if we need to create workspace...")
             # Check if there are existing workspaces
             if page.locator("text=Existing Workspaces").count() > 0:
                 # Check if there is a 'Manage' link which indicates a workspace exists
                 manage_links = page.locator("a:has-text('Manage')")
                 if manage_links.count() > 0:
                     # We found a workspace, but we need the slug to go to the client view
                     # The list item has text like "Workspace Name /slug Manage"
                     # Let's try to get the text of the first list item
                     first_item = page.locator("ul.space-y-4 li").first
                     text = first_item.inner_text()
                     print(f"Found workspace text: {text}")
                     # Parse slug from text. It says "/slug"
                     import re
                     match = re.search(r'/([a-zA-Z0-9-]+)', text)
                     if match:
                         slug = match.group(1)
                         print(f"Extracted slug: {slug}")
                         page.goto(f"http://localhost:3000/workspace/{slug}")
                     else:
                         print("Could not extract slug. Creating new one...")
                         page.fill("input[placeholder='Workspace Name']", "Test Workspace")
                         page.fill("input[placeholder='Slug (e.g., marketing)']", "test-workspace-new")
                         page.click("button:has-text('Create')")
                         page.wait_for_selector("text=Test Workspace", timeout=5000)
                         page.goto("http://localhost:3000/workspace/test-workspace-new")
                 else:
                     print("No manage links found. Creating workspace...")
                     page.fill("input[placeholder='Workspace Name']", "Test Workspace")
                     page.fill("input[placeholder='Slug (e.g., marketing)']", "test-workspace")
                     page.click("button:has-text('Create')")
                     page.wait_for_selector("text=Test Workspace", timeout=5000)
                     page.goto("http://localhost:3000/workspace/test-workspace")
             else:
                 print("Creating workspace...")
                 page.fill("input[placeholder='Workspace Name']", "Test Workspace")
                 page.fill("input[placeholder='Slug (e.g., marketing)']", "test-workspace")
                 page.click("button:has-text('Create')")
                 page.wait_for_selector("text=Test Workspace", timeout=5000)
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
