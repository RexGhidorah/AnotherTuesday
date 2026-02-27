from playwright.sync_api import sync_playwright

def verify_login_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to login page
        page.goto("http://localhost:3000/login")

        print(f"Page title: {page.title()}")

        # Check for new elements
        if page.get_by_text("Bienvenido de vuelta").is_visible():
            print("New login header found.")

        if page.get_by_placeholder("ejemplo@tuempresa.com").is_visible():
            print("Email input found.")

        if page.get_by_role("button", name="Iniciar sesión").is_visible():
            print("Login button found.")

        # Take screenshot
        page.screenshot(path="verification/new_login.png")
        browser.close()

if __name__ == "__main__":
    verify_login_page()
