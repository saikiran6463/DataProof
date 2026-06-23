# DataProof — Frontend ↔ Backend Contract

**Authored by:** Sai · **To be ratified by:** Sai + Uma
**Status:** proposed → once you both agree, this is the boundary and changes only by mutual consent.

---

## What this document is

This is the single agreement that lets the **frontend (Uma)** and the **backend (Sai)** build
**independently and in parallel**, then connect with minimal friction.

The rule is simple:
- The **backend promises** to accept these requests and return these responses.
- The **frontend promises** to call them this way and render whatever comes back.

As long as both sides honor this file, integration is mostly "point the frontend at the real
backend URL" — not a painful merge. Until then, Uma builds against **mock data shaped like the
responses below**, and Sai builds endpoints testable with curl/Postman before any UI exists.

Base URL: `/api` · all JSON · the demo scenario is **FitPulse / GDPR / access request**.

---

## The mental model: one request moving through four states

```
draft  ──send──▶  sent  ──reply arrives──▶  reply_received  ──verify──▶  verified
```

Every screen and every endpoint maps onto this lifecycle. That shared picture is the most
important thing to agree on — the endpoints just move a request from one state to the next.

---

## The endpoints

### 1. `POST /api/requests` — start a request (rights + draft)
The user has picked a company and a goal. The backend works out the law, the obligations the
company owes, and drafts the request.

```jsonc
// Frontend sends:
{ "company": "FitPulse", "companyType": "fitness app",
  "goal": "access", "jurisdiction": "EU" }

// Backend returns:
{
  "requestId": "req_abc123",
  "law": "GDPR",
  "contact": "privacy@fitpulse.example",
  "deadlineDays": 30,
  "status": "draft",
  "obligations": [
    { "id": "profile",    "label": "Account & profile data" },
    { "id": "activity",   "label": "Workout & activity history" },
    { "id": "billing",    "label": "Payment & billing records" },
    { "id": "health",     "label": "Health metrics (heart rate, weight)" },
    { "id": "location",   "label": "Location / GPS history" },
    { "id": "recipients", "label": "Who your data was shared with", "citation": "GDPR Art. 15(1)(c)" },
    { "id": "retention",  "label": "How long they keep your data",  "citation": "GDPR Art. 15(1)(d)" }
  ],
  "draftRequest": "Dear FitPulse Privacy Team, under Article 15 of the GDPR ..."
}
```
- **Frontend builds:** Screen 1 (pick company + goal form) → Screen 2 (show the law, the list
  of obligations with citations, and the drafted request text).
- **Backend builds:** pick the law from jurisdiction, load the obligation set from the rules
  base, generate the draft request via Claude.

---

### 2. `POST /api/requests/{id}/send` — simulate sending
The user clicks "Send". No real email — the request just moves to `sent`.

```jsonc
// Backend returns:
{ "requestId": "req_abc123", "status": "sent",
  "sentAt": "2026-06-20T10:00:00Z", "dueBy": "2026-07-20" }
```
- **Frontend builds:** the Send button → a "sent, awaiting reply" state.
- **Backend builds:** the state transition + timestamps.

---

### 3. `GET /api/seed/replies` — the demo reply options
The company's reply is pre-seeded so the demo never breaks. This returns the choices.

```jsonc
// Backend returns:
[ { "id": "reply_incomplete", "label": "FitPulse reply (typical)" },
  { "id": "reply_complete",   "label": "FitPulse reply (fully compliant)" } ]
```
- **Frontend builds:** Screen 4 — a picker to choose which reply "came back".
- **Backend builds:** the seeded replies + this list endpoint.

---

### 4. `POST /api/requests/{id}/verify` — **the core, runs live**
The reply is checked against every obligation, live, by Claude. This is the showpiece.

```jsonc
// Frontend sends:
{ "seededReplyId": "reply_incomplete" }

// Backend returns:
{
  "requestId": "req_abc123",
  "completeness": 55,
  "verdict": "incomplete",
  "summary": "3 required items missing, 1 unclear",
  "checks": [
    { "obligation": "Account & profile data", "status": "provided", "note": "Name, email, DOB included." },
    { "obligation": "Health metrics",          "status": "unclear",  "note": "Only last 30 days returned." },
    { "obligation": "Who your data was shared with", "status": "missing",
      "note": "No third-party list given.", "citation": "GDPR Art. 15(1)(c)" }
    // ... one entry per obligation
  ],
  "recommendedNextStep": "Send a follow-up citing GDPR Art. 15(1)(c) & (d) ..."
}
```
`status` is one of: `provided` · `unclear` · `missing`.

- **Frontend builds:** Screen 5 — the verification report (the hero screen): one row per check
  with a status badge, the completeness score, and the recommended next step. *This is the
  screen judges remember — match the mockup.*
- **Backend builds:** the verification engine — prompt Claude to evaluate each obligation
  against the reply, return this structured result.

---

## Who owns what, once we ratify this

**Uma (frontend)** builds five screens, each against the responses above, using mocks first:
1. Pick company & goal → 2. Rights + draft → 3. Send → 4. Pick reply → 5. **Verification report.**

**Sai (backend)** builds the endpoints that fulfill them, the rules base, the Claude
integration, and — the priority — the **verification engine** behind `/verify`.

**Both** agree on: the base URL, JSON, the request lifecycle, and the field names shown above.

---

## What this contract deliberately leaves out

To avoid burning time we don't have, the demo does **not** specify error formats, auth,
pagination, or validation rules. If something fails, the simplest handling is fine. The only
things that *must* be locked are the four endpoints and their shapes above — everything else
can be decided in code.

---

## Optional (not in the happy path — build only if there's spare time)

`GET /api/requests/{id}` — fetch a full request object by id. The linear demo never needs this,
because each action's response already hands the frontend what the next screen needs. It only
matters for browser refresh, returning later, or polling for an async reply — none of which
happen in a single straight-through demo. Cheap to add once the data model exists, so it's a
nice-to-have, not a core build.
