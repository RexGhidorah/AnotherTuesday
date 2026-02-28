from playwright.sync_api import sync_playwright

def verify_sidebar_buttons(page):
    page.goto("http://localhost:3000")
    page.wait_for_selector("aside")

    # Wait to ensure JS is loaded (though Next App router is fast)
    page.wait_for_timeout(2000)

    # Focus the Workspace button and take a screenshot
    workspace_btn = page.locator('button:has-text("Workspace")')
    workspace_btn.focus()
    page.screenshot(path="verification/sidebar_focus.png", full_page=True)

    # Click it to toggle
    workspace_btn.click()
    page.screenshot(path="verification/sidebar_toggled.png", full_page=True)

    print("Success")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            verify_sidebar_buttons(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()