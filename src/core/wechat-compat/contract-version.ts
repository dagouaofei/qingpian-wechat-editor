/** @see docs/architecture/wechat-safe-html-css-contract.md */
export const WECHAT_SAFE_CONTRACT_VERSION_ID =
  "wechat-safe-contract-v1" as const;

export type WeChatSafeContractVersionId =
  typeof WECHAT_SAFE_CONTRACT_VERSION_ID;
