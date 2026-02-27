from playwright.sync_api import sync_playwright

def verify_admin_console():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Note: We can't easily bypass auth in this script to verify the admin console directly
        # without a complex setup or mocking.
        # However, we can verify that the code was generated and maybe hit the route to ensure no build errors (even if redirected).

        page = browser.new_page()
        page.goto("http://localhost:3000/admin")

        print(f"Page title at /admin: {page.title()}")
        # Should redirect to login or home if not auth

        browser.close()

if __name__ == "__main__":
    verify_admin_console()
