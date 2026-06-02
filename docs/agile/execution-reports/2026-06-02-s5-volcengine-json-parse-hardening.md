# Execution Report：Volcengine Article JSON 解析增强

## 问题

`/generate` 使用真实 Volcengine provider 时报错：

`模型响应格式错误 — Volcengine model response is not valid Article JSON`

## 根因

`parseModelJsonContent` 仅支持「纯 JSON」或单个 markdown fence。Doubao 常见返回包括：前后说明文字、多个 fence、reasoning 标签、`{ "article": {...} }` wrapper、尾随逗号等，导致 `JSON.parse` 失败。

## 修复

增强 `model-prompt.ts` 中 `parseModelJsonContent`：

- 去除 BOM / reasoning 前缀
- 多 candidate 尝试（原文、fenced、balanced `{...}` 提取）
- 尾随逗号清理
- `normalizeModelArticleRoot` 解包 `article` / `data` / `result` / `output`

## 验证

- 742 tests PASS
- lint / build PASS

## Commit

- 未提交 / not committed
