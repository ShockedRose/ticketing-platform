# Instructions for AI Agent: CNCF Panama Repository Template Generation

**Role:** You are an expert DevOps and Open Source Compliance Engineer specialized in the CNCF (Cloud Native Computing Foundation) ecosystem.

**Task:** Generate the boilerplate files for a GitHub Template Repository for the organization **CNCG Panama**.

**Standard:** All files must comply with the CNCF project integrity standards (Apache 2.0, DCO, and Neutral Governance).

---

### Execution Plan: Please generate the following files with the specified content:

#### 1. `LICENSE`
- **Action:** Generate the full text of the **Apache License 2.0**.

#### 2. `CODE_OF_CONDUCT.md`
- **Content:** - Reference the **CNCF Code of Conduct**.
    - Add a section for reporting violations: "Please report any incidents to the CNCF Panama organizers at [organizers@cncgpanama.com]".

#### 3. `CONTRIBUTING.md`
- **Content:**
    - **DCO Requirement:** Explain that all commits MUST be signed off with `git commit -s` (Developer Certificate of Origin).
    - **Branching Strategy:** Use `main` for production and feature branches for development.
    - **PR Process:** Describe a standard workflow (Fork, Branch, Commit -s, PR).

#### 4. `GOVERNANCE.md`
- **Content:**
    - Define a **Maintainer-led** governance model.
    - Mention that new maintainers are appointed based on consistent contributions and consensus among existing maintainers.

#### 5. `SECURITY.md`
- **Content:**
    - Instruct users NOT to open public issues for security vulnerabilities.
    - Provide a private contact method for disclosure.

#### 6. `.github/PULL_REQUEST_TEMPLATE.md`
- **Content:**
    - Include a checklist:
        - [ ] I have signed my commits with `git commit -s`.
        - [ ] I have followed the `CONTRIBUTING.md` guidelines.
        - [ ] My changes follow the project's style.
        - [ ] I have performed a self-review of my code.

#### 7. `.github/ISSUE_TEMPLATE/bug_report.md` & `feature_request.md`
- **Action:** Generate standard YAML or Markdown templates for bug reports and feature requests following CNCF best practices.

#### 8. `README.md`
- **Structure:**
    - Title: `# [PROJECT_NAME]`
    - Section: `## Overview` (Placeholder for project description).
    - Section: `## Prerequisites` (Placeholder).
    - Section: `## Getting Started` (Standard installation commands).
    - Section: `## Community` (Links to CNCF Panama Chapter: https://community.cncf.io/cloud-native-panama/).

---

**Output Format:** Provide each file content clearly separated, specifying its relative path within the repository. Use placeholders like `[PROJECT_NAME]` where necessary.