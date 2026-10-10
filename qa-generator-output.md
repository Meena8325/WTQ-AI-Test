# QA Evaluation Report: ElectraStore Application
**Competition:** Women Tech Quest AI-Assisted Application Evaluation  
**Target Application:** ElectraStore (`https://validate.womentechquest.com/`)  
**Role:** Experienced QA Engineer  
**Status:** Review based strictly on supplied manual observations (No live browser-control tools used).

---

## A. Review of Existing Manual Findings

1. **Before login, clicking Buy Product navigates directly to Signup.** *(Observation: Redirects to signup instead of login or requiring authentication context).*
2. **The cart appears empty after signup.** *(Observation: Cart state does not persist or transfer across the pre-signup/signup boundary).*
3. **The checkout mobile-number field may accept invalid input.** *(Assumption/Observation: Needs boundary and format validation confirmation).*
4. **The Daily Deals category filter appears to show products from other categories.** *(Observation: Filter query logic may be broken or misconfigured).*
5. **The maximum-price filter accepts a value lower than the minimum-price value.** *(Observation: Lack of cross-field validation on price ranges).*
6. **Customer-rating checkboxes may not support multiple selections.** *(Assumption/Observation: UI state or filter logic restricts selection to a single rating).*

---

## B. Missing Evidence, Unclear Reproduction Steps, and Assumptions Requiring Verification

* **Missing Evidence:** No console logs, network requests, screenshots, or screen recordings were supplied to confirm UI behavior versus API responses. Actual results for all tests must be marked as **"Not tested"** until verified.
* **Unclear Reproduction Steps:**
  * Finding #1: Does the item the user clicked "Buy Product" on get stored in session/local storage prior to the signup redirect, or is it lost?
  * Finding #2: Was an item added *before* initiating the signup flow, or is this referring to a generic post-signup state?
  * Finding #3: What specific invalid inputs were tested (e.g., alphabets, special characters, incorrect digit lengths)?
* **Assumptions Requiring Verification:**
  * Assuming "Daily Deals" is expected to be an exclusive category rather than a promotional tag applied to items across multiple categories.
  * Assuming the price filter inputs lack client-side validation logic entirely rather than just failing under specific edge cases.
  * Assuming customer-rating filters use standard multi-select checkbox behavior rather than radio-button-like single-select behavior by design.

---

## C. Suggested Additional Test Scenarios

* **Signup and Login:** User registration with existing/new emails, password complexity rules, session token persistence, and redirect behavior post-login.
* **Product browsing and category filters:** Pagination, sorting (price low-high, high-low, popularity), and multi-category filtering.
* **Price filters and boundary values:** Negative numbers, zero, extreme highs, and field validation error messages when $\text{Max} < \text{Min}$.
* **Customer-rating filters:** Combining rating filters with category and price filters simultaneously.
* **Cart persistence and product quantities:** Updating quantities (e.g., setting to 0, negative, or max stock limit), removing items, and cart persistence across browser refreshes and login/logout sessions.
* **Checkout form validation:** Mandatory fields, email format checks, postal code formats, and special character handling.
* **Navigation and error handling:** Broken links, 404 pages, back-button behavior during multi-step checkout, and handling of expired sessions.

---

## D. Specific, Actionable Test Cases (Highest-Value First)

### Test Case 1
* **Test Case ID:** TC-CART-001
* **Scenario:** Cart persistence and item retention across unauthenticated and authenticated states.
* **Preconditions:** User is logged out. At least one product is added to the cart.
* **Steps to execute manually:** 
  1. Browse to ElectraStore unauthenticated.
  2. Click "Buy Product" or "Add to Cart" on a product.
  3. Observe the redirect to the Signup page (per Finding #1).
  4. Complete the signup process and log into the application.
  5. Navigate to the Cart page.
* **Expected result:** The product added prior to signup remains in the user's cart.
* **What evidence to capture:** Screenshots of the cart before signup and after login; Network tab showing local storage/session storage or API cart sync payloads.
* **Priority:** High
* **Related existing finding:** Finding #1, Finding #2

### Test Case 2
* **Test Case ID:** TC-PRICE-001
* **Scenario:** Price filter validation for invalid boundary conditions ($\text{Max} < \text{Min}$).
* **Preconditions:** User is on the product catalog page with price filter inputs visible.
* **Steps to execute manually:**
  1. Locate the minimum-price and maximum-price filter fields.
  2. Enter a higher value in the minimum-price field (e.g., `$500`).
  3. Enter a lower value in the maximum-price field (e.g., `$100`).
  4. Click "Apply Filter" or observe real-time filtering.
* **Expected result:** The system displays a validation error message (e.g., "Maximum price cannot be less than minimum price") or disables the apply action, preventing invalid query execution.
* **What evidence to capture:** Screenshot of the input fields with invalid values and any resulting error messages or product list output.
* **Priority:** High
* **Related existing finding:** Finding #5

### Test Case 3
* **Test Case ID:** TC-CAT-001
* **Scenario:** Category filter isolation accuracy for "Daily Deals".
* **Preconditions:** User is on the product catalog page.
* **Steps to execute manually:**
  1. Click on the "Daily Deals" category filter.
  2. Inspect the returned product listing.
  3. Check the category metadata/badges of each displayed product.
* **Expected result:** All displayed products exclusively belong to the "Daily Deals" category (or meet the strict criteria of a daily deal), without leaking items from unrelated categories (e.g., Kitchen appliances under Electronics deals).
* **What evidence to capture:** Full-page screenshot of the product catalog filtered by "Daily Deals" showing product titles and category labels.
* **Priority:** High
* **Related existing finding:** Finding #4

### Test Case 4
* **Test Case ID:** TC-CHK-001
* **Scenario:** Input validation on the checkout mobile-number field.
* **Preconditions:** User has items in the cart and has proceeded to the checkout page.
* **Steps to execute manually:**
  1. Navigate to the checkout form.
  2. Enter invalid mobile data (e.g., alphabetic characters `"ABCDEFGHIJ"`, special symbols, or a 3-digit number).
  3. Attempt to proceed to the next step or submit the form.
* **Expected result:** Form validation triggers an error state on the mobile-number field and blocks progression.
* **What evidence to capture:** Screenshot of the invalid input accepted/rejected by the field and browser console logs if validation scripts fail.
* **Priority:** High
* **Related existing finding:** Finding #3

### Test Case 5
* **Test Case ID:** TC-RAT-001
* **Scenario:** Multi-selection support for customer-rating filters.
* **Preconditions:** User is on the product catalog page with rating filters visible.
* **Steps to execute manually:**
  1. Locate the customer-rating filter checkboxes (e.g., 4 Stars & Up, 3 Stars & Up).
  2. Click the checkbox for "4 Stars & Up".
  3. Click the checkbox for "3 Stars & Up" simultaneously.
* **Expected result:** Both checkboxes can be selected, and the filter dynamically updates to display products matching the combined rating criteria.
* **What evidence to capture:** Screenshot showing multiple rating checkboxes checked concurrently and the resulting product list.
* **Priority:** Medium
* **Related existing finding:** Finding #6

### Test Case 6
* **Test Case ID:** TC-AUTH-001
* **Scenario:** Unauthenticated "Buy Product" redirection logic.
* **Preconditions:** User is not logged in.
* **Steps to execute manually:**
  1. Visit the home or catalog page.
  2. Click "Buy Product" on any item.
  3. Verify the destination URL and page content.
* **Expected result:** The user is redirected to a login/signup flow, but ideally with a return URL parameter so they can resume their purchase intent seamlessly post-login.
* **What evidence to capture:** URL string showing query parameters (e.g., `?redirect=...`) and screenshot of the destination page.
* **Priority:** Medium
* **Related existing finding:** Finding #1

### Test Case 7
* **Test Case ID:** TC-CART-002
* **Scenario:** Product quantity update validation in the cart.
* **Preconditions:** User has at least one product in the cart.
* **Steps to execute manually:**
  1. Navigate to the cart page.
  2. Modify the product quantity input to `0`, a negative number, or a value exceeding stock availability.
  3. Click update or blur the input field.
* **Expected result:** The system rejects invalid quantities (0, negative) or caps the quantity at maximum stock limits with an appropriate warning message.
* **What evidence to capture:** Screenshot of input error states or automatic correction of quantities.
* **Priority:** Medium
* **Related existing finding:** None

### Test Case 8
* **Test Case ID:** TC-PRICE-002
* **Scenario:** Negative price input handling in price filters.
* **Preconditions:** User is on the product catalog page.
* **Steps to execute manually:**
  1. Enter a negative value (e.g., `$-50`) into the minimum-price filter.
  2. Apply the filter.
* **Expected result:** The system displays a validation error or normalizes the negative value to `0`.
* **What evidence to capture:** Screenshot of input field and filter behavior.
* **Priority:** Low
* **Related existing finding:** Finding #5

### Test Case 9
* **Test Case ID:** TC-CAT-002
* **Scenario:** Resetting category and price filters simultaneously.
* **Preconditions:** Multiple filters (Category, Price, Rating) are currently applied.
* **Steps to execute manually:**
  1. Apply various filters resulting in a filtered product list.
  2. Click the "Reset Filters" or "Clear All" button.
* **Expected result:** All filter criteria clear out, checkboxes uncheck, price fields clear, and the full unfiltered product catalog reloads.
* **What evidence to capture:** Screenshots of the UI before and after clearing filters.
* **Priority:** Low
* **Related existing finding:** None

### Test Case 10
* **Test Case ID:** TC-CHK-002
* **Scenario:** Mandatory field validation on the checkout summary step.
* **Preconditions:** User is on the checkout form with empty mandatory fields.
* **Steps to execute manually:**
  1. Leave mandatory fields (Name, Address, Mobile Number) completely blank.
  2. Click the "Place Order" or "Proceed" button.
* **Expected result:** Form submission is blocked, and inline validation errors appear under all mandatory fields.
* **What evidence to capture:** Screenshot highlighting validation error messages across empty fields.
* **Priority:** High
* **Related existing finding:** Finding #3

---

## E. Comparison of Manual Findings with Suggestions

* **Overlap with existing findings:**
  * TC-CART-001 aligns with Findings #1 and #2 (Cart persistence/emptying post-signup).
  * TC-PRICE-001 aligns with Finding #5 (Max price lower than min price).
  * TC-CAT-001 aligns with Finding #4 (Daily Deals filtering inaccuracies).
  * TC-CHK-001 aligns with Finding #3 (Mobile-number validation).
  * TC-RAT-001 aligns with Finding #6 (Customer-rating multi-selection).
* **Additional test coverage:**
  * TC-CART-002 (Quantity updates and stock limits).
  * TC-CAT-002 (Filter reset functionality).
  * TC-CHK-002 (General checkout mandatory field validations).
* **Unverified defect hypotheses:**
  * Whether mobile-number validation fails due to missing regex checks on the backend, frontend, or both.
  * Whether "Daily Deals" items are hardcoded incorrectly in the database or filtered using a misconfigured tag query parameter.

---

## F. Manual Verification Methods for Potential Defects

1. **Finding #1 & #2 (Cart Emptied After Signup via "Buy Product"):**
   * *Verification Method:* Open browser Developer Tools (`F12`), go to the **Application/Storage** tab (`Local Storage`, `Session Storage`, or `Cookies`). Check if cart items are stored locally before clicking "Buy Product". Perform the signup flow and inspect if storage keys are wiped, overwritten, or if an API call (`/cart`) fails to synchronize items post-authentication. Mark actual result as **Not tested**.
2. **Finding #3 (Checkout Mobile Number Accepts Invalid Input):**
   * *Verification Method:* Input non-numeric strings (e.g., `TestPhone`), special characters (`!@#$`), and short/long digits into the mobile field. Inspect the Network payload when submitting checkout to see if the raw invalid string is transmitted to the server without client-side rejection. Mark actual result as **Not tested**.
3. **Finding #4 (Daily Deals Category Filter Shows Other Products):**
   * *Verification Method:* Click "Daily Deals", open the **Network** tab, and inspect the API query response (e.g., `GET /api/products?category=daily-deals`). Compare the `category` attribute in the JSON response objects against the items rendered in the DOM to confirm if the backend is returning mixed categories. Mark actual result as **Not tested**.
4. **Finding #5 (Max Price Lower Than Min Price):**
   * *Verification Method:* Set Minimum Price to `1000` and Maximum Price to `10`. Click Apply and observe if the application throws a JavaScript error in the console, returns an empty set silently, or incorrectly queries items between `10` and `1000`. Mark actual result as **Not tested**.
5. **Finding #6 (Customer-Rating Checkboxes Restrict Multi-Selection):**
   * *Verification Method:* Inspect the HTML elements of the rating filters using Developer Tools (`Elements` tab). Check whether they are marked as `<input type="radio">` (which enforces single selection by design) instead of `<input type="checkbox">` (which supports multi-selection). Mark actual result as **Not tested**.