# Style Library · Apply Candidate Promote Patch (S9-STORY-007B)

## Purpose

Close the loop from **S9-STORY-005 HTML paste proposal** to **code-backed user_selectable asset** via Cursor-applied patch — not browser file writes.

```text
HTML paste (Workbench)
  → candidate proposal + Cursor patch summary (S9-STORY-005)
  → inspection / promote review (S9-STORY-006 / 007)
  → Cursor apply patch (S9-STORY-007B) ← this story
  → variant definition + style-library asset + evidence + manifest
  → Workbench shows user_selectable
```

## Cursor role

- Reads proposal / patch summary from operator
- Modifies code-backed files (`variants`, `style-library` assets, `manifest`, evidence docs)
- Runs lint / test / build
- Commits on feature branch
- Does **not** merge to sprint without user review

## E2E sample (S9-STORY-007B)

| Item | Value |
|------|-------|
| HTML sample | Teal section label heading (not 006D seeds) |
| variantId | `heading_teal_section_label_html_paste_candidate` |
| assetId | `variant-html-paste-teal-section-label` |
| evidence | `WX-HTML-PASTE-E2E-001` |
| fixture | `tests/fixtures/style-library/s9-story-007b-html-paste-e2e-sample.ts` |

## user_selectable without defaultEligible

- `distribution.userSelectable = true` — operators/users may select in future flows
- `distribution.defaultEligible = false` — not AI/default recommendation eligible
- **Does not** enter `miaopian-classic` or other default preset defaultVariantByBlockType
- Registry patch (if recorded) targets `style_library_inspection_v0` only, **inactive**

## Not release1_required

- Variant status `experimental`
- Not added to `createFirstWaveRequiredVariantRegistry()` / `RELEASE1_REQUIRED_VARIANTS`
- `distribution.release1Required = false`

## Relationship to other stories

| Story | Role |
|-------|------|
| S9-STORY-005 | Browser proposal + patch summary |
| S9-STORY-006 | Preview / Copy / Validator inspection |
| S9-STORY-007 | Promote proposal rules (metadata) |
| S9-STORY-007B | **Apply** code-backed patch |
| S9-STORY-009 | Sprint closeout / E2E audit |

## Matrix row

- **S9M-HTML-PASTE-001** — documents this E2E apply patch path in manifest evidence refs
