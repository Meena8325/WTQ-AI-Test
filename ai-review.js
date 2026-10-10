
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const MODEL_ID = "gemini-3.5-flash-lite";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


const prompt = `
You are a QA engineer assisting with the Women Tech Quest 2026
Validate with AI competition.

Application: https://validate.womentechquest.com/

Review my six manually identified findings.

FINDING 1
Title: Before login, clicking Buy Product navigates directly to Signup
Observation: I expected the user to be directed to Login instead.
Status on competition page: Not counted yet.
Review whether this expectation needs confirmation from the requirements.

FINDING 2
Title: Selected product is missing from cart after signup
Steps: As a logged-out user, select a product and add it to cart.
The application opens Signup. Complete all mandatory information.
Observation: The application navigates to the dashboard, but the cart is empty.
Expected: The previously selected product should remain in the cart,
if guest-cart persistence is intended by the requirements.
Competition status: Counted.

FINDING 3
Title: Checkout mobile number validation
Observation: The mobile number's digit length is not validated.
Expected: The application should enforce the specified phone-number format.
Competition status: Counted.

FINDING 4
Title: Daily Deals category filter
Observation: Selecting a category displays items from other categories.
Expected: Results should match the selected category.
Competition status: Counted.

FINDING 5
Title: Daily Deals maximum-price filter
Observation: The maximum price value can be less than the minimum price value.
Expected: The filter should prevent or clearly handle an invalid price range.
Competition status: Counted.

FINDING 6
Title: Daily Deals customer-rating filter
Observation: Multiple rating checkboxes cannot be selected together.
Expected: If the checkboxes are intended for multi-selection, users should
be able to select more than one rating.
Competition status: Counted.

YOUR TASK
1. Review each finding for clarity and missing evidence.
2. Identify assumptions that need requirements confirmation.
3. Suggest additional test scenarios for each feature.
4. Suggest other high-value e-commerce test scenarios.
5. Separate observations, hypotheses, and confirmed conclusions.
6. Do not claim to have opened or tested the website yourself.
7. Do not invent requirements, test results, or new confirmed bugs.
8. Explain how I can independently reproduce each suggested issue.

Return:
A. Review of my six findings.
B. Additional test scenarios.
C. Possible new defect hypotheses with verification steps.
D. Strengths and limitations of AI-assisted testing.
E. A comparison template for manual and AI findings.
`;


async function main() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing. Check your .env file.");
  }

  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: prompt
  });

  console.log("\n--- AI QA REVIEW ---\n");
  console.log(response.text);
}

main().catch((error) => {
  console.error("AI review failed:", error.message);
});
