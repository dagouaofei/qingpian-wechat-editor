# Production 环境登记

> S11-STORY-001 / S11-STORY-004 · 华北 2（北京）· **勿提交 secret**

**须在 staging checklist A~E 全部 PASS 后** 创建或启用 production 资源。

---

## 1. 基本信息

| 项 | 值 |
|----|-----|
| 环境名 | production |
| 地域 | cn-beijing |
| 公网域名 / URL | ☐ 待填 |
| 登记日期 | ☐ |
| 登记人 | ☐ |

---

## 2. ECS

| 项 | 值 |
|----|-----|
| 实例 ID | ☐ |
| 规格 | ☐ |
| 内网 IP | ☐ |
| 公网 IP / EIP / SLB | ☐ |
| 安全组 ID | ☐ |
| HTTPS 证书 | ☐ Nginx / SLB · 到期日 ☐ |

---

## 3. RDS PostgreSQL

| 项 | 值 |
|----|-----|
| 实例 ID | ☐ |
| 数据库名 | ☐ |
| 内网地址:端口 | ☐ |
| 备份策略 | ☐ 自动备份已开启 |

---

## 4. OSS / SLS / CloudMonitor

同 [staging.md](staging.md) §4~§6 结构 · production 独立资源 ID。

---

## 5. 部署与验收（S11-STORY-004）

| 项 | 值 |
|----|-----|
| 上线日期 | ☐ |
| Git commit / tag | ☐ |
| migrate + import | ☐ PASS |
| health | ☐ PASS |
| checklist A~E | ☐ PASS |
| 回滚演练日期 | ☐ 见 execution report |

---

## 6. Session / 凭证隔离

- [ ] production `STYLE_ADMIN_SESSION_SECRET` **独立于** staging
- [ ] production admin password hash **独立于** staging
