# WTQ AI Test

AI-assisted QA analysis tools for reviewing the ElectraStore application for the Women Tech Quest evaluation.

## Prerequisites

- Node.js 18 or later
- A Gemini API key with access to the configured model

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local `.env` file in the project root:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

Keep `.env` local. It is excluded from Git and must not be committed.

## Commands

Test the Gemini API connection:

```bash
node test.js
```

Generate the structured QA evaluation report and save it to `qa-generator-output.md`:

```bash
node qa-generator.js
```

Run the AI review of the six manual findings and print the result:

```bash
node ai-review.js
```

## Project Files

- `test.js` verifies that the Gemini API connection works.
- `qa-generator.js` generates a detailed QA report from the supplied manual findings.
- `ai-review.js` reviews the findings and suggests additional test coverage.
- `qa-generator-output.md` contains the generated QA evaluation report.

The scripts analyze supplied observations only. They do not browse or test the target application automatically, so suggested defects must be verified manually.

## Security

Never commit API keys or other credentials. If a key is exposed, revoke it and create a replacement before continuing to use the project.
