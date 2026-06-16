# Production 代码回滚演练计划

> S11-STORY-004 Gate A · **文档 only** · production 未操作  
> **代码回滚 ≠ 数据库 migration 回滚**

---

## 1. 目标

证明在同一 ECS 上可通过运维脚本安全回滚 **应用代码**，且：

- systemd 正常
- `/api/health` 正常
- `/api/version` 的 `gitSha` 随部署/回滚正确变化
- **数据库未被脚本回滚**
- Admin 登录与 `/preview` 冒烟可用

---

## 2. Staging 演练（Gate A 验收 · 在 ECS 执行）

环境：`staging` · 目录 `/opt/qingpian-wechat-editor/staging`

| 步骤 | 操作 | 验证 |
|------|------|------|
| 1 | 记录当前 commit **A** · `pnpm ops:status:staging` | version.gitSha = A |
| 2 | `pnpm ops:deploy:staging -- <commit-B>` | health OK · version = B |
| 3 | Admin 登录 · `/preview` 冒烟 · SSE 打字机 | PASS |
| 4 | `pnpm ops:rollback:staging -- <commit-A>` | health OK · version = A |
| 5 | 再次 Admin + preview 冒烟 | PASS |
| 6 | 确认 DB migration 未回滚 | `\dt` / admin 列表仍可读 |

**停止条件：** 任一步 health/version 失败 · build 失败 · 不可向后兼容 migration 已应用且回滚 commit 依赖旧 schema。

---

## 3. Production 演练（Gate B · 用户确认后）

与 staging 相同流程，使用：

```bash
pnpm ops:deploy:production -- <commit-B> --confirm-production
pnpm ops:rollback:production -- <commit-A> --confirm-production
```

production 必须使用 **精确 commit hash**，不得使用分支名。

---

## 4. 不可自动回滚的情况

- migration 删除列/表且无 down 脚本
- import 写入不可逆数据变更

遇到上述情况：**停止脚本** · DBA 人工评估 · 不得假设 `rollback-environment.sh` 可恢复数据库。

---

## 5. 记录项（execution report）

- commit A / B 完整 hash
- deploy/rollback 时间（UTC）
- `/api/version` 截图或 curl 输出（无 secret）
- health database 状态
- 冒烟结果摘要
