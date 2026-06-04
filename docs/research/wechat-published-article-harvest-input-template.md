# 公众号文章 Harvest 证据输入模板（S8-STORY-006B-FIX-A）

> **用途：** 用户仅提供 **URL** 或 **URL + HTML 片段**；由 Cursor / AI 按 [`wechat-published-article-style-extraction-guide.md`](wechat-published-article-style-extraction-guide.md) 自动提取字段。  
> **禁止：** 手工填写 DOM/CSS/pattern 长表 · 虚构 URL · 保存公众号全文 · 大段完整 HTML 入库。

---

## 1. 两阶段策略

| 阶段 | Story | 内容 |
|------|-------|------|
| **阶段 1（本轮）** | 006B-FIX-A | evidenceLevel L0–L4 · 输入模板 · AI 提取规范 · HARVEST-001~015 标 L0 |
| **阶段 2（后续）** | 006B-FIX-B | 批量补 **5–10** 篇真实 evidence（L2/L3），不一次性 15 篇 |

---

## 2. 格式 A：URL-only

将下列块复制到 `docs/research/wechat-published-article-evidence/`（建议，FIX-B 起）或会话中交给 Cursor：

```markdown
## ARTICLE-EVIDENCE-INPUT-001

- articleUrl: https://mp.weixin.qq.com/s/xxxxxxxx
- sourceNote: 可选 · 账号类型或阅读场景（勿粘贴文章标题全文）
- userFocusOptional:
  - card
  - left-border
  - title-divider
  - cta
  - divider
  - unknown
- providedHtml: no
```

### 说明

| 项 | 规则 |
|----|------|
| **用户最小输入** | `articleUrl` 必填；其余可选 |
| **默认 evidenceLevel** | **L1 url-registered**（仅登记 URL） |
| **升级 L2** | AI 能访问公开页并做 **阅读态** 观察 → `ai-reading-extracted` |
| **禁止** | 无法访问页面时 **不得** 编造 DOM/CSS |
| **L1 价值** | 有限 — 只证明「存在可参考的排版样本」，**不能** 证明 DOM 结构 |

---

## 3. 格式 B：URL + HTML

````markdown
## ARTICLE-EVIDENCE-INPUT-002

- articleUrl: https://mp.weixin.qq.com/s/xxxxxxxx
- sourceNote: 可选
- userFocusOptional:
  - card
  - left-border
  - title-divider
  - cta
  - divider
  - unknown
- providedHtml: yes

### htmlSnippet

```html
<!-- 用户从浏览器开发者工具复制的正文相关局部 DOM；勿含全文 -->
<section>
  <p style="...">...</p>
</section>
```
````

### 说明

| 项 | 规则 |
|----|------|
| **片段** | 只贴含目标样式的 **局部** DOM，不要求整篇 |
| **默认 evidenceLevel** | **L3 html-extracted**（有 URL + 可分析 HTML） |
| **提取方** | Cursor / AI 按 extraction guide 输出 `WX-HARVEST-EVIDENCE-###` |
| **存储** | 正式文档只保留 **摘要字段**，不保存大段 HTML |

---

## 4. 可选扩展：URL + Paste 结果（FIX-B / 006D）

```markdown
- providedHtml: yes
- pasteObservation: PO 在公众号后台粘贴后的简短现象描述（非虚构 PASS/FAIL）
```

可达 **L4 paste-verified**（须与轻篇 Copy HTML 或 Matrix 行对照）。

---

## 5. 工作流（交给 Cursor 的指令示例）

```text
请读取 ARTICLE-EVIDENCE-INPUT-00x，按 wechat-published-article-style-extraction-guide.md
输出 WX-HARVEST-EVIDENCE-记录（Markdown），不要保存全文 HTML 到 repo。
```

---

## 6. 变更记录

| 日期 | 变更 |
|------|------|
| 2026-06-04 | 初版（S8-STORY-006B-FIX-A） |
