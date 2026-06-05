import { LIFECYCLE_BLOCK_REASON_CODES } from "@/core/style-library";
import type {
  StyleLibraryAsset,
  StyleLibraryLifecycleState,
} from "@/core/style-library";

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
  sectionLifecycleManagement: string;
  lifecycleCurrentState: string;
  lifecycleStatusExplanation: string;
  lifecycleNextStepSuggestion: string;
  lifecycleBlockedReason: string;
  lifecycleRequiredEvidence: string;
  lifecycleLinkedStory: string;
  lifecycleRuntimeImpact: string;
  lifecycleAllowedTransitions: string;
  lifecycleBlockedTransitions: string;
  lifecycleProposalPreview: string;
  lifecycleDistributionImpact: string;
  lifecycleTransitionPanelHint: string;
  lifecycleColumnMeaning: string;
  lifecycleColumnNextAction: string;
  lifecycleProposalAllowed: string;
  lifecycleProposalBlocked: string;
  lifecycleNoRuntimeChange: string;
  sectionInspectionSummary: string;
  summaryAutoValidationPassed: string;
  summaryNeedsPasteQa: string;
  summaryReadyForPromoteReview: string;
  summaryBlockedCandidates: string;
  sectionPreviewCopyValidator: string;
  inspectionPreviewTitle: string;
  inspectionCopyTitle: string;
  inspectionValidatorTitle: string;
  inspectionPromoteReadinessTitle: string;
  inspectionFixtureLabel: string;
  inspectionPreviewStatus: string;
  inspectionCopyStatus: string;
  inspectionInlineStyle: string;
  inspectionForbiddenCapability: string;
  inspectionRiskyCapability: string;
  inspectionIssueCount: string;
  inspectionBlockerCount: string;
  inspectionWarningCount: string;
  inspectionOperatorConclusion: string;
  inspectionPromoteReady: string;
  inspectionPromoteNotReady: string;
  inspectionNextStory: string;
  inspectionRawCopyHtml: string;
  inspectionRawValidatorIssues: string;
  previewStatusOk: string;
  previewStatusError: string;
  copyStatusOk: string;
  copyStatusError: string;
  promoteReadyLabel: string;
  promoteNotReadyLabel: string;
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
    sectionLifecycleManagement: "生命周期管理",
    lifecycleCurrentState: "当前状态",
    lifecycleStatusExplanation: "状态说明",
    lifecycleNextStepSuggestion: "下一步建议",
    lifecycleBlockedReason: "当前限制",
    lifecycleRequiredEvidence: "关联证据",
    lifecycleLinkedStory: "后续 Story",
    lifecycleRuntimeImpact: "运行时影响",
    lifecycleAllowedTransitions: "允许的流转（提案预览）",
    lifecycleBlockedTransitions: "受阻的流转",
    lifecycleProposalPreview: "Lifecycle Change Proposal 预览",
    lifecycleDistributionImpact: "分发影响",
    lifecycleTransitionPanelHint:
      "以下为模拟提案预览，不会写入 manifest，也不会修改 runtime。",
    lifecycleColumnMeaning: "业务含义",
    lifecycleColumnNextAction: "下一步动作",
    lifecycleProposalAllowed: "可生成提案",
    lifecycleProposalBlocked: "当前受阻",
    lifecycleNoRuntimeChange: "无运行时影响",
    sectionInspectionSummary: "检查概览",
    summaryAutoValidationPassed: "自动校验通过",
    summaryNeedsPasteQa: "需要粘贴 QA",
    summaryReadyForPromoteReview: "可进入上线审核",
    summaryBlockedCandidates: "阻塞候选样式",
    sectionPreviewCopyValidator: "Preview / Copy / Validator",
    inspectionPreviewTitle: "样式预览",
    inspectionCopyTitle: "Copy HTML",
    inspectionValidatorTitle: "WeChat 校验",
    inspectionPromoteReadinessTitle: "上线审核就绪度",
    inspectionFixtureLabel: "检查样本",
    inspectionPreviewStatus: "预览状态",
    inspectionCopyStatus: "Copy 状态",
    inspectionInlineStyle: "使用 inline style",
    inspectionForbiddenCapability: "命中 forbidden 能力",
    inspectionRiskyCapability: "命中 risky 能力",
    inspectionIssueCount: "问题总数",
    inspectionBlockerCount: "阻塞项",
    inspectionWarningCount: "警告项",
    inspectionOperatorConclusion: "运营结论",
    inspectionPromoteReady: "可进入 S9-STORY-007 上线审核",
    inspectionPromoteNotReady: "暂不可进入上线审核",
    inspectionNextStory: "下一步 Story",
    inspectionRawCopyHtml: "原始 Copy HTML",
    inspectionRawValidatorIssues: "原始校验问题",
    previewStatusOk: "预览成功",
    previewStatusError: "预览失败",
    copyStatusOk: "Copy 生成成功",
    copyStatusError: "Copy 生成失败",
    promoteReadyLabel: "可进入上线审核",
    promoteNotReadyLabel: "暂不可进入上线审核",
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
    sectionLifecycleManagement: "Lifecycle Management",
    lifecycleCurrentState: "Current state",
    lifecycleStatusExplanation: "Status explanation",
    lifecycleNextStepSuggestion: "Next step",
    lifecycleBlockedReason: "Current restriction",
    lifecycleRequiredEvidence: "Linked evidence",
    lifecycleLinkedStory: "Future story",
    lifecycleRuntimeImpact: "Runtime impact",
    lifecycleAllowedTransitions: "Allowed transitions (proposal preview)",
    lifecycleBlockedTransitions: "Blocked transitions",
    lifecycleProposalPreview: "Lifecycle Change Proposal preview",
    lifecycleDistributionImpact: "Distribution impact",
    lifecycleTransitionPanelHint:
      "Proposal preview only. Does not write manifest or change runtime.",
    lifecycleColumnMeaning: "Business meaning",
    lifecycleColumnNextAction: "Next action",
    lifecycleProposalAllowed: "Proposal can be generated",
    lifecycleProposalBlocked: "Currently blocked",
    lifecycleNoRuntimeChange: "No runtime impact",
    sectionInspectionSummary: "Inspection Summary",
    summaryAutoValidationPassed: "Auto validation passed",
    summaryNeedsPasteQa: "Needs paste QA",
    summaryReadyForPromoteReview: "Ready for promote review",
    summaryBlockedCandidates: "Blocked candidates",
    sectionPreviewCopyValidator: "Preview / Copy / Validator",
    inspectionPreviewTitle: "Style Preview",
    inspectionCopyTitle: "Copy HTML",
    inspectionValidatorTitle: "WeChat Validation",
    inspectionPromoteReadinessTitle: "Promote Readiness",
    inspectionFixtureLabel: "Inspection fixture",
    inspectionPreviewStatus: "Preview status",
    inspectionCopyStatus: "Copy status",
    inspectionInlineStyle: "Uses inline style",
    inspectionForbiddenCapability: "Forbidden capability hit",
    inspectionRiskyCapability: "Risky capability hit",
    inspectionIssueCount: "Issue count",
    inspectionBlockerCount: "Blockers",
    inspectionWarningCount: "Warnings",
    inspectionOperatorConclusion: "Operator conclusion",
    inspectionPromoteReady: "Ready for S9-STORY-007 promote review",
    inspectionPromoteNotReady: "Not ready for promote review",
    inspectionNextStory: "Next story",
    inspectionRawCopyHtml: "Raw Copy HTML",
    inspectionRawValidatorIssues: "Raw validator issues",
    previewStatusOk: "Preview OK",
    previewStatusError: "Preview failed",
    copyStatusOk: "Copy OK",
    copyStatusError: "Copy failed",
    promoteReadyLabel: "Ready for promote review",
    promoteNotReadyLabel: "Not ready for promote review",
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
      disabledReason: "自动校验结果见下方 Preview / Copy / Validator 面板；本按钮不触发写入",
      deferredStory: "S9-STORY-006",
    },
    {
      actionId: "review-evidence",
      label: "查看证据",
      disabledReason: "生命周期提案预览已在 S9-STORY-004 提供；持久化写入待后续 Story",
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
      disabledReason: "Auto validation shown below; button does not write",
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

export type StyleLibraryLifecycleColumnMetaCopy = {
  label: string;
  businessMeaning: string;
  nextAction: string;
};

export type StyleLibraryLifecycleStatusCopy = {
  currentStateDescription: string;
  statusExplanation: string;
  nextStepSuggestion: string;
  blockedReason: string | null;
  linkedFutureStory: string | null;
  runtimeImpactSummary: string;
};

const LIFECYCLE_COLUMN_META: Record<
  StyleLibraryLocale,
  Record<StyleLibraryLifecycleState, StyleLibraryLifecycleColumnMetaCopy>
> = {
  zh: {
    draft: {
      label: "草稿",
      businessMeaning: "样式尚未进入候选审查。",
      nextAction: "完善样式并进入候选池。",
    },
    candidate: {
      label: "候选",
      businessMeaning: "已进入候选池，等待校验。",
      nextAction: "补充 validator 证据后进入校验通过。",
    },
    validator_pass: {
      label: "校验通过",
      businessMeaning: "已通过渲染/校验检查。",
      nextAction: "完成粘贴 QA 后进入 paste_qa_pass。",
    },
    paste_qa_pass: {
      label: "粘贴 QA 通过",
      businessMeaning: "已通过公众号粘贴验收，可进入上线审核。",
      nextAction: "进入上线审核（S9-STORY-007）。",
    },
    user_selectable: {
      label: "用户可选",
      businessMeaning: "已进入用户可选池，可被用户挑选。",
      nextAction: "如需默认推荐，需独立 PO 决策。",
    },
    default_eligible: {
      label: "可进默认推荐",
      businessMeaning: "可作为默认推荐样式候选。",
      nextAction: "维护默认策略或废弃。",
    },
    deprecated: {
      label: "已废弃",
      businessMeaning: "不再对用户分发。",
      nextAction: "无后续流转。",
    },
  },
  en: {
    draft: {
      label: "Draft",
      businessMeaning: "Style not yet in candidate review.",
      nextAction: "Prepare and move to candidate.",
    },
    candidate: {
      label: "Candidate",
      businessMeaning: "In candidate pool awaiting validation.",
      nextAction: "Add validator evidence to reach validator_pass.",
    },
    validator_pass: {
      label: "Validator Pass",
      businessMeaning: "Passed renderer/validator checks.",
      nextAction: "Complete paste QA to reach paste_qa_pass.",
    },
    paste_qa_pass: {
      label: "Paste QA Pass",
      businessMeaning: "Passed WeChat paste QA; ready for promote review.",
      nextAction: "Promote review (S9-STORY-007).",
    },
    user_selectable: {
      label: "User Selectable",
      businessMeaning: "Available in user-selectable pool.",
      nextAction: "Default eligibility requires separate PO decision.",
    },
    default_eligible: {
      label: "Default Eligible",
      businessMeaning: "Eligible for default recommendation.",
      nextAction: "Maintain default policy or deprecate.",
    },
    deprecated: {
      label: "Deprecated",
      businessMeaning: "No longer distributed to users.",
      nextAction: "Terminal state.",
    },
  },
};

const BLOCK_REASON_COPY: Record<
  StyleLibraryLocale,
  Record<string, string>
> = {
  zh: {
    [LIFECYCLE_BLOCK_REASON_CODES.MISSING_VALIDATOR_EVIDENCE]:
      "缺少 validator 证据或 validator pending 证据。",
    [LIFECYCLE_BLOCK_REASON_CODES.MISSING_PASTE_QA_EVIDENCE]:
      "缺少 paste QA 证据。",
    [LIFECYCLE_BLOCK_REASON_CODES.REQUIRES_PROMOTE_REVIEW]:
      "需要上线审核（promote review）。",
    [LIFECYCLE_BLOCK_REASON_CODES.SEED_REQUIRES_PROMOTE_REVIEW]:
      "种子样式在 S9-STORY-007 前不能加入用户可选池。",
    [LIFECYCLE_BLOCK_REASON_CODES.REQUIRES_PO_DEFAULT_DECISION]:
      "进入默认推荐需要独立 PO 决策，不能从 user_selectable 自动进入。",
    [LIFECYCLE_BLOCK_REASON_CODES.DEPRECATION_REASON_REQUIRED]:
      "废弃流转需要运营人员填写原因。",
    [LIFECYCLE_BLOCK_REASON_CODES.NOT_FORWARD_TRANSITION]:
      "不是支持的正向流转路径。",
    [LIFECYCLE_BLOCK_REASON_CODES.PROPOSAL_ONLY_NO_PERSISTENCE]:
      "S9-STORY-004 仅生成提案预览，不会写入 manifest。",
  },
  en: {
    [LIFECYCLE_BLOCK_REASON_CODES.MISSING_VALIDATOR_EVIDENCE]:
      "Validator or validator-pending evidence is missing.",
    [LIFECYCLE_BLOCK_REASON_CODES.MISSING_PASTE_QA_EVIDENCE]:
      "Paste QA evidence is missing.",
    [LIFECYCLE_BLOCK_REASON_CODES.REQUIRES_PROMOTE_REVIEW]:
      "Promote review is required.",
    [LIFECYCLE_BLOCK_REASON_CODES.SEED_REQUIRES_PROMOTE_REVIEW]:
      "Seed assets cannot enter user_selectable before S9-STORY-007.",
    [LIFECYCLE_BLOCK_REASON_CODES.REQUIRES_PO_DEFAULT_DECISION]:
      "default_eligible requires an independent PO decision.",
    [LIFECYCLE_BLOCK_REASON_CODES.DEPRECATION_REASON_REQUIRED]:
      "Deprecation requires an operator reason.",
    [LIFECYCLE_BLOCK_REASON_CODES.NOT_FORWARD_TRANSITION]:
      "Not a supported forward transition.",
    [LIFECYCLE_BLOCK_REASON_CODES.PROPOSAL_ONLY_NO_PERSISTENCE]:
      "S9-STORY-004 proposal preview only; manifest is not written.",
  },
};

export function getLifecycleColumnMeta(
  locale: StyleLibraryLocale,
  lifecycle: StyleLibraryLifecycleState,
): StyleLibraryLifecycleColumnMetaCopy {
  return LIFECYCLE_COLUMN_META[locale][lifecycle];
}

export function translateLifecycleBlockReasonCode(
  locale: StyleLibraryLocale,
  code: string,
): string {
  return BLOCK_REASON_COPY[locale][code] ?? code;
}

export function getLifecycleStatusCopy(
  locale: StyleLibraryLocale,
  lifecycle: StyleLibraryLifecycleState,
  asset: StyleLibraryAsset,
): StyleLibraryLifecycleStatusCopy {
  const meta = getLifecycleColumnMeta(locale, lifecycle);
  const isSeed =
    asset.assetType === "variant" &&
    (asset.isSeedAsset === true || lifecycle === "paste_qa_pass");

  if (lifecycle === "paste_qa_pass" && isSeed) {
    return locale === "zh"
      ? {
          currentStateDescription: "粘贴 QA 通过",
          statusExplanation: "已通过粘贴 QA，等待上线审核。",
          nextStepSuggestion: "进入上线审核",
          blockedReason: "S9-STORY-007 前不能加入用户可选池",
          linkedFutureStory: "S9-STORY-007",
          runtimeImpactSummary: "无",
        }
      : {
          currentStateDescription: "Paste QA Pass",
          statusExplanation: "Paste QA passed; awaiting promote review.",
          nextStepSuggestion: "Enter promote review",
          blockedReason: "Cannot enter user-selectable pool before S9-STORY-007",
          linkedFutureStory: "S9-STORY-007",
          runtimeImpactSummary: "None",
        };
  }

  return {
    currentStateDescription: meta.label,
    statusExplanation: meta.businessMeaning,
    nextStepSuggestion: meta.nextAction,
    blockedReason:
      lifecycle === "paste_qa_pass"
        ? locale === "zh"
          ? "进入 user_selectable 需要 S9-STORY-007 promote review"
          : "user_selectable requires S9-STORY-007 promote review"
        : null,
    linkedFutureStory:
      lifecycle === "paste_qa_pass"
        ? "S9-STORY-007"
        : lifecycle === "candidate" || lifecycle === "validator_pass"
          ? "S9-STORY-006"
          : null,
    runtimeImpactSummary: locale === "zh" ? "无" : "None",
  };
}

export type StyleLibraryInspectionUiCopy = Pick<
  StyleLibraryUiCopy,
  | "previewStatusOk"
  | "previewStatusError"
  | "copyStatusOk"
  | "copyStatusError"
  | "promoteReadyLabel"
  | "promoteNotReadyLabel"
>;

export function getInspectionUiCopy(
  locale: StyleLibraryLocale,
): StyleLibraryInspectionUiCopy {
  const ui = getStyleLibraryUiCopy(locale);
  return {
    previewStatusOk: ui.previewStatusOk,
    previewStatusError: ui.previewStatusError,
    copyStatusOk: ui.copyStatusOk,
    copyStatusError: ui.copyStatusError,
    promoteReadyLabel: ui.promoteReadyLabel,
    promoteNotReadyLabel: ui.promoteNotReadyLabel,
  };
}

const VALIDATOR_STATUS_LABELS: Record<
  StyleLibraryLocale,
  Record<"PASS" | "WARNING" | "FAIL", string>
> = {
  zh: { PASS: "通过", WARNING: "警告", FAIL: "失败" },
  en: { PASS: "PASS", WARNING: "WARNING", FAIL: "FAIL" },
};

export function getValidatorStatusLabel(
  locale: StyleLibraryLocale,
  status: "PASS" | "WARNING" | "FAIL",
): string {
  return VALIDATOR_STATUS_LABELS[locale][status];
}

const INSPECTION_CONCLUSION_COPY: Record<
  StyleLibraryLocale,
  Record<
    "ready_for_promote_review" | "needs_paste_qa" | "has_blocking_issues" | "validator_fail",
    string
  >
> = {
  zh: {
    ready_for_promote_review:
      "可进入上线审核：自动校验通过/警告，已有粘贴 QA 证据；真实 promote 由 S9-STORY-007 执行。",
    needs_paste_qa:
      "需要人工粘贴复测：当前仅完成自动校验，仍缺 paste QA 证据。",
    has_blocking_issues:
      "存在阻塞问题，不能进入上线审核。",
    validator_fail:
      "校验失败：Copy HTML 不符合 WeChat-safe Contract，不能进入上线审核。",
  },
  en: {
    ready_for_promote_review:
      "Ready for promote review: auto validation passed/warned with paste QA evidence; actual promote is S9-STORY-007.",
    needs_paste_qa:
      "Needs manual paste re-test: auto validation only; paste QA evidence missing.",
    has_blocking_issues:
      "Blocking issues present; not ready for promote review.",
    validator_fail:
      "Validation failed: Copy HTML violates WeChat-safe Contract; not ready for promote review.",
  },
};

export function getInspectionConclusionCopy(
  locale: StyleLibraryLocale,
  key:
    | "ready_for_promote_review"
    | "needs_paste_qa"
    | "has_blocking_issues"
    | "validator_fail",
): string {
  return INSPECTION_CONCLUSION_COPY[locale][key];
}

const PROMOTE_BLOCKED_REASON_COPY: Record<StyleLibraryLocale, Record<string, string>> = {
  zh: {
    VALIDATOR_FAIL: "自动校验失败",
    BLOCKING_ISSUES: "存在阻塞级校验问题",
    NEEDS_PASTE_QA: "缺少粘贴 QA 证据",
  },
  en: {
    VALIDATOR_FAIL: "Auto validation failed",
    BLOCKING_ISSUES: "Blocking validation issues",
    NEEDS_PASTE_QA: "Paste QA evidence missing",
  },
};

export function translatePromoteBlockedReason(
  locale: StyleLibraryLocale,
  code: string,
): string {
  return PROMOTE_BLOCKED_REASON_COPY[locale][code] ?? code;
}
