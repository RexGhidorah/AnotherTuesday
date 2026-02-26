from playwright.sync_api import sync_playwright
import os

def test_login():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to login page...")
        page.goto("http://localhost:3000/login")

        page.fill("input[type='email']", "admin@example.com")
        page.fill("input[type='password']", "password123")
        page.click("button[type='submit']")

        try:
            page.wait_for_url("http://localhost:3000/", timeout=5000)
            print("✅ Login successful.")
        except:
            print(f"❌ Login failed. URL: {page.url}")

        browser.close()

if __name__ == "__main__":
    test_login()
