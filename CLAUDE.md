# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> The authoritative specs for this repo are:
> - `contract/contract.md` — the locked frontend↔backend API contract (the target to build toward)
> - `backend/BACKEND_BUILD.md` — the ordered build sequence + the progress checklist (where we are)
>
> This file defines *how* you work. Those two define *what* you build.

---

## Tech stack

- **Spring Boot 3.x, Java 17+**, Maven or Gradle
- **H2 in-memory** (`jdbc:h2:mem:...`) — no external DB setup required
- **AWS Bedrock Converse API** via AWS SDK v2 `bedrockruntime` — auth from the standard AWS credential chain (no keys in code)
- **CORS** enabled for the frontend dev origin (`http://localhost:3000`)

Build/run commands (once skeleton exists):
```
# Maven
mvn spring-boot:run
curl localhost:8080/api/health

# Gradle
./gradlew bootRun
```

---

## 1. Session start — every session, silently, in order

1. Read this file.
2. Read `contract/contract.md` — the API shapes are fixed; do not invent endpoints or fields not in it.
3. Read `backend/BACKEND_BUILD.md` — find the **first unchecked step** in the progress checklist.

Then report, concisely:

> **Current step:** [next unchecked step from BACKEND_BUILD.md]
> **Done so far:** [one line]

Then ask: *"Which step are we working on?"* and wait. Do not explore the codebase or write code before the developer answers.

---

## 2. The build loop — one step at a time

This is the core control rule. It keeps the developer reviewing reality, not a wall of code.

- Work on **one `backend/BACKEND_BUILD.md` step per turn.** Never build ahead into the next step.
- Before coding, state in 1–2 sentences what you're about to build.
- **Never auto-run the app and never auto-proceed.** You may compile to confirm it builds; then **stop.**
- After presenting a step, end with: *"Ready to apply? Review, then run the Verify check from BACKEND_BUILD.md."*
- Wait for an explicit signal — "approved" / "next" / "continue" — before starting the next step.
- Never announce several steps and implement them together.

Git is the developer's safety net: each approved step is a commit they can roll back to.

---

## 3. ★ Step 8 — STOP and discuss before building

When the next step is **Step 8 (the verification engine)**, do **not** start coding it.

First, produce a short **context recap** of what Steps 1–7 built that Step 8 depends on:
- the `Request` model and its fields
- the obligation set / rules base (what's loaded, its shape)
- the LLM client (Bedrock Converse) — how prompts are sent and parsed
- the seeded company replies (what they contain)

Then **wait for a design discussion** with the developer on the verification approach — the prompt design, the structured output format, and how `completeness`/`verdict` are computed — *before* writing any code.

Step 8 is the core of the entire product. It gets discussed before it gets built.

---

## 4. Scope guardrails

Build **only** what `contract.md` requires for the demo. Do **not** add, unless explicitly asked:
- auth, users, sessions
- error-handling frameworks, global exception handlers, validation libraries
- pagination, caching, rate limiting
- Postgres / Docker (use embedded **H2**)
- the deletion flow, multiple companies, multiple laws, real email, web search
- tests beyond a step's Verify check

The bar is: **the simplest thing that fulfills the contract.** Real depth goes into Step 8 only.

**New dependencies:** flag any new library by name, say why it's needed, and wait for approval before adding it to the build file.

---

## 5. Coding style (kept light for the hackathon)

- **Readability over cleverness.** Explicit imports at the top; no wildcard imports; no inline fully-qualified names.
- Extract complex conditions into clearly named boolean variables; avoid nested ternaries.
- Keep methods focused on one responsibility.
- **Comments:** one short doc comment per class; a one-liner only on non-obvious methods. Don't over-document.
- **Logging:** log errors and the results of external calls (e.g. the Bedrock LLM call); skip lifecycle noise ("starting X", "done Y").
- **Lombok** is fine for models to cut boilerplate.

---

## 6. Testing (relaxed for the hackathon)

Verification for each step is the **curl check in `backend/BACKEND_BUILD.md`**, not unit tests.
Write a unit test only when the developer explicitly asks; if asked, keep it focused on the critical path — no exhaustive suites.

---

## 7. Session end — "wrap"

When the developer says **"wrap"**: tick the completed steps in the `backend/BACKEND_BUILD.md` checklist and state the single next step. That checklist is the session memory — no separate log file.

---

## 8. Always

- **One question per response, maximum.**
- `contract.md` and `backend/BACKEND_BUILD.md` are the source of truth — never invent endpoints, fields, or shapes not in them.
- If anything is ambiguous, **ask before building** rather than guessing.
- Don't suggest re-architecting decisions already fixed in the contract or build plan.
