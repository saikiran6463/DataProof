# DataProof Backend — Incremental Build Plan

**For:** Sai, driving Claude Code · **Builds toward:** `contract/contract.md`
**Principle:** one small step → *you* verify → commit → next. Never let more than one step run unreviewed.

---

## How to use this with Claude Code

1. At the start of the session, give Claude Code this file **and** `contract/contract.md` as context.
2. Tell it: *"Do Step N only, then stop so I can verify. Do not start the next step."*
3. Review the diff. Run the **Verify** command yourself. Confirm it passes.
4. If green → **commit** (message suggested per step). If not → fix or revert, don't move on.
5. Only then: *"Proceed to Step N+1."*

Git is your control surface: each green step is a checkpoint you can roll back to.

---

## Scope guardrails (tell Claude Code these up front)

Build **only** what the contract needs for the demo. Do **not** add, unless asked:
- authentication, users, or sessions
- error-handling frameworks, global exception handlers, validation libraries
- pagination, caching, rate limiting
- Postgres/Docker (use embedded **H2** to avoid setup)
- the deletion flow, multiple companies, multiple laws, real email, web search
- tests beyond what a step's Verify needs (a hackathon, not production)

Keep it the **simplest thing that fulfills the contract.** Depth goes into Step 8 (verification).

---

## Tech baseline

- **Spring Boot 3.x, Java 17+**, Maven or Gradle (your choice)
- Dependencies: Spring Web, Spring Data JPA, H2 (embedded), AWS SDK v2 `bedrockruntime`
- Database: **H2 in-memory** (`jdbc:h2:mem:...`) — ephemeral is fine (each demo run creates a fresh request; the rules base + seeded replies load from resource files, not the DB). Optional: H2 **file mode** (`jdbc:h2:file:./data/dataproof`) for dev-time persistence — a one-line URL change, no external setup.
- LLM calls: **AWS Bedrock Converse API** via the AWS SDK (`BedrockRuntimeClient`), placed **behind a small `LlmClient` interface** so the implementation can be swapped if needed.
- **Auth via the standard AWS credential chain** (your configured AWS profile / IAM) — no key in code, nothing committed. Confirm the target **region has Claude model access enabled** in the Bedrock console before building.
- Enable **CORS** for the frontend dev origin (e.g. `http://localhost:3000`)

---

## The build sequence

### Step 1 — Project skeleton + health check
- **Build:** Spring Boot app, `GET /api/health` → `{"status":"ok"}`, CORS enabled for the frontend origin.
- **Verify:** `curl localhost:8080/api/health` returns 200 with the JSON.
- **Commit:** `chore: spring boot skeleton + health check`

### Step 2 — Data model + repository
- **Build:** a `Request` entity (id, company, goal, jurisdiction, law, status, timestamps, and room for obligations/draft) + a JPA repository, backed by H2. Status as an enum: `DRAFT, SENT, REPLY_RECEIVED, VERIFIED`.
- **Verify:** app boots, H2 schema is created (check logs / H2 console). A quick repository save+findById works (a throwaway test or temporary line is fine).
- **Commit:** `feat: request entity + H2 repository`

### Step 3 — LLM client behind an interface (Bedrock Converse)
- **Build:** an `LlmClient` interface with a single `complete(prompt) -> text` method, plus a Bedrock implementation using `BedrockRuntimeClient` and the **Converse API**. Pick a reasoning-capable Claude model available in your region; auth comes from the standard AWS credential chain.
- **Verify:** a temporary `/api/_debug/llm?q=hello` (or a one-off test) returns a real Bedrock response. **Remove the debug route before committing** if you added one.
- **Commit:** `feat: llm client (bedrock converse) behind interface`

### Step 4 — Rules base (GDPR access obligations)
- **Build:** a JSON resource file (e.g. `resources/rules/gdpr-access.json`) holding the obligation list from the contract (profile, activity, billing, health, location, recipients+citation, retention+citation) + a loader that reads it.
- **Verify:** loaded obligations are returned/logged and match the contract's list exactly.
- **Commit:** `feat: gdpr access rules base + loader`

### Step 5 — `POST /api/requests` (rights + draft)
- **Build:** the endpoint. Pick law from jurisdiction (EU→GDPR), attach the obligation set, set the hardcoded contact + `deadlineDays: 30`, generate `draftRequest` via the `LlmClient`, persist as `DRAFT`, return the full contract response.
- **Verify:** `curl -X POST .../api/requests` with the contract's body returns the exact response shape — obligations present, a real drafted request, status `draft`.
- **Commit:** `feat: POST /requests — rights + draft`

### Step 6 — `POST /api/requests/{id}/send` (simulate)
- **Build:** transition the request to `SENT`, set `sentAt` + `dueBy`, return per contract. No real email.
- **Verify:** `curl -X POST .../api/requests/{id}/send` returns status `sent` with timestamps; a second `GET`/log confirms the state changed.
- **Commit:** `feat: POST /send — simulated send`

### Step 7 — Seed replies + `GET /api/seed/replies`
- **Build:** two seeded FitPulse reply texts (one **typical/incomplete**, one **fully compliant**) as resource files, plus the list endpoint returning their ids + labels.
- **Verify:** `curl .../api/seed/replies` returns both entries matching the contract.
- **Commit:** `feat: seeded company replies`

### Step 8 — `POST /api/requests/{id}/verify` — **THE CORE**
- **Build:** the verification engine. Given a `seededReplyId`, load that reply text + the obligation set, prompt the LLM (via `LlmClient`) to return — **per obligation** — a `status` (`provided|unclear|missing`) and a short `note` (with citation where relevant), grounded in the reply vs the GDPR rule. Parse into the contract's `checks[]`, compute `completeness` + `verdict` + `summary` + `recommendedNextStep`. Persist `VERIFIED`.
- **Verify:** `curl -X POST .../api/requests/{id}/verify` with `reply_incomplete` returns a sensible report (some provided, some missing/unclear, citations on recipients/retention); with `reply_complete` returns near-100%. Eyeball that the reasoning is correct.
- **Commit:** `feat: verification engine`

### Step 9 — Harden the verification engine
- **Build:** force **structured JSON output** from the model and validate it; on malformed output, retry once. Set **temperature 0** (via the Converse `inferenceConfig`) for repeatability. Make `recommendedNextStep` derive from the actual missing items.
- **Verify:** run `/verify` ~5 times on the same reply — results are stable and never malformed.
- **Commit:** `feat: harden verification (structured output, temp 0, retry)`

---

## Optional / stretch (only if the 9 steps are solid and tested)

- `GET /api/requests/{id}` — fetch full request (for browser refresh; not in the happy path).
- File upload + **Apache Tika** parsing → feed real PDF/CSV reply text into `/verify`.
- Real web-search contact discovery; real email send to a test inbox.

---

## Progress checklist

- [x] 1 — skeleton + health
- [x] 2 — entity + repo
- [x] 3 — llm client (bedrock converse)
- [x] 4 — rules base
- [x] 5 — POST /requests
- [x] 6 — POST /send
- [x] 7 — seed replies
- [x] 8 — verification engine ★
- [x] 9 — harden verification

**Demo-critical path:** steps 1–8 must work end-to-end. Step 9 makes it stage-safe. Everything else is optional.
