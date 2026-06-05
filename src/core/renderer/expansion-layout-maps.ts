/**
 * Maps all release1_required variant ids → renderer layout kinds.
 * @see DECISION-083 expansion variants
 */

import type { CtaLayoutKind } from "./cta-layout";
import type { DividerLayoutKind } from "./divider-layout";
import type { HighlightLayoutKind } from "./highlight-layout";
import type { ImagePlaceholderLayoutKind } from "./image-placeholder-layout";
import type { InfoCardLayoutKind } from "./info-card-layout";
import type { ListLayoutKind } from "./list-layout";
import type { QuoteLayoutKind } from "./quote-layout";
import type { TextBlockLayoutKind } from "./text-block-typography";

export const TEXT_BLOCK_VARIANT_LAYOUT: Record<string, TextBlockLayoutKind> = {
  lead_plain_intro: "plain",
  lead_accent_band: "accent_band",
  lead_quote_intro: "quote_intro",
  lead_business_brief: "accent_band",
  lead_warm_story: "quote_intro",
  lead_magazine_pull: "plain",
  lead_keynote_hook: "accent_band",
  lead_notebook_highlight: "soft_card",
  lead_dense_summary: "plain",
  paragraph_plain_body: "plain",
  paragraph_accent_left: "accent_left",
  paragraph_soft_card: "soft_card",
  paragraph_compact_rhythm: "plain",
  paragraph_indent_classic: "accent_left",
  paragraph_highlight_inline: "accent_band",
  paragraph_magazine_measure: "plain",
  paragraph_notebook_margin: "soft_card",
  paragraph_callout_soft: "soft_card",
};

export const DIVIDER_VARIANT_LAYOUT: Record<string, DividerLayoutKind> = {
  divider_simple_line: "simple_line",
  divider_dotted_line: "dotted_line",
  divider_section_space: "section_space",
  divider_dash_editorial: "dotted_line",
  divider_hair_keynote: "simple_line",
  divider_dot_warm: "dotted_line",
  divider_short_accent: "simple_line",
  divider_space_wide: "section_space",
  divider_label_center: "simple_line",
};

export const LIST_VARIANT_LAYOUT: Record<string, ListLayoutKind> = {
  list_plain_bullets: "plain_bullets",
  list_numbered_steps: "numbered_steps",
  list_checklist_cards: "checklist_cards",
  list_compact_bullets: "plain_bullets",
  list_step_cards: "numbered_steps",
  list_icon_bullets: "plain_bullets",
  list_two_column: "plain_bullets",
  list_priority_stack: "numbered_steps",
  list_timeline_markers: "checklist_cards",
};

export const QUOTE_VARIANT_LAYOUT: Record<string, QuoteLayoutKind> = {
  quote_plain: "plain",
  quote_left_bar: "left_bar",
  quote_card: "card",
  quote_soft_card: "card",
  quote_center_mark: "plain",
  quote_label_chip: "left_bar",
  quote_dark_band: "card",
  quote_minimal_serif: "plain",
  quote_brand_callout: "left_bar",
};

export const HIGHLIGHT_VARIANT_LAYOUT: Record<string, HighlightLayoutKind> = {
  highlight_inline_emphasis: "inline_emphasis",
  highlight_accent_band: "accent_band",
  highlight_soft_card: "soft_card",
  highlight_marker_warm: "inline_emphasis",
  highlight_flat_business: "accent_band",
  highlight_border_glow: "soft_card",
  highlight_notebook: "soft_card",
  highlight_keynote_box: "accent_band",
  highlight_tip_pill: "inline_emphasis",
};

export const INFO_CARD_VARIANT_LAYOUT: Record<string, InfoCardLayoutKind> = {
  info_card_key_takeaway: "key_takeaway",
  info_card_steps: "steps",
  info_card_warning_note: "warning_note",
  info_card_method_steps: "steps",
  info_card_insight_band: "key_takeaway",
  info_card_case_study: "key_takeaway",
  info_card_checklist: "steps",
  info_card_data_snapshot: "key_takeaway",
  info_card_soft_banner: "warning_note",
  info_card_reading_path_candidate: "key_takeaway",
};

export const CTA_VARIANT_LAYOUT: Record<string, CtaLayoutKind> = {
  cta_plain_text: "plain_text",
  cta_button_like: "button_like",
  cta_qr_placeholder: "qr_placeholder",
  cta_soft_banner: "button_like",
  cta_summary_band: "plain_text",
  cta_checklist_footer: "plain_text",
  cta_dual_action: "button_like",
  cta_minimal_link: "plain_text",
  cta_card_promo: "button_like",
};

export const IMAGE_PLACEHOLDER_VARIANT_LAYOUT: Record<string, ImagePlaceholderLayoutKind> =
  {
    image_placeholder_simple: "simple",
    image_placeholder_caption: "caption",
    image_placeholder_card: "card",
    image_placeholder_full_bleed: "card",
    image_placeholder_minimal_frame: "simple",
    image_placeholder_polaroid: "caption",
    image_placeholder_editorial: "card",
    image_placeholder_product: "simple",
    image_placeholder_hero_band: "card",
  };
