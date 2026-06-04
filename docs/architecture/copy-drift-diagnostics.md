# Copy 失真诊断与 Contract 修正

> 轻篇公众号排版 · qingpian-wechat-editor
>
> **状态：** 流程草案 · **Contract 依据：** [`wechat-safe-html-css-contract.md`](wechat-safe-html-css-contract.md) **`wechat-safe-contract-v1`** · **S8-STORY-006** 流程定稿
> **关联：** Fidelity Matrix · DECISION-088 · DECISION-089

---

## 1. Copy 失真的定义

**Copy 失真：** 用户在轻篇侧看到的 **Preview**、复制得到的 **Clipboard HTML**、粘贴进 **微信公众号编辑器** 后的视觉或结构，三者之间存在**不可接受的差异**，且差异可归因于 HTML/CSS/DOM/平台过滤，而非内容语义变化。

**可接受差异：** 字体回退（系统字体）、亚像素级间距、微信编辑器 chrome 不影响正文的差异——须在 Matrix 标 **WARNING** 并说明，不得标 PASS 冒充一致。

---

## 2. 三份材料对比

| 材料 | 来源 | 用途 |
|------|------|------|
| **Preview HTML** | 编辑器内预览 DOM（或导出快照） | 用户「以为」会看到的效果 |
| **Clipboard HTML** | `text/html` 剪贴板 payload | Copy Renderer 直接产物 · Validator 输入 |
| **WeChat pasted** | 公众号后台粘贴后「查看源码」或审查元素 | **终态裁判** |

**诊断步骤：**

1. 对同一 `articleId` + `variantId` 固定 fixture。
2. 分别保存三份 HTML（或规范化 diff）。
3. 标注首次出现差异的层级（属性 / 节点 / 上下文）。

---

## 3. 失真类型

| 类型 | 描述 | 典型原因 |
|------|------|----------|
| **CSS 被删除** | inline 属性整段消失 | 微信白名单过滤 |
| **CSS 被改写** | 值变化（如 `px`→`em`、颜色归一） | 编辑器规范化 |
| **DOM 被改写** | 标签替换、子节点合并/剥离 | 消毒 / 扁平化 |
| **样式保留但表现异常** | 属性仍在但视觉不对 | 字体、行高上下文、父级样式 |
| **上下文导致失效** | 相邻块、外层 `section` 影响 | 嵌套过深、非法父节点 |

---

## 4. contract 修正动作

| 动作 | 何时使用 |
|------|----------|
| **Green 降级 Yellow** | 实机多次 WARNING 或偶发 FAIL |
| **Yellow 降级 Red** | 实机稳定 FAIL，fallback 也无法接受 |
| **Red 升级 Yellow** | 有可靠 fallback + 新 Matrix PASS 证据 |
| **增加 block / variant 豁免** | 业务必须保留且风险可控；须 PO 签字 |
| **增加 fallback** | Renderer 可在输出前自动降级 |
| **移出默认 preset** | 保留 variant 但不进入 `release1_required` / 默认池 |

每次修正须更新：**Contract v1**（`wechat-safe-contract-v1`）· Compatibility Profile · Validator · Matrix 行 ·（若分级变化）`decisions.md` · `changelog.md`。

完整步骤见 Contract v1 §9。

---

## 5. 记录模板

### 5.1 失真记录（单条）

```markdown
### DRIFT-<YYYYMMDD>-<seq>

- **日期：**
- **测试人：**
- **Fixture / Article：**
- **Block type：**
- **Variant ID：**
- **粘贴目标：** 135 / 微信公众号后台 / 其它
- **Contract 版本：** `wechat-safe-contract-v1`
- **Matrix 行 ID：**（S8-STORY-005 后填写）
- **evidenceId / waiver：**（若涉及 Yellow 能力）

#### 现象
（一句话 + 截图路径 optional）

#### 三份材料
- Preview：（路径或 hash）
- Clipboard：（路径或 hash）
- WeChat pasted：（路径或 hash）

#### 失真类型
CSS 删除 / CSS 改写 / DOM 改写 / 表现异常 / 上下文

#### 根因假设


#### contract 动作
Green→Yellow / Yellow→Red / … / 无变更

#### 跟进 Story


#### 状态
OPEN / FIXED / WONTFIX
```

### 5.2 粘贴 QA 会话（批次）

```markdown
## Paste QA Session <YYYYMMDD>

- **范围：** preset / fixture 列表
- **环境：** macOS / Windows · 浏览器 · 微信版本
- **矩阵版本：**
- **通过：** n
- **失败：** n
- **警告：** n
- **未测：** n
```

---

## 6. Validator 与 Drift 的分工（S8-STORY-004）

| 阶段 | 工具 / 材料 | 发现什么 |
|------|-------------|----------|
| **复制前 / CI** | `validateWechatCopyHtml`（Contract v1 Profile） | Red 标签/CSS、禁止 `class`、未豁免 Yellow、嵌套过深等 **机器可读** violation |
| **实机粘贴** | PO 对比 Preview / Clipboard / WeChat pasted | **视觉与结构失真**（CSS 被删改、DOM 被改写等） |
| **闭环** | DRIFT 记录 +（S8-STORY-005 后）Fidelity Matrix 行 | Validator 与实机结果共同驱动 Contract / Profile / Renderer 修正 |

**原则：** Validator PASS 不等于 Matrix PASS；实机 FAIL 仍须进入 Drift，即使 Validator 仅 warning。

---

## 7. PO 与开发闭环

```text
PO 实机粘贴 → 填 DRIFT 记录 → 更新 Matrix status
  → 开发修正 Renderer / Profile / contract
  → Validator + snapshot 回归
  → PO 复测 → 关闭 DRIFT
```

**禁止：** 仅凭 snapshot 通过即标 Matrix PASS。

---

## 8. 变更记录

| 日期 | 变更 | Story |
|------|------|-------|
| 2026-06-04 | 创建草案 | S8-STORY-001 |
| 2026-06-04 | 对齐 Contract v1 术语与 §9 修正流程 | S8-STORY-002 |
| 2026-06-04 | 补充 Validator vs Drift 分工 | S8-STORY-004 |
