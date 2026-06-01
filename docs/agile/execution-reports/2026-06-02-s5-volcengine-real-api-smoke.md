# Execution Report：S5-STORY-005A Volcengine Real API Smoke

## 1. 基本信息

- 日期：2026-06-02
- 当前分支：`feature/s5-volcengine-real-api-smoke`
- 来源分支：`sprint/s5-generation-ui-main-flow`
- 目标合并分支：`sprint/s5-generation-ui-main-flow`
- Sprint：Sprint 5
- 关联 Story / Bug / Decision：S5-STORY-005A；S5-STORY-005
- 执行者：Cursor
- 状态：In Review

## 2. 本轮目标

新增 dev-only 真实 Volcengine / Doubao API smoke，用于在进入 S5-STORY-006 前手动验证 provider 全链路。

## 3. 执行范围

**做了：**

- 新增 `scripts/smoke/volcengine-provider-smoke.ts`
- 新增 `src/core/generation/volcengine-provider-smoke.ts`、`smoke-env.ts`
- 新增 `package.json` script `smoke:volcengine-provider` + devDependency `tsx`
- 新增 8 单元测试（smoke helper 纯函数）
- 新增 `docs/agile/smoke/s5-volcengine-provider-smoke.md`
- 更新 backlog / sprint-plan / changelog / README / `.env.example`
- **实际运行**真实 API smoke（加载 `.env.local`，未输出 key）

**没做：**

- 未修复模型返回 JSON 的 Article Schema 问题（属 provider/prompt 后续优化）
- 未实现 S5-STORY-006 / UI
- 未接入 CI / `pnpm test`
- 未 commit / merge

## 4. 真实 API Smoke 运行结果

| 项 | 值 |
|----|-----|
| 是否运行 | **是** |
| 结果 | **FAILED** |
| failureCategory | `article_schema` |
| provider | volcengine |
| eventCount | 7 |
| errorCode | `invalid_format` |
| errorMessage | Invalid UUID（及若干 required string 缺失） |

**解读：**

- 真实网络 API **已调通**（收到 7 个 GenerationEvent，非 config/auth/network 错误）
- `finalizeGenerationEvents` **未通过** — 模型返回的 Article candidate 不符合 Article Schema（block/article UUID 等）
- **不能**宣称「真实 API smoke passed」或 S5-STORY-005 Done

**下一步建议（不在本轮范围）：**

- 强化 prompt 要求合法 UUID
- 或在 provider enrich 阶段为 block/article 生成 UUID（需单独 Story/决策）

## 5. 修改 / 新增文件

见 git status；核心新增：

- `scripts/smoke/volcengine-provider-smoke.ts`
- `src/core/generation/volcengine-provider-smoke.ts`
- `src/core/generation/smoke-env.ts`
- `tests/core/generation/volcengine-provider-smoke.test.ts`
- `docs/agile/smoke/s5-volcengine-provider-smoke.md`
- `package.json` / `pnpm-lock.yaml`

## 6. 验收标准

| AC | 结果 |
|----|------|
| AC-1 smoke script | PASS |
| AC-2~AC-7 行为 / 安全 | PASS |
| AC-8 单元测试 | PASS（688 total） |
| AC-9 真实 API 手动通过 | **FAIL**（API 可达；schema finalization 失败） |

## 7. 运行检查

| 命令 | 结果 | 说明 |
|------|------|------|
| `eslint` | PASS | 直接 `./node_modules/.bin/eslint` |
| `vitest run` | PASS | 60 files / 688 tests |
| `next build` | PASS | 检测到 `.env.local` |
| `tsx scripts/smoke/volcengine-provider-smoke.ts` | FAILED | `article_schema`；见上文 |

注：`corepack pnpm lint` 在本环境因 `pnpm install` esbuild build scripts 警告可能 exit 1；直接运行 eslint/vitest/build 均 PASS。

## 8. 文档状态

- S5-STORY-005：**In Review**（Provider code Done；真实 API finalization 未通过）
- S5-STORY-005A：**In Review**（smoke script ready；真实运行 FAILED / article_schema）

## 9. 建议下一步

1. 用户审查 smoke 输出与 diff
2. 决定是否在本分支或 follow-up 修复模型 JSON → Article Schema（UUID / required fields）
3. smoke PASSED 后再将 S5-STORY-005 标记 Done，进入 S5-STORY-006

## 10. Commit

- Commit hash：未提交 / not committed（待用户审查）
