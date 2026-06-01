# S5 Volcengine Provider Dev-only Real API Smoke

> S5-STORY-005A · 不替代 `/generate` UI smoke · 不替代微信公众号 Paste QA

## 目的

在 **S5-STORY-006** 之前，手动验证 S5-STORY-005 Volcengine / Doubao Provider 是否能在真实网络环境下跑通：

`NormalizedInput` → 真实 model API → `GenerationEvent[]` → `done.article` → `finalizeGenerationEvents` → 正式 `Article`

## 运行命令

```bash
corepack pnpm smoke:volcengine-provider
```

脚本会自动尝试加载项目根目录的 `.env.local` 与 `.env`（不会覆盖已设置的 shell 环境变量）。

也可显式传入：

```bash
VOLCENGINE_ENABLE_REAL_PROVIDER=true \
VOLCENGINE_API_KEY=your-key \
VOLCENGINE_MODEL=your-model-or-endpoint-id \
VOLCENGINE_BASE_URL=https://ark.cn-beijing.volces.com/api/v3 \
corepack pnpm smoke:volcengine-provider
```

## 所需环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `VOLCENGINE_ENABLE_REAL_PROVIDER` | 是 | 必须为 `true` |
| `VOLCENGINE_API_KEY` | 是 | Ark Bearer token |
| `VOLCENGINE_MODEL` | 是 | 模型名或 endpoint id |
| `VOLCENGINE_BASE_URL` | 否 | 默认 `https://ark.cn-beijing.volces.com/api/v3` |
| `VOLCENGINE_TIMEOUT_MS` | 否 | 默认 `60000` |

详见 `.env.example`。

## 成功判定

输出包含 `Volcengine provider smoke: PASSED`，且至少满足：

- `eventCount > 0`
- stream 含 `done.article`
- `finalizeGenerationEvents` 成功
- `blockCount >= 1`
- 输出 `articleId` / `articleTitle`

## 失败分类

| failureCategory | 常见原因 |
|-----------------|----------|
| `config` | 未启用 provider、缺 API key / model |
| `auth` | 密钥无效或权限不足 |
| `network` | 网络不可达、超时 |
| `response_format` | 模型返回非 JSON / 非 Article 对象 |
| `article_schema` | JSON 无法通过 Article Schema finalization |
| `provider` | 限流、上游 5xx 等 |

失败时脚本会输出 `errorCode` / `errorMessage` / `failureCategory`，**不会**输出 API key 或 Authorization header。

## 最近一次运行结果

| 日期 | 执行者 | 结果 | failureCategory | 备注 |
|------|--------|------|-----------------|------|
| 2026-06-02 | Cursor dev run | **FAILED** | `article_schema` | 真实 API 已返回 7 个事件；`finalizeGenerationEvents` 失败（`invalid_format: Invalid UUID` 等）。需修正模型 JSON / prompt 或 enrich 逻辑后再跑 smoke |

## 边界

- **不**接入 `corepack pnpm test` 或 CI
- **不**替代 S5-STORY-007 `/generate` UI 手动验收
- **不**替代 Sprint 6-B 微信公众号 Paste QA

## 相关代码

- `scripts/smoke/volcengine-provider-smoke.ts`
- `src/core/generation/volcengine-provider-smoke.ts`
- `src/core/generation/smoke-env.ts`
