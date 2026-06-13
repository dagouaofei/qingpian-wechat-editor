# Execution Report：S11-STORY-003B Gate A — Legacy Path Audit（修订）

## 1. 基本信息

- 日期：2026-06-11（Gate A 修订 · Gate B **未批准**）
- 当前分支：`refactor/s11-story-003b-legacy-path-removal`
- 来源分支：`sprint/s11-production-ops-go-live` @ `75fecb9`（含 003A merge）
- 目标合并分支：`sprint/s11-production-ops-go-live`（Gate B 后 · 待用户确认）
- Sprint：Sprint 11
- 关联 Story：S11-STORY-003B
- Gate：**A 修订** — 分支基线修正 · P0 范围调整 · inventory 补全
- 状态：**In Review**（Gate B 待用户重新批准）

## 2. 003A merge 与 003B 分支重建

### 003A → sprint

| 项 | 值 |
|----|-----|
| 操作 | fast-forward merge `feature/s11-story-003a-staging-volcengine-streaming-numbering` → `sprint/s11-production-ops-go-live` |
| sprint HEAD | `75fecb9` |
| 验收 | 用户指令确认 staging 验收完成并 merge |
| Story 003A 状态 | **In Review**（merged sprint · 非 Done · 待用户关闭 Story） |
| push | **未 push** sprint/003B |

### 003B 重建策略

**采用：reset + cherry-pick（非 rebase 整条 003B 历史）**

```bash
git checkout refactor/s11-story-003b-legacy-path-removal
git reset --hard sprint/s11-production-ops-go-live   # 75fecb9
git cherry-pick bd2e469   # → bed56ce
git cherry-pick ec24ccc   # → a618beb
```

| 方案 | 结论 |
|------|------|
| rebase 003B onto sprint | 等价但历史含 003A 重复；reset+cherry-pick 更清晰 |
| 保留旧 003B tip | **拒绝** — 会以未 merge 003A 为独立基线 |
| 重建分支新名 | 不必要 — reset 同分支名即可 |
| bd2e469 审计文档 | **保留** — 内容在 `bed56ce`（本次修订 amend 同一文件） |

## 3. Gate B 范围调整（用户裁定）

| 项 | 决定 |
|----|------|
| LP-001～007、LP-009、LP-010 | 批准 **继续评估**（Gate B 未执行） |
| LP-008 SSE 双渲染轨 | **降为 P1** · 默认 **不纳入** 003B |
| LP-008 重新纳入条件 | 证明污染 production-like 主链路 + 小范围可删 |

## 4. Legacy inventory

完整版：[`docs/architecture/legacy-parallel-path-inventory.md`](../../architecture/legacy-parallel-path-inventory.md)

- 每项含：调用方 · runtime 影响 · 替代实现 · 删除证据 · 测试计划
- P0：9 项（无 LP-008）
- P1：9 项（含 LP-008）
- P2：7 项 · P3：6 项

## 5. 本轮修改（修订 · 仅文档）

- `docs/architecture/legacy-parallel-path-inventory.md` — 补全 + LP-008 降级 + 基线更新
- `docs/agile/sprint11-production-ops-go-live.md` — 003A merged · 003B scope
- `docs/agile/sprint-backlog.md`
- 本 execution report

## 6. 未执行

- Gate B 代码删除
- lint/build/test（仅 docs）
- production / main merge
- push

## 7. commit hash

见本轮修订 commit

## 8. 下一步（待用户）

1. 审查修订 inventory 与 P0 范围（无 LP-008）
2. 批准 Gate B 后执行 LP-001～007、009、010
3. 可选：push sprint @ 75fecb9 至 origin
