# WeChat Compatibility 已知技术债务

> 轻篇公众号排版 · qingpian-wechat-editor  
> **状态：** Deferred（已归档，暂不处理）  
> **关联：** [`wechat-compatibility-spec.md`](wechat-compatibility-spec.md) · **DECISION-109** · [`decisions.md`](../agile/decisions.md)

---

## 1. 背景

S8 建立 Contract v1 + `validateWechatCopyHtml`（`src/core/wechat-compat/`）；S10 为 HTML→DSL Harvest 新增 `src/core/wechat-compatibility/`。两轨并行导致开关、allowlist、调用路径不一致。2026-06-08 引入全局 Compatibility Mode（默认 `off`）作为 **html_paste 开发暂态**，债务项本身不在该轮合并或删除。

---

## 2. 债务清单

| ID | 债务 | 影响 | 状态 |
|----|------|------|------|
| DEBT-WC-001 | S8 `wechat-compat` 与 S10 `wechat-compatibility` 双模块 | 命名混淆、规则重复维护 | Deferred |
| DEBT-WC-002 | 两套 allowlist（S10 `allowed-*` vs S8 Contract Green/Yellow/Red） | 改一边可能不影响另一边 | Deferred |
| DEBT-WC-003 | Harvest mode 与 Inspection/Promote 路径曾不一致 | `off` 时 Harvest 过、Validator 仍 fail | Mitigated（全局 gate，见 DECISION-109） |
| DEBT-WC-004 | Copy decode 裁剪与 Contract validator 职责未分层 | 保真 bug 难区分「检查」vs「处理」 | Mitigated（off 时一并跳过） |
| DEBT-WC-005 | `copy-safe-html.ts` 与 `wechat-compat` 第三套规则 | Release1 copy snapshot 与 html_paste DSL 路径规则不统一 | Mitigated（off 时跳过） |
| DEBT-WC-006 | 客户端 Preview/Copy 需 `NEXT_PUBLIC_*` 才能读 mode | 仅设 server env 时 browser decode 行为可能不一致 | Documented |
| DEBT-WC-007 | 长期应合并为单一 Contract + 三层 API：`validate` / `transform` / `filterCopyStyles` | 架构收敛、per-variant vs global mode 合并 | Deferred |

---

## 3. 本轮不做

- 合并 `wechat-compat` / `wechat-compatibility` 目录
- 统一 allowlist 单源
- 修改 Variant schema / Release1 registry copy-safe 元数据
- per-variant `compatibilityJson.wechatCompatibilityMode` 与 global env 的精细合并（字段保留为 Harvest 历史审计）

---

## 4. 建议收口顺序（未来 Sprint）

1. 单源 allowlist + `validateWechatCopyHtml` 唯一入口  
2. Copy decode `filterCopyStyles` 与 Contract 对齐或显式分层  
3. 合并 DEBT-WC-005 copy-safe-html 规则进 Contract 或标注废弃  
4. Release 1 收口前恢复 `report`/`enforce` 默认并跑 Paste QA（见 DECISION-109）
