import type { StyleLibraryLifecycleState } from "@/core/style-library";

export type StyleLibraryLocale = "zh" | "en";

export const STYLE_LIBRARY_SUPPORTED_LOCALES: StyleLibraryLocale[] = ["zh", "en"];
export const STYLE_LIBRARY_DEFAULT_LOCALE: StyleLibraryLocale = "zh";

export type StyleLibraryDisabledActionCopy = {
  actionId: string;
  label: string;
  disabledReason: string;
  deferredStory: string;
};

export type StyleLibraryUiCopy = {
  workbenchTitle: string;
  workbenchSubtitle: string;
  workbenchDescription: string;
  mode: string;
  runtimeStatus: string;
  libraryIdLabel: string;
  schemaVersionLabel: string;
  updatedAtLabel: string;
  runtimeStatusLabel: string;
  languageToggleLabel: string;
  languageZh: string;
  languageEn: string;
  sectionStatusSummary: string;
  sectionLifecyclePipeline: string;
  sectionCandidateReview: string;
  sectionDiagnostics: string;
  sectionDiagnosticsDescription: string;
  sectionValidationPanel: string;
  sectionAssetList: string;
  sectionPatchList: string;
  sectionEvidenceList: string;
  sectionRuntimeNotice: string;
  summaryTotalAssets: string;
  summarySeedCandidates: string;
  summaryPasteQaPassed: string;
  summaryUserSelectable: string;
  summaryDefaultEligible: string;
  summaryActivePatches: string;
  summaryValidationIssues: string;
  pipelineEmpty: string;
  pipelineAssetsCount: (count: number) => string;
  pipelineSeedBadge: string;
  candidateBlockType: string;
  candidateStyleFamily: string;
  candidateEvidenceCount: string;
  candidateCurrentConclusion: string;
  candidateCurrentConclusionValue: string;
  candidateNextStep: string;
  candidateNextStepHint: string;
  candidateDistributionFlags: string;
  candidateUserSelectable: string;
  candidateDefaultEligible: string;
  candidateRelease1Required: string;
  candidateDisabledActionsTitle: string;
  validationStatus: string;
  validationValid: string;
  validationInvalid: string;
  validationIssueCount: string;
  validationNoIssues: string;
  runtimeNotice: string;
  boolTrue: string;
  boolFalse: string;
  lifecycleRawKeyHint: (lifecycle: StyleLibraryLifecycleState) => string;
  seedBadge: (lifecycle: StyleLibraryLifecycleState) => string;
};

const LIFECYCLE_STATES: StyleLibraryLifecycleState[] = [
  "draft",
  "candidate",
  "validator_pass",
  "paste_qa_pass",
  "user_selectable",
  "default_eligible",
  "deprecated",
];

const LIFECYCLE_LABELS: Record<
  StyleLibraryLocale,
  Record<StyleLibraryLifecycleState, string>
> = {
  zh: {
    draft: "草稿",
    candidate: "候选",
    validator_pass: "校验通过",
    paste_qa_pass: "粘贴 QA 通过",
    user_selectable: "用户可选",
    default_eligible: "可进默认推荐",
    deprecated: "已废弃",
  },
  en: {
    draft: "Draft",
    candidate: "Candidate",
    validator_pass: "Validator Pass",
    paste_qa_pass: "Paste QA Pass",
    user_selectable: "User Selectable",
    default_eligible: "Default Eligible",
    deprecated: "Deprecated",
  },
};

const UI_COPY: Record<StyleLibraryLocale, StyleLibraryUiCopy> = {
  zh: {
    workbenchTitle: "样式管理工作台",
    workbenchSubtitle: "样式资产管理后台 v0",
    workbenchDescription:
      "面向运营管理人员的样式候选池工作台 · 当前仅支持查看与审查，不支持写入。",
    mode: "只读治理模式",
    runtimeStatus: "未接入运行时",
    libraryIdLabel: "样式库 ID",
    schemaVersionLabel: "结构版本",
    updatedAtLabel: "最近更新",
    runtimeStatusLabel: "线上接入状态",
    languageToggleLabel: "语言",
    languageZh: "中文",
    languageEn: "English",
    sectionStatusSummary: "状态概览",
    sectionLifecyclePipeline: "生命周期看板",
    sectionCandidateReview: "候选样式审查",
    sectionDiagnostics: "诊断 / 高级信息",
    sectionDiagnosticsDescription:
      "面向工程排查的原始清单与校验结果，不作为运营主界面。",
    sectionValidationPanel: "校验结果",
    sectionAssetList: "资产列表",
    sectionPatchList: "Registry 补丁列表",
    sectionEvidenceList: "证据列表",
    sectionRuntimeNotice: "运行时提示",
    summaryTotalAssets: "资产总数",
    summarySeedCandidates: "种子候选样式",
    summaryPasteQaPassed: "已通过粘贴 QA 的候选样式",
    summaryUserSelectable: "用户可选",
    summaryDefaultEligible: "可进入默认推荐",
    summaryActivePatches: "已启用补丁",
    summaryValidationIssues: "校验问题",
    pipelineEmpty: "暂无",
    pipelineAssetsCount: (count) => `${count} 个样式`,
    pipelineSeedBadge: "种子样式",
    candidateBlockType: "样式类型",
    candidateStyleFamily: "风格族",
    candidateEvidenceCount: "证据数量",
    candidateCurrentConclusion: "当前结论",
    candidateCurrentConclusionValue: "尚未用户可选 / 尚不可进入默认推荐",
    candidateNextStep: "下一步",
    candidateNextStepHint: "等待生命周期 / 上线审核",
    candidateDistributionFlags: "分发状态",
    candidateUserSelectable: "用户可选",
    candidateDefaultEligible: "可进入默认推荐",
    candidateRelease1Required: "Release 1 必需",
    candidateDisabledActionsTitle: "待启用操作（当前只读）",
    validationStatus: "状态",
    validationValid: "通过",
    validationInvalid: "未通过",
    validationIssueCount: "问题数",
    validationNoIssues: "无校验问题，manifest 通过 schema 与语义检查。",
    runtimeNotice:
      "样式尚未接入线上 Gallery / Preview / Copy。当前工作台仅用于查看候选样式与治理状态，不会影响用户侧默认样式。",
    boolTrue: "是",
    boolFalse: "否",
    lifecycleRawKeyHint: (lifecycle) => lifecycle,
    seedBadge: (lifecycle) => `种子样式 · 候选 · ${lifecycle}`,
  },
  en: {
    workbenchTitle: "Style Library Workbench",
    workbenchSubtitle: "Style Asset Management Console v0",
    workbenchDescription:
      "Operator-facing candidate style pool workbench · read-only review only, no writes.",
    mode: "Read-only governance shell",
    runtimeStatus: "Not connected to runtime",
    libraryIdLabel: "Library ID",
    schemaVersionLabel: "Schema Version",
    updatedAtLabel: "Updated At",
    runtimeStatusLabel: "Runtime Status",
    languageToggleLabel: "Language",
    languageZh: "中文",
    languageEn: "English",
    sectionStatusSummary: "Status Summary",
    sectionLifecyclePipeline: "Lifecycle Pipeline",
    sectionCandidateReview: "Candidate Review",
    sectionDiagnostics: "Diagnostics / Advanced",
    sectionDiagnosticsDescription:
      "Raw manifest tables for engineering inspection, not the primary operator view.",
    sectionValidationPanel: "Validation Panel",
    sectionAssetList: "Asset List",
    sectionPatchList: "Registry Patch List",
    sectionEvidenceList: "Evidence List",
    sectionRuntimeNotice: "Runtime Notice",
    summaryTotalAssets: "Total assets",
    summarySeedCandidates: "Seed candidates",
    summaryPasteQaPassed: "Candidate / Paste QA passed",
    summaryUserSelectable: "User selectable",
    summaryDefaultEligible: "Default eligible",
    summaryActivePatches: "Active patches",
    summaryValidationIssues: "Validation issues",
    pipelineEmpty: "Empty",
    pipelineAssetsCount: (count) => `${count} assets`,
    pipelineSeedBadge: "Seed",
    candidateBlockType: "Block type",
    candidateStyleFamily: "Style family",
    candidateEvidenceCount: "Evidence count",
    candidateCurrentConclusion: "Current conclusion",
    candidateCurrentConclusionValue: "Not user selectable / Not default eligible",
    candidateNextStep: "Next step",
    candidateNextStepHint: "Needs lifecycle / promote review",
    candidateDistributionFlags: "Distribution flags",
    candidateUserSelectable: "User selectable",
    candidateDefaultEligible: "Default eligible",
    candidateRelease1Required: "Release 1 required",
    candidateDisabledActionsTitle: "Actions (disabled)",
    validationStatus: "Status",
    validationValid: "valid",
    validationInvalid: "invalid",
    validationIssueCount: "Issue count",
    validationNoIssues:
      "No validation issues. Manifest passes schema and semantic checks.",
    runtimeNotice:
      "Styles are not connected to Gallery / Preview / Copy runtime. This workbench is read-only and does not affect user-facing defaults.",
    boolTrue: "true",
    boolFalse: "false",
    lifecycleRawKeyHint: (lifecycle) => lifecycle,
    seedBadge: (lifecycle) => `seed · candidate · ${lifecycle}`,
  },
};

const DISABLED_ACTIONS: Record<
  StyleLibraryLocale,
  StyleLibraryDisabledActionCopy[]
> = {
  zh: [
    {
      actionId: "validate",
      label: "校验",
      disabledReason: "预览 / 复制 / 校验集成将在 S9-STORY-006 实现",
      deferredStory: "S9-STORY-006",
    },
    {
      actionId: "review-evidence",
      label: "查看证据",
      disabledReason: "生命周期写入将在 S9-STORY-004 实现",
      deferredStory: "S9-STORY-004",
    },
    {
      actionId: "promote-user-selectable",
      label: "加入用户可选",
      disabledReason: "上线到用户可选将在 S9-STORY-007 实现",
      deferredStory: "S9-STORY-007",
    },
    {
      actionId: "mark-default-eligible",
      label: "标记为可默认推荐",
      disabledReason: "上线到用户可选将在 S9-STORY-007 实现",
      deferredStory: "S9-STORY-007",
    },
  ],
  en: [
    {
      actionId: "validate",
      label: "Validate",
      disabledReason: "renderer / validator integration · S9-STORY-006",
      deferredStory: "S9-STORY-006",
    },
    {
      actionId: "review-evidence",
      label: "Review Evidence",
      disabledReason: "lifecycle write · S9-STORY-004",
      deferredStory: "S9-STORY-004",
    },
    {
      actionId: "promote-user-selectable",
      label: "Promote to User Selectable",
      disabledReason: "promote · S9-STORY-007",
      deferredStory: "S9-STORY-007",
    },
    {
      actionId: "mark-default-eligible",
      label: "Mark Default Eligible",
      disabledReason: "promote · S9-STORY-007",
      deferredStory: "S9-STORY-007",
    },
  ],
};

export function resolveStyleLibraryLocale(
  input?: string | null,
): StyleLibraryLocale {
  return input === "en" ? "en" : STYLE_LIBRARY_DEFAULT_LOCALE;
}

export function getStyleLibraryUiCopy(
  locale: StyleLibraryLocale = STYLE_LIBRARY_DEFAULT_LOCALE,
): StyleLibraryUiCopy {
  return UI_COPY[locale];
}

export function getLifecycleDisplayLabel(
  locale: StyleLibraryLocale,
  lifecycle: StyleLibraryLifecycleState,
): string {
  return LIFECYCLE_LABELS[locale][lifecycle];
}

export function getLifecycleDisplayLabels(
  locale: StyleLibraryLocale,
): Record<StyleLibraryLifecycleState, string> {
  return LIFECYCLE_LABELS[locale];
}

export function getCandidateDisabledActions(
  locale: StyleLibraryLocale,
): StyleLibraryDisabledActionCopy[] {
  return DISABLED_ACTIONS[locale];
}

export function getAllLifecycleStates(): StyleLibraryLifecycleState[] {
  return [...LIFECYCLE_STATES];
}
