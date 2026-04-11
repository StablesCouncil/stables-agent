# Minima archive MySQL: read-only access for analysts

**Audience:** Council admins who operate the archive VPS and grant query access.  
**Scope:** MySQL user lifecycle only (create, rotate, revoke). Assumes MySQL listens on **127.0.0.1** (not exposed to the public internet) and analysts connect via **SSH** (Workbench tunnel or equivalent).

**Status:** Internal runbook. **Test on a second machine** before treating as final. For a **public** GitHub copy, publish a **redacted** variant (no hostnames, IPs, or real usernames) and keep secrets only in `vault.md` or your password manager.

---

## Principles

1. **Never share `minima_sql`.** That account is for the Minima node (writes, schema updates). Do not give it to analysts.
2. **One MySQL user per person** for read access (e.g. `ro_alice`, `ro_bob`). Shared passwords make revocation and auditing harder.
3. **Read-only = `GRANT SELECT` only** on the archive schema (e.g. `minima_archive`). Do not grant `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP`, or global privileges.
4. **SSH access is a second gate.** Whoever can SSH to the box can tunnel to MySQL. Prefer **per-person SSH keys** on the server over one shared password.
5. **MySQL host matching:** On Ubuntu, loopback clients may authenticate as `@localhost` or `@127.0.0.1`. Create **both** host entries for each user so Workbench and CLI behave consistently.

---

## Admin: create a read-only user

Run on the **VPS** as a Linux user who can open root MySQL:

```bash
sudo mysql
```

In the MySQL prompt (replace placeholders):

```sql
-- Replace ro_alice and passwords with real values
CREATE USER 'ro_alice'@'localhost' IDENTIFIED BY 'TEMP_PASSWORD_CHANGE_ME';
CREATE USER 'ro_alice'@'127.0.0.1' IDENTIFIED BY 'TEMP_PASSWORD_CHANGE_ME';

GRANT SELECT ON minima_archive.* TO 'ro_alice'@'localhost';
GRANT SELECT ON minima_archive.* TO 'ro_alice'@'127.0.0.1';

FLUSH PRIVILEGES;

SHOW GRANTS FOR 'ro_alice'@'localhost';
SHOW GRANTS FOR 'ro_alice'@'127.0.0.1';
```

**Verify** from shell (should return `1`):

```bash
mysql --protocol=TCP -h 127.0.0.1 -P 3306 -u ro_alice -p minima_archive -e "SELECT 1;"
mysql -u ro_alice -p minima_archive -e "SELECT 1;"
```

**Verify write is denied** (should error):

```bash
mysql --protocol=TCP -h 127.0.0.1 -P 3306 -u ro_alice -p minima_archive -e "CREATE TABLE ro_test_should_fail(id INT);"
```

Deliver to the analyst: **SSH method** (key or account policy), **MySQL username** `ro_alice`, **temporary password**, and **default schema** `minima_archive`.

**Password hygiene:** Prefer passwords without **`:`** (colon) or spaces for compatibility with Minima-style RPC parsers elsewhere. Analysts may still use strong passphrases with symbols if they only use Workbench.

---

## Analyst: set their own password

After logging in to MySQL as themselves (Workbench or `mysql` CLI), run:

```sql
ALTER USER USER() IDENTIFIED BY 'TheirNewStrongPassword';
```

They should use a unique password stored in a password manager. Admins do not need the final password.

---

## Analyst: MySQL Workbench (Standard TCP/IP over SSH)

| Field | Value |
|--------|--------|
| **Connection Name** | Descriptive label (e.g. organisation + read-only) |
| **Connection Method** | Standard TCP/IP over SSH |
| **SSH Hostname** | VPS public IP or DNS (internal doc: your archive host) |
| **SSH Username** | Linux account allowed to SSH (e.g. `linuxuser`) |
| **SSH Key File** | Private key path, if using key auth |
| **SSH Password** | Only if using password SSH (otherwise clear) |
| **MySQL Hostname** | `127.0.0.1` |
| **MySQL Server Port** | `3306` |
| **Username** | `ro_alice` (their personal read-only user) |
| **Password** | Store in Vault (temp password, then they change via `ALTER USER` above) |
| **Default Schema** | `minima_archive` |

**SSL tab:** Usually default is fine for `127.0.0.1` through the tunnel.

**Test:** Run `SELECT 1;` and a light query, e.g. `SELECT MAX(block) FROM syncblock;`

---

## Admin: revoke access

```sql
DROP USER IF EXISTS 'ro_alice'@'localhost';
DROP USER IF EXISTS 'ro_alice'@'127.0.0.1';
FLUSH PRIVILEGES;
```

Also remove their **SSH key** or **Linux user** if you issued dedicated access.

---

## Optional: template read-only role name

Council may standardise prefixes, e.g. `ro_<shortname>` or `archive_ro_<shortname>`, documented in `vault.md` alongside who owns which account (no passwords in git).

---

## Publishing to GitHub

**Community copy (redacted, generic):** Use the file next to this one for public sharing:

`mysql_readonly_access_procedure_community.md`

It uses placeholder schema names, removes Stables-internal paths, and is suitable for a public repo, gist, or forum post after your own testing.

**This file** (`mysql_readonly_access_procedure.md`) remains the **internal** canonical runbook with Council repo references.

**Avoid in public posts:** real IPs, hostnames, `GRANT` output from production, or Workbench screenshots that expose infrastructure.

---

## Reference

- Minima MySQL overview: [MySQL Setup](https://docs.minima.global/docs/user-guides/mysql/mysql-setup) (official docs).
- Handshake index: `0_handshake/README.md` and `0_handshake/session_map.md` point to this procedure for admin tasks.
