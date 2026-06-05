# Style Library User-selectable Preview Picker (S9-STORY-007C)

> **Status:** Active · Sprint 9  
> **Related:** S9-STORY-007B · S9-STORY-009 (closeout blocked until 007C merged)

## Goal

Expose `user_selectable` style-library variants on the **user preview page** manual style picker, without polluting default generation, default preset, or Release 1 required paths.

## Scope

### In scope

- Preview page heading style select (`PreviewStyleControls`)
- Manual override via `headingVariantId`
- Preview render + Copy HTML when user selects a `user_selectable` variant
- Style library manifest as source of user-selectable pool metadata

### Out of scope

- Gallery preset pools
- AI / generation default selection
- `defaultEligible` / `release1_required` promotion
- `/dev/style-library` Workbench changes (already shows metadata)

## Architecture

```text
StyleLibraryManifest (lifecycle=user_selectable)
  → user-selectable-preview-pool.ts
  → PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS
  → PreviewStyleControls (manual picker)

User selects variant
  → applyHeadingVariantToArticle (blockOverrides)
  → createUserPreviewStyleRegistry (resolve only)
  → renderUserPreviewBlock / buildUserPreviewClipboardPayload
  → inspection-render-adapter for html-paste candidates
```

Generation path still uses `createFirstWaveRequiredVariantRegistry()` only.

## Boundaries

| Path | html-paste user_selectable variant |
|------|-------------------------------------|
| User preview picker | ✅ visible · manual only |
| User preview render/copy | ✅ via user-preview adapter |
| `/dev/style-library` | ✅ metadata unchanged |
| Gallery pools | ❌ |
| Default preset | ❌ |
| AI generation pick | ❌ |
| `TITLE_BLOCK_SUPPORTED_VARIANT_IDS` | ❌ |
| `createFirstWaveRequiredVariantRegistry()` | ❌ |

## E2E sample (007B)

- variantId: `heading_teal_section_label_html_paste_candidate`
- assetId: `variant-html-paste-teal-section-label`
- evidence: `WX-HTML-PASTE-E2E-001`

## S9-STORY-009 impact

Prior closeout audit validated Workbench + style-library metadata only. PO clarified acceptance requires **user preview picker** visibility. S9-STORY-009 audit branch remains unmerged until 007C merges and closeout re-runs.
