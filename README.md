# 🔍 Fact Knowledge Layer — Multi-PDF Cross-Document Fact Verification Engine

> **Live Hosted Application**: [https://factcheck-f6ace.web.app](https://factcheck-f6ace.web.app)  
> **Author**: Deepika 

---

## 📌 Table of Contents
1. [What is Fact Knowledge Layer?](#-what-is-fact-knowledge-layer)
2. [Live Application & Demo](#-live-application--demo)
3. [Step-by-Step Guide: Run & Deploy in Your Own System](#-step-by-step-guide-run--deploy-in-your-own-system)
   - [Step 1: Clone the Code](#step-1-clone-the-code)
   - [Step 2: Install Node.js Dependencies](#step-2-install-nodejs-dependencies)
   - [Step 3: Set Up Your Own Firebase Project (Authentication & Database)](#step-3-set-up-your-own-firebase-project-authentication--database)
   - [Step 4: Configure Local Environment Variables](#step-4-configure-local-environment-variables)
   - [Step 5: Run Locally on Your Machine](#step-5-run-locally-on-your-machine)
   - [Step 6: Deploy Live to Firebase Hosting via Command Prompt](#step-6-deploy-live-to-firebase-hosting-via-command-prompt)
4. [Approach & Architecture](#-approach--architecture)
5. [The Four Required Cases (With Verbatim Evidence & Reasoning)](#-the-four-required-cases-with-verbatim-evidence--reasoning)
6. [Key Features of the Application](#-key-features-of-the-application)
7. [Limitations and What We Would Build Next](#-limitations-and-what-we-would-build-next)
8. [Brownie Points & Assignment Evaluation Checklist](#-brownie-points--assignment-evaluation-checklist)

---

## 🌟 What is Fact Knowledge Layer?

When companies, auditors, and investors read multiple related documents (such as Annual Reports, Auditor Reports, and Earnings Releases), important facts are often:
- **Expressed in completely different vocabulary or numbers** (e.g. `$42.5 million` vs `$42,500,000 USD`).
- **Seemingly contradictory until explained by context** (e.g. Q4 3-month operating profit vs 12-month full-year operating profit; or an executive who worked in 2022 and resigned in 2023).
- **Directly contradictory with no innocent explanation** (e.g. management claims 1,240 employees, but the certified auditor confirms only 890 on the official payroll on the exact same date).
- **Misinterpreted due to hidden footnotes or methodology changes** (e.g. CSAT 94 vs 91% on differing survey samples).

This project implements a **Fact Knowledge Layer**. It does not merely summarize text. It:
1. **Extracts discrete facts** (numerical, leadership, operational).
2. **Grounds every fact with exact source evidence** (document name, page number, section, and verbatim quote).
3. **Cross-compares documents** to find what agrees (**collaborated / corroborated**), what clashes (**genuine contradictions**), and what can be **reconciled through context** (time, scope, units).
4. **Presents an interactive dashboard and complete summary** in plain English that anyone can inspect, verify, and question.

---

## 🎥 Live Application & Demo

- **Live Hosted URL**: [https://factcheck-f6ace.web.app](https://factcheck-f6ace.web.app)  
- **Demo Video**: https://drive.google.com/file/d/1PuuxbkBcaVe7RuZwzxHNlyO4f7mavWh7/view?usp=sharing

---

## 💻 Step-by-Step Guide: Run & Deploy in Your Own System

Follow these simple steps to download, run, and host this project on your own machine.

### Prerequisites on Your Computer
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: Comes bundled with Node.js
- **Git**: Installed on your system ([Download Git](https://git-scm.com/))
- **A Google Account**: Free for Firebase and Gemini API

---

### Step 1: Clone the Code

Open your **Command Prompt (`cmd`)**, **PowerShell**, or **Terminal**, and run:

```bash
# Clone the repository from GitHub
git clone https://github.com/<your-username>/<your-repo-name>.git

# Navigate into the project folder
cd <your-repo-name>
```

---

### Step 2: Install Node.js Dependencies

Run the following command to download all required packages:

```bash
npm install
```

---

### Step 3: Set Up Your Own Firebase Project (Authentication & Database)

To have your own private database and user authentication (Email/Password login + saving extraction history in the cloud), set up a free Firebase project:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **"Add project"**.
2. Give your project a name (for example, `my-factcheck-app`) and click **Continue** (Google Analytics is optional).
3. **Enable Firebase Authentication**:
   - In the left sidebar, click **Build > Authentication** $\rightarrow$ Click **Get Started**.
   - Under the **Sign-in method** tab, click **Email/Password** $\rightarrow$ toggle **Enable** $\rightarrow$ click **Save**.
4. **Enable Cloud Firestore Database**:
   - In the left sidebar, click **Build > Firestore Database** $\rightarrow$ Click **Create database**.
   - Choose a location near you and select **Start in test mode** (or production mode) $\rightarrow$ click **Create**.
5. **Get Your Firebase Web Configuration**:
   - In the Firebase Console, click the **Project Settings (Gear icon ⚙️)** at top left.
   - Scroll down to the **"Your apps"** section and click the **Web icon (`</>`)**.
   - Register the app with a nickname (e.g. `FactCheck Web`).
   - Copy the `firebaseConfig` object shown on the screen. It looks like this:
     ```javascript
     const firebaseConfig = {
       apiKey: "AIzaSy...",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project",
       storageBucket: "your-project.firebasestorage.app",
       messagingSenderId: "123456789",
       appId: "1:123456789:web:abcdef"
     };
     ```
6. **Paste your config into the project**:
   - Open the file `/src/lib/firebase.ts` in your code editor (like VS Code).
   - Replace the lines inside `export const firebaseConfig = { ... }` with your own keys copied from Firebase.

*(Note: If you don't want to create a Firebase account right away, the app also has an automatic local storage fallback, so you can still use the app offline immediately!)*

---

### Step 4: Configure Local Environment Variables

Create a file named `.env` in the root folder of the project:

```bash
# In your .env file:
GEMINI_API_KEY=your_gemini_api_key_here
```

> **How to get a API Key:**
confidential

---

### Step 5: Run Locally on Your Machine

Start the development server:

```bash
npm run dev
```

Open your browser and visit:
```
http://localhost:3000
```
You can now upload PDFs, inspect facts, and explore the knowledge layer!

---

### Step 6: Deploy Live to Firebase Hosting via Command Prompt

You can deploy your own copy of the website to a live URL (like `https://your-app.web.app`) for free:

```bash
# 1. Install Firebase CLI globally (if you haven't already)
npm install -g firebase-tools

# 2. Log in to your Firebase account via command line
firebase login

# 3. Initialize Firebase in this project (select Hosting and Firestore)
firebase init

# Choose:
# - Use an existing project -> (Select your Firebase project created in Step 3)
# - What do you want to use as your public directory? -> dist
# - Configure as a single-page app (rewrite all urls to /index.html)? -> Yes
# - Set up automatic builds and deploys with GitHub? -> No (or Yes if desired)

# 4. Build the production application bundle
npm run build

# 5. Deploy hosting and security rules
firebase deploy
```

Once deployment completes, command prompt will display your live URL:
```
✔ Deploy complete!
Hosting URL: https://your-project.web.app
```

---

## 🧠 Approach & Architecture

### Core Philosophy
A graph database or visualization alone is **not** the solution. The fundamental challenge is **how facts are discovered, grounded, compared, and explained**.

```
┌──────────────────┐     ┌─────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│ 1. Ingestion of  │ ──> │ 2. Fact Extraction  │ ──> │ 3. Cross-Document      │ ──> │ 4. Knowledge Layer &   │
│ Multi-Page PDFs  │     │   & Evidence Ground │     │    Reconciliation      │     │    Complete Summary    │
└──────────────────┘     └─────────────────────┘     └────────────────────────┘     └────────────────────────┘
```

1. **Multimodal Direct Ingestion**:
   - Ingests raw PDFs while preserving tabular formatting, page numbers, footnote markers, and document hierarchy.
2. **Discrete Fact Grounding**:
   - Extracts structured facts rather than vague summaries.
   - Every fact records:
     - **Entity / Topic** (e.g. *Gross Revenue*, *Headcount*, *CTO*)
     - **Normalized Value & Unit** (e.g. `42,500,000`, `USD`)
     - **Temporal Scope** (e.g. `FY 2023`, `Q4 2023`, `Dec 31, 2023`)
     - **Verbatim Evidence Quote** (exact sentence directly from the PDF)
     - **Exact Citation** (Document name, page number, section)
3. **Cross-Document Semantic Comparison Engine**:
   - Pairs facts across documents by entity, scope, and date.
   - Compares propositions and categorizes them into:
     - `CORROBORATED`: Semantic equivalence across different wording.
     - `CONTRADICTION`: Irreconcilable conflict for identical parameters.
     - `RECONCILED_CONTEXT`: Apparent contradictions explained by time, scope, or units.
     - `METHODOLOGY_MISMATCH`: Statistical or footnote qualification differences.
4. **User-Centric Knowledge Layer**:
   - Searchable Extracted Data table & cards.
   - Dedicated Complete Summary Section in plain English.
   - Interactive Source Evidence Inspector showing the exact quote highlighted on the source page.

---

## 🔬 The Four Required Cases (With Verbatim Evidence & Reasoning)

Our system demonstrates all 4 mandatory assignment cases on the starter dataset of ApexTech Corporation documents:

### Case 1: Fact Corroborated Across Documents (Even If Expressed Differently)
*Two documents agree on the exact same fact, but use completely different vocabulary and numerical notation.*

- **Document 2 (ApexTech Annual Report 2023, Page 4)**:
  > *"Consolidated top-line revenue amounted to $42.5 million for the full fiscal year 2023."*
- **Document 3 (Independent Auditor Report 2023, Page 2)**:
  > *"Gross revenue for the twelve-month period ending December 31, 2023 was independently verified at $42,500,000 USD ($42.5M)."*
- **System Reasoning**:
  1. The system converts `$42.5 million` and `$42,500,000 USD` to identical normalized integers: `42,500,000 USD`.
  2. It semantically matches `"consolidated top-line revenue"` to `"gross revenue"`.
  3. It verifies both refer to the identical 12-month period ending December 31, 2023.
  4. **Verdict**: `CORROBORATED / COLLABORATED` (Confidence: 99%).

---

### Case 2: Genuine or Likely Contradiction
*Two documents make conflicting claims about the exact same entity at the exact same point in time with no innocent explanation.*

- **Document 2 (ApexTech Annual Report 2023, Page 12)**:
  > *"As of December 31, 2023, ApexTech employed 1,240 full-time staff members across all engineering and customer hubs."*
- **Document 3 (Independent Auditor Report 2023, Page 9)**:
  > *"Certified payroll audits confirm total permanent full-time personnel on payroll as of December 31, 2023 was 890 employees."*
- **System Reasoning**:
  1. Both documents specify the exact same metric: *Total permanent full-time employees*.
  2. Both documents point to the exact same date: *December 31, 2023*.
  3. The difference is 350 employees (1,240 vs 890).
  4. **Verdict**: `GENUINE CONTRADICTION`. The system flags an intentional discrepancy between company management marketing claims and statutory payroll audits.

---

### Case 3: Apparent Contradiction Explained by Context (Time & Scope)
*Figures or facts look contradictory when placed side-by-side, but are completely valid once time or reporting scope is considered.*

#### Example A: Reporting Scope (Quarterly vs Full Year Operating Profit)
- **Document 2 (ApexTech Annual Report 2023, Page 5)**:
  > *"Fourth Quarter (Q4) 2023 operating income alone was $3.8 million, marking our first quarterly operating profit."*
- **Document 3 (Independent Auditor Report 2023, Page 3)**:
  > *"Annual operating income for the full fiscal year 2023 stood at $14.2 million."*
- **System Reasoning**:
  - A naive system flags "$3.8M vs $14.2M" as a contradiction.
  - Our system parses the **reporting scope**: Doc 2 describes **Q4 (3 months)**, while Doc 3 describes the **Full Fiscal Year (12 months)**. $3.8M is a subset of the $14.2M full-year total.
  - **Verdict**: `RECONCILED BY SCOPE`.

#### Example B: Timeline (Executive Leadership / CTO)
- **Document 1 (ApexTech Annual Report 2022, Page 2)**:
  > *"Elena Rostova, Chief Technology Officer"*
- **Document 2 (ApexTech Annual Report 2023, Page 3)**:
  > *"Following the resignation of former CTO Elena Rostova in February 2023, David Chen was appointed Chief Technology Officer in March 2023."*
- **System Reasoning**:
  - Elena Rostova was active during 2022; she resigned in early 2023 and David Chen took over.
  - **Verdict**: `RECONCILED BY TIMELINE`.

---

### Case 4: Extraction or Reasoning Failure Found & How We Handled It
*Identifying where automated AI or naive parsers fail, and building a fail-safe mechanism.*

- **The Problem Found**:
  - In Document 1, the report states: *"Customer satisfaction index improved to 94"*.
  - In Document 2, customer satisfaction is reported as *"CSAT recorded at 91%"*.
  - A naive AI parser compared 94 to 91% and concluded: *"Customer satisfaction declined by 3% from 2022 to 2023."*
- **The Hidden Flaw**:
  - In Document 1, a small footnote stated: *"[table footnote: CSAT sample size n=120 enterprise accounts, metric methodology altered mid-year]"*.
  - The 94 was an unstandardized score on a small cohort, whereas Document 2's 91% was an annual survey percentage. They are **not mathematically comparable**.
- **How Our System Handled It**:
  1. Our extraction engine captures **footnotes and sample sizes** attached to numerical claims.
  2. The system flags the metric as `METHODOLOGY_MISMATCH`.
  3. It lowers the confidence score to **0.52** and shows a warning badge: *"Baseline altered: Footnote notes methodology changed mid-year; comparison is unreliable."*
  4. This prevents the knowledge layer from hallucinating a false decline or false conflict.

---

## 🚀 Key Features of the Application

1. **Special Column: Complete Summary Section**:
   - In the Extracted Data section, users can toggle open a dedicated Complete Summary Section.
   - Summarizes the whole story across all PDFs in plain English (Financials, People, Agreed Facts, Contradictions, Auditor Warnings, and Key Takeaways).
   - Includes full-text search, copy to clipboard, and JSON download.
2. **Interactive Evidence Inspector**:
   - Click "Inspect Source" on any fact to view its exact page, surrounding context, and verbatim quote highlighted.
3. **Cross-Document Comparison Matrix**:
   - Visually aligns facts side-by-side with color-coded badges (Green = Corroborated, Red = Contradiction, Blue = Context Reconciled, Orange = Footnote Warning).
4. **Natural Language Knowledge Querying**:
   - Ask questions like *"What was the verified revenue for 2023?"* or *"Who is the current CTO?"* and receive grounded answers with citations.
5. **Session History with User Authentication**:
   - Users can create an account (Sign Up / Log In) and save historical PDF extraction sessions in Cloud Firestore or local cache.

---

## ⚠️ Limitations and What We Would Build Next

### Current Limitations
1. **Very Large PDFs (100+ pages)**: Parsing extremely long documents in a single shot can take 15–20 seconds or approach token limits.
2. **Scanned Images / Raster PDFs**: Scanned non-searchable PDFs without an OCR layer require an external optical character recognition pass.

### What We Would Build Next
1. **Hierarchical Document Chunking + Vector Search**:
   - For 100+ page SEC filings, split documents into semantic sections (Item 1, Item 7, Item 8) and embed them into a dense vector index before cross-comparison.
2. **Incremental Fact Updates**:
   - When a 4th document is uploaded, compare it only against existing entity nodes rather than re-evaluating all prior documents from scratch.
3. **Dynamic Schema Discovery**:
   - Automatically cluster new domain entities (e.g., ESG carbon emissions, clinical trial endpoints) into new fact classes without modifying code schemas.

---

## 📝 Brownie Points & Assignment Evaluation Checklist

| Assignment Requirement | How This Solution Tackles It | Status |
| :--- | :--- | :---: |
| **Accepts new PDFs via UI or API** | Drag-and-drop or file selector for arbitrary PDFs. Does not rely on hardcoded filenames or schemas. | ✅ Passed |
| **Extracts meaningful numerical or semantic facts** | Extracts revenues, headcount, leadership, and operational metrics with normalized values and units. | ✅ Passed |
| **Links every fact to evidence in source document** | Every fact includes exact document name, page number, and verbatim quote. | ✅ Passed |
| **Identifies corroborated facts** | Case 1 demonstrated with $42.5M revenue verification. | ✅ Passed |
