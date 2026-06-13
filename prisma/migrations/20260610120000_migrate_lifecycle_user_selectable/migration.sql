-- S11-STORY-003A: lifecycle user_selectable is a governance stage label only.
-- User-side pool visibility is distribution.userSelectable (already set on promote/import).

UPDATE style_variants
SET lifecycle = 'paste_qa_pass'
WHERE lifecycle = 'user_selectable';

UPDATE style_variant_lifecycle_events
SET to_lifecycle = 'paste_qa_pass'
WHERE to_lifecycle = 'user_selectable';

UPDATE style_variant_lifecycle_events
SET from_lifecycle = 'paste_qa_pass'
WHERE from_lifecycle = 'user_selectable';

UPDATE style_variant_promote_records
SET to_lifecycle = 'paste_qa_pass'
WHERE to_lifecycle = 'user_selectable';

UPDATE style_variant_promote_records
SET from_lifecycle = 'paste_qa_pass'
WHERE from_lifecycle = 'user_selectable';
