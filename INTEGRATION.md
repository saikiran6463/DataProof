# DataProof — Frontend ↔ Backend Integration Plan

**Purpose:** Wire the frontend (Next.js, built by Uma) to the backend (Spring Boot, built by Sai).
**Principle:** One small step → verify → commit → next. Backend changes where possible; frontend only where unavoidable.

---

## Decisions

| Gap | Decision | Why |
|---|---|---|
| Field name mismatches on `POST /api/requests` | Fix backend | Backend is a `Map<String, Object>` — 5 key renames, zero risk |
| `jurisdiction` / `companyType` not sent by frontend | Default in backend (`"EU"`, null) | Frontend form doesn't need those fields |
| `GET /api/requests` missing | **Skip** — leave frontend empty state | Not in the contract; demo is a linear flow, judges won't visit "My Requests" |
| `POST /api/requests/{id}/verify` sends file upload | Fix backend — accept `multipart/form-data`, read as text | Keeps frontend untouched; demo uploads one of the two `.txt` seeded reply files |
| Verify response shape mismatch | Fix frontend — render `checks[]` from backend | Backend response is richer; updating frontend shows per-obligation breakdown with citations — the hero screen judges remember |

---

## Step 1 — Fix `POST /api/requests` field mapping

**Build:**
- `CreateRequestBody.java` — rename field `company` → `companyName`
- `RequestService.createRequest()`:
  - Read `body.getCompanyName()` → set as `request.setCompany(...)`
  - Default `jurisdiction` to `"EU"` if not provided
  - Update response map keys:
    - `requestId` → `id`
    - `law` → `applicableLaw`
    - `draftRequest` → `draftLetter`
    - `contact` → `contactInfo`
    - `obligations` (list of objects) → `rights` (list of label strings only)

**Verify:**
```bash
curl -X POST localhost:8080/api/requests \
  -H "Content-Type: application/json" \
  -d '{"companyName":"FitPulse","goal":"access"}'
```
Response must have: `id`, `applicableLaw`, `draftLetter`, `contactInfo`, `rights` (array of strings).

**Commit:** `fix: map POST /requests fields to frontend contract`

---

## Step 2 — Fix `POST /api/requests/{id}/verify` to accept file upload

**Build:**
- `VerificationService.verify()` — change signature from `(requestId, seededReplyId)` to `(requestId, replyText)`
  - Remove `SeedReplyLoader` call — reply text now comes in directly
  - Keep all verification logic, prompt, LLM call, completeness scoring unchanged
- `RequestController` — change verify endpoint:
  - From: `@RequestBody VerifyRequestBody body`
  - To: `@RequestParam("file") MultipartFile file`
  - Read text: `new String(file.getBytes(), StandardCharsets.UTF_8)`
  - Pass to `verificationService.verify(id, replyText)`
- Add `spring.servlet.multipart.max-file-size=20MB` to `application.properties`

**Verify:**
```bash
curl -X POST localhost:8080/api/requests/{id}/verify \
  -F "file=@backend/src/main/resources/replies/reply_incomplete.txt"
```
Response must have: `requestId`, `completeness`, `verdict`, `summary`, `checks[]`, `recommendedNextStep`.

**Commit:** `fix: verify endpoint accepts file upload instead of seededReplyId`

---

## Step 3 — Update frontend verify screen to render `checks[]`

**Build:** Update `frontend/src/app/request/[id]/verify/page.tsx`:
- Remove references to `completenessScore`, `missingItems`, `fulfilledItems`
- Render the backend response:
  - `completeness` → the score (0–100)
  - `verdict` → "complete" / "incomplete" badge
  - `checks[]` → per-obligation table with status badge (`provided` / `unclear` / `missing`) + note + citation where present
  - `recommendedNextStep` → shown at the bottom
  - `summary` → shown as subtitle

**Verify:** Upload `reply_incomplete.txt` via the frontend UI. The verify screen must show:
- Score: 36%, verdict: incomplete
- Per-obligation rows with status badges
- Citations on recipients and retention rows
- Recommended next step text

Upload `reply_complete.txt` → score 100%, all rows green.

**Commit:** `fix: frontend verify screen renders checks[] from backend`

---

## Demo Run Order

```bash
# Terminal 1 — Backend
cd backend && ./gradlew bootRun

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

Open `http://localhost:3000` and walk through:
1. Home → "New Request" → enter `FitPulse`, select `Access` → submit
2. Review the draft email → click send
3. On verify screen → upload `backend/src/main/resources/replies/reply_incomplete.txt`
4. See: 36% score, incomplete verdict, per-obligation breakdown with citations
5. Re-run verify with `reply_complete.txt` → 100%, all provided

---

## Progress Checklist

- [x] Step 1 — POST /requests field mapping (backend)
- [x] Step 2 — verify endpoint accepts file upload (backend)
- [x] Step 3 — frontend verify screen renders checks[] (frontend)
