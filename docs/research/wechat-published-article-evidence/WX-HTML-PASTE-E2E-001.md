# WX-HTML-PASTE-E2E-001 · S9-STORY-007B HTML Paste Apply Patch Evidence

## Summary

| Field | Value |
|-------|-------|
| evidenceId | `WX-HTML-PASTE-E2E-001` |
| sourceType | `pasted_html` |
| blockType | `heading` |
| variantId | `heading_teal_section_label_html_paste_candidate` |
| assetId | `variant-html-paste-teal-section-label` |
| lifecycle | `user_selectable` |
| userSelectable | `true` |
| defaultEligible | `false` |
| release1Required | `false` |
| default preset | **否** |
| paste QA | E2E operator review (`PASTE-QA-E2E-007B`) |

## Original HTML fragment

```html
<p style="margin:0 0 6px"><span style="display:inline-block;background-color:#0d9488;color:#ffffff;font-size:11px;font-weight:700;padding:2px 10px;letter-spacing:1px">SECTION 02</span></p><h3 style="margin:0;font-size:17px;font-weight:700;color:#1f2937">运营增长指南</h3>
```

## Extracted style features (minimal)

- tagName: `p`, `span`, `h3`
- inline style on label span: `background-color:#0d9488`, `color:#ffffff`, `font-size:11px`, `font-weight:700`, `padding:2px 10px`, `letter-spacing:1px`, `display:inline-block`
- heading: `font-size:17px`, `font-weight:700`, `color:#1f2937`
- risky CSS: inline-block label (retained with evidence)
- forbidden CSS: none detected

## Validator result summary

- WeChat copy-safe validator: **PASS** (strict inline path)
- Promote readiness: applied as `user_selectable` via S9-STORY-007B Cursor patch
- Does **not** enter default preset or `createFirstWaveRequiredVariantRegistry()`

## Operator notes

- Generated from S9-STORY-005 HTML paste proposal workflow
- Applied by Cursor in S9-STORY-007B (code-backed files + commit)
- Not an S8 006D harvest seed (`heading_purple_chapter_label_candidate` / `info_card_reading_path_candidate`)
