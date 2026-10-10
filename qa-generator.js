
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const prompt = `
You are an experienced QA engineer assisting with the
Women Tech Quest AI-Assisted Application Evaluation competition.

Application: https://validate.womentechquest.com/
Application name: ElectraStore

IMPORTANT:
You have not been given browser-control tools.
Do not claim that you opened, browsed, or tested the live website.
Base your analysis on the observations supplied below.

EXISTING MANUAL FINDINGS:

1. Before login, clicking Buy Product navigates directly to Signup.
2. The cart appears empty after signup.
3. The checkout mobile-number field may accept invalid input.
4. The Daily Deals category filter appears to show products
   from other categories.
5. The maximum-price filter accepts a value lower than
   the minimum-price value.
6. Customer-rating checkboxes may not support multiple selections.

YOUR TASKS:

A. Review all six findings.
B. Identify missing evidence, unclear reproduction steps,
   and assumptions requiring verification.
C. Suggest additional test scenarios for:
   - Signup and login
   - Product browsing and category filters
   - Price filters and boundary values
   - Customer-rating filters
   - Cart persistence and product quantities
   - Checkout form validation
   - Navigation and error handling
D. Suggest at least 10 specific, actionable test cases.

For every test case include:
- Test Case ID
- Scenario
- Preconditions
- Steps to execute manually
- Expected result
- What evidence to capture
- Priority
- Related existing finding, if applicable

E. Compare manual findings with your suggestions.
Classify suggestions as:
- Overlap with existing findings
- Additional test coverage
- Unverified defect hypotheses

F. Explain how each potential defect can be verified manually.

RULES:
- Do not invent application requirements.
- Do not claim a suggested defect is confirmed.
- Distinguish observations from assumptions.
- Mark actual results as "Not tested" when no execution
  evidence has been provided.
- Recommend the highest-value tests first.

Return a clear, structured Markdown report.
`;

async function main() {
  try {
    console.log("Sending QA evaluation request to Gemini...\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const report = response.text;

    if (!report) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("===== AI-ASSISTED QA EVALUATION =====\n");
    console.log(report);

    fs.writeFileSync(
      "qa-generator-output.md",
      report,
      "utf8"
    );

    console.log(
      "\n\nReport saved to qa-generator-output.md"
    );
  } catch (error) {
    console.error("Gemini request failed:", error.message);
    process.exitCode = 1;
  }
}

main();
