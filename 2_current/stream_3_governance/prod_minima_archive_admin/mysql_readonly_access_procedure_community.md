# Minima archive node: read-only MySQL access for analysts

**Purpose:** Let **people you authorise** **query** your Minima MySQL export (`syncblock`, `cascadedata`, `coins`, `txpow`, etc.) without giving them **write** access or your node’s writer credentials.

**Assumptions:**

- MySQL is bound to **loopback only** (`127.0.0.1` / socket), not open on the public internet.
- Analysts connect through an **SSH tunnel** (e.g. MySQL Workbench “Standard TCP/IP over SSH”).
- You already followed [Minima MySQL Setup](https://docs.minima.global/docs/user-guides/mysql/mysql-setup) and have a dedicated database schema (this guide uses `your_archive_db` as a placeholder; replace with your real name, e.g. `minimaarchive` or `minima_archive`).

**Disclaimer:** This is a practical runbook for operators. It is **not** a substitute for Minima’s official documentation. Adapt hostnames, usernames, and schema names to your environment. Use strong passwords and a password manager.

---

## Principles

1. **Never share the Minima writer account** (the MySQL user configured in `mysql action:setlogin`). That user must keep privileges to create tables and ingest data.
2. **One MySQL user per analyst** for read access (e.g. `ro_alice`). Easier to revoke one person without rotating everyone’s password.
3. **Read-only means `GRANT SELECT` only** on the archive schema. Do not grant `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP`, or broad `ALL PRIVILEGES` on `*.*`.
4. **SSH is a second gate.** Anyone who can SSH to the server can reach MySQL over the tunnel. Prefer **SSH keys per person** instead of one shared login password.
5. **Create both `@localhost` and `@127.0.0.1`** for each read-only user on Ubuntu-style installs, so both socket and TCP clients authenticate reliably.

---

## Why access should still be selective (read-only is not “harmless”)

`SELECT`-only stops **changing** the database, but several things can still go wrong:

| Risk | What happens |
|------|----------------|
| **Data exposure** | Anyone who can query the archive sees **everything** in that schema (amounts, addresses, metadata in your export). Treat it like sharing a **copy of chain analytics**, not “just read access.” |
| **SSH is powerful** | Workbench-over-SSH requires a **Linux login** on the server. Depending on how you set it up, that user might also read files, run processes, or use `sudo` if misconfigured. Prefer **dedicated** Linux users or **keys** with minimal rights, not shared admin shells. |
| **Load and stability** | Huge `SELECT`s, exports, or unindexed scans can **spike CPU, disk I/O, and RAM** on MySQL and the VM. That can **slow or stress** the same machine running Minima. |
| **Credential theft** | Stolen MySQL or SSH passwords/keys still allow **repeated** access until you revoke users and rotate keys. |
| **Compliance / agreements** | You may have duties about who may see financial or pseudonymous network data; access should match **policy**, not only technical limits. |

So “trusted” in practice means: people you are willing to give **visibility into that dataset** and **use of an SSH path to the server**, under rules you can enforce and revoke.

---

## Operator: create a read-only user

On the server, as a Linux user who can run admin MySQL:

```bash
sudo mysql
```

Replace `ro_alice`, `your_archive_db`, and the password with your values:

```sql
CREATE USER 'ro_alice'@'localhost' IDENTIFIED BY 'TEMP_PASSWORD_CHANGE_ME';
CREATE USER 'ro_alice'@'127.0.0.1' IDENTIFIED BY 'TEMP_PASSWORD_CHANGE_ME';

GRANT SELECT ON your_archive_db.* TO 'ro_alice'@'localhost';
GRANT SELECT ON your_archive_db.* TO 'ro_alice'@'127.0.0.1';

FLUSH PRIVILEGES;

SHOW GRANTS FOR 'ro_alice'@'localhost';
SHOW GRANTS FOR 'ro_alice'@'127.0.0.1';
```

**Verify read access:**

```bash
mysql --protocol=TCP -h 127.0.0.1 -P 3306 -u ro_alice -p your_archive_db -e "SELECT 1;"
mysql -u ro_alice -p your_archive_db -e "SELECT 1;"
```

**Verify writes are denied** (expect an error):

```bash
mysql --protocol=TCP -h 127.0.0.1 -P 3306 -u ro_alice -p your_archive_db -e "CREATE TABLE ro_test_should_fail(id INT);"
```

Hand the analyst: how to **SSH** (key or policy), **MySQL username**, **temporary password**, and **default schema** name.

**Tip:** If you also use Minima RPC commands with `password:value` style parameters, avoid **`:`** and spaces in the **MySQL** writer password to reduce parsing issues. Read-only users who only use Workbench can use strong passphrases with symbols.

---

## Analyst: choose your own password

After connecting as yourself (Workbench or `mysql` client):

```sql
ALTER USER USER() IDENTIFIED BY 'TheirNewStrongPassword';
```

Use a unique password in a password manager. The operator does not need your final password.

---

## Analyst: MySQL Workbench (Standard TCP/IP over SSH)

| Field | Value |
|--------|--------|
| **Connection Name** | Any label you like (e.g. “Minima archive read-only”) |
| **Connection Method** | Standard TCP/IP over SSH |
| **SSH Hostname** | Your server’s public IP or DNS name |
| **SSH Username** | Linux account you are allowed to use for SSH |
| **SSH Key File** | Path to your **private** key, if you use key authentication |
| **SSH Password** | Only if the server accepts password SSH (otherwise leave empty) |
| **MySQL Hostname** | `127.0.0.1` |
| **MySQL Server Port** | `3306` (unless you changed MySQL’s port) |
| **Username** | Your personal read-only MySQL user (e.g. `ro_alice`) |
| **Password** | Store in Vault after you set it (temp from admin, then change with `ALTER USER` above) |
| **Default Schema** | `your_archive_db` (same as in `GRANT`) |

**SSL tab:** Defaults are usually fine for MySQL on `127.0.0.1` through the tunnel.

**Smoke test:**

```sql
SELECT 1;
SELECT MAX(block) FROM syncblock;
```

(Adjust table/column names if your schema differs.)

---

## Operator: revoke access

```sql
DROP USER IF EXISTS 'ro_alice'@'localhost';
DROP USER IF EXISTS 'ro_alice'@'127.0.0.1';
FLUSH PRIVILEGES;
```

Also remove their **SSH key** or **Linux user** if you gave them dedicated shell access.

---

## Further reading

- [Minima: MySQL Setup](https://docs.minima.global/docs/user-guides/mysql/mysql-setup)
- [Minima: Export data to MySQL](https://docs.minima.global/docs/user-guides/mysql/mysql-exportto)

---

## Sharing this document

Safe to post in a **public** repo or gist if you keep it **generic**: no real IPs, hostnames, or passwords. Screenshots of Workbench should redact addresses and usernames if they identify production systems.

**Suggested short attribution** (optional):  
*Community runbook; adapt to your own security policy.*
