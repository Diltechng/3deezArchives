Coding Standard for Interns – Gallery System
Purpose

This document explains how interns should write, organize, and manage code while building the Gallery System. The goal is to produce clean, readable, maintainable software as a team.

1. General Rules

All code must be easy to read and understand by another developer. Write simple solutions instead of clever or complex ones. Consistency is more important than personal style. If you are unsure about an approach, ask before implementing it.

Broken or untested code must never be pushed to the main branch.

2. Project Organization

Each feature must be placed in its own folder. Files should be grouped by responsibility such as controllers, services, data transfer objects, and database models.

Frontend components should also follow a clear structure where UI, logic, and data access are separated.

Avoid placing unrelated files in the same folder.

3. Naming Rules

Names must clearly describe what something does.

Variables and functions should use simple, meaningful names. Avoid short or unclear names like “x”, “data1”, or “temp”.

Class names and components should start with capital letters. File names should be lowercase and separated with hyphens.

Database fields should use clear, readable names and follow one consistent style.

4. Code Readability

Code should be formatted consistently across the project. Keep lines short and avoid writing too much logic in one place.

Always use clear blocks for conditions and loops. Do not rely on shortcuts that reduce readability.

Remove unused variables, unused imports, and commented-out code before submitting.

5. Comments and Documentation

Comments should explain why something is done, not what is obvious from reading the code.

Every major file or module should have a short description explaining its purpose.

Avoid excessive commenting. Good naming should remove the need for most comments.

6. API Design Rules

APIs must follow REST principles and use meaningful endpoint names.

Each endpoint should do one thing and do it well. Use the correct HTTP method for each action.

Never use an endpoint that modifies data without proper validation.

7. Validation and Error Handling

All user input must be validated. Never assume data coming from the frontend is safe or correct.

Error messages should be clear and helpful but must not expose internal system details.

Every possible failure case should be handled gracefully.

8. Database Guidelines

Each table must include identifiers and timestamps. Data relationships should be clearly defined.

Avoid deleting data permanently unless absolutely necessary. Prefer marking data as inactive where possible.

Never hardcode IDs or database values inside the application logic.

9. Frontend Guidelines

Components should have a single responsibility. Large components must be broken into smaller ones.

UI logic, API calls, and utility functions should not be mixed together.

Avoid unnecessary global state. Keep state close to where it is used.

10. Image and File Handling

Only allow supported image formats and enforce size limits.

Never trust file names uploaded by users. Always validate and sanitize inputs.

Images should be stored securely, and only references or URLs should be saved in the database.

11. Git and Collaboration Rules

Each task must be done on a separate branch with a clear name.

Commit messages should describe what was done in simple language.

Sensitive files such as environment variables must never be committed.

All changes must be reviewed before merging into the main branch.

12. Code Review Expectations

Before submitting work, ensure the project runs correctly and meets all requirements.

Remove debug logs and test artifacts.

Code that does not follow this standard may be rejected.

13. Prohibited Practices

Interns must not copy code without understanding it.

Interns must not skip validation or error handling.

Interns must not push directly to the main branch.

Interns must not hide mistakes. Report issues early.

Final Note

Clean, readable code is more important than speed.
Your code should be understandable by someone else even months later.
