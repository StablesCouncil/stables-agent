# Minima archive node: full MySQL parity + continuous updates

**Audience:** Operator on the VPS (e.g. SSH as `linuxuser@…`).  
**Goal:** (1) MySQL holds **the same block range as the node archive** where Minima supports it. (2) **`syncblock`** / related tables **keep up** via autobackup. (3) **`coins`** **keeps up** via **`mysqlcoins`** autobackup. (4) **`txpow`** fills over time with **`-mysqlalltxpow`** + autobackup + pruning.

**Minima 1.0.x behaviour:** Scheduled **`mysql action:update`** and **`mysqlcoins action:update`** run about **every 2 hours** when autobackup flags are on.

### CRITICAL: `autobackup enable:false` clears MySQL login (1.0.45)

In **Minima 1.0.45**, both of these commands **wipe the same stored fields** (`mysql_host`, `mysql_db`, `mysql_user`, `mysql_password`) when **`enable:false`**:

- **`mysql action:autobackup enable:false`**
- **`mysqlcoins action:autobackup enable:false`**

So **`mysqlcoins`** (or **`mysql action:wipe`**, **`update`**, **`info`** without fresh params) will fail with **JDBC connection errors** until you run the **full** **`mysql … action:setlogin`** line again.

If you run **both** disables, you must run **full `setlogin` after each disable**, or run **`setlogin` once** after the second disable (because the second command cleared credentials again).

**Safer alternative before a wipe:** stop Minima, wipe tables with **`sudo mysql`** (see section C), start Minima, then **`setlogin`** once. That avoids relying on **`enable:false`**.

---

## A. One-time hygiene (avoid silent autobackup failure)

1. **`minima_sql` password:** use a **strong password with no `:` (colon)**. Colons break the internal command string Minima builds for the 2-hour job.
2. **MySQL user rows:** ensure both exist (TCP + name resolution):

   ```sql
   -- run: sudo mysql
   SELECT user, host FROM mysql.user WHERE user = 'minima_sql';
   ```

   You want **`localhost`** and **`127.0.0.1`**, same password, **`mysql_native_password`** if JDBC misbehaves.

3. **`systemd` `ExecStart`:** do not put raw **`$`** in **`-rpcpassword`** (use **`$$`** or an alphanumeric RPC password).

---

## B. Point Minima at MySQL (RPC console, HTTPS + RPC password)

Use the **full** line (never bare `mysql action:setlogin` if stored creds are wrong):

```text
mysql host:127.0.0.1:3306 database:minima_archive user:minima_sql password:YOUR_MINIMA_SQL_PASSWORD action:setlogin
```

Confirm:

```text
mysql action:info
```

Expect **`status":true`**, **`logindetails":true`**.

---

## C. Full DB parity with archive (destructive; only when MySQL is missing the low end)

**When:** `mysql action:info` shows **`archivestart`** **less than** **`mysqlstart`** by more than a few blocks (MySQL never backfills **older** blocks than your current minimum; **`mysql action:update` alone cannot fix that**).

**1. Backup (as `linuxuser`):**

```bash
sudo mysqldump minima_archive > ~/minima_archive_backup_$(date +%Y%m%d).sql
```

**2. Pause automatic exports (pick one approach)**

- **A (RPC, 1.0.45-safe):** run disables **then restore login after each step that clears it:**

```text
mysql action:autobackup enable:false
mysql host:127.0.0.1:3306 database:minima_archive user:minima_sql password:YOUR_PASSWORD action:setlogin
mysqlcoins action:autobackup enable:false
mysql host:127.0.0.1:3306 database:minima_archive user:minima_sql password:YOUR_PASSWORD action:setlogin
```

- **B (cleaner):** `sudo systemctl stop minima`, then wipe with **`sudo mysql`** (section **C-alt** below), `sudo systemctl start minima`, then **one** **`setlogin`**. No **`enable:false`** needed.

**3. Wipe export tables**

- **RPC (requires working `setlogin` after step 2):**

```text
mysql action:wipe
```

- **C-alt: SQL wipe while Minima is stopped** (`sudo systemctl stop minima` first):

```bash
sudo mysql minima_archive -e "
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE syncblock;
TRUNCATE TABLE cascadedata;
TRUNCATE TABLE coins;
TRUNCATE TABLE txpow;
SET FOREIGN_KEY_CHECKS=1;
"
```

Adjust table names if your schema differs (`SHOW TABLES;`). Then **`systemctl start minima`** and **`setlogin`** before **`mysql action:update`**.

**4. Reload all blocks from archive (RPC; can run a long time):**

```text
mysql action:update
```

Repeat **`mysql action:update`** until **`mysql action:info`** shows **`mysqlend`** aligned with **`archiveend`** (small gap OK while the chain moves).

**5. Optional check (RPC):**

```text
mysql action:integrity
```

(if supported in your build)

**6. Re-enable block autobackup (RPC):**

```text
mysql action:autobackup enable:true
mysql action:info
```

**7. Rebuild `coins` from `syncblock` (RPC; long):**

```text
mysqlcoins action:update
```

Or batched: **`mysqlcoins action:update maxcoins:200000`** repeated until caught up.

**8. Re-enable coins autobackup (RPC):**

```text
mysqlcoins action:autobackup enable:true
mysqlcoins action:info
```

Expect **`autobackup":true`**.

---

## D. “Keep updating forever” checklist (no wipe)

**Service (`systemd`):** `-archive`, `-mysqlalltxpow`, stable peers (e.g. `megammr`).

**RPC:**

```text
mysql action:info
```

- **`autobackup":true`**
- **`logindetails":true`**
- **`storealltxpow":true`** (for **`txpow`** path)

```text
mysqlcoins action:info
```

- **`autobackup":true`**

**Logs (about every 2 hours):**

```bash
sudo journalctl -u minima --since "24 hours ago" --no-pager | grep -E 'MYSQL AUTOBACKUP|MYSQLCOINS AUTOBACKUP'
```

You want **`MYSQL AUTOBACKUP OK`** and **`MYSQLCOINS AUTOBACKUP OK`**, not only **`[ERROR]`**.

**Disk:**

```bash
df -h /
```

**MySQL sanity:**

```sql
SELECT MIN(block) AS lo, MAX(block) AS hi, COUNT(*) AS n FROM syncblock;
SELECT COUNT(*) FROM coins;
SELECT COUNT(*) FROM txpow;
```

- **`syncblock`** **`lo` / `hi`** track **`mysql action:info`** over time.
- **`coins`** grows with **`mysqlcoins`**.
- **`txpow`** may stay **0** for a long time after a wipe; refills after pruning (often **24–48h** in docs).

---

## E. After any `minima_sql` password change

Always re-save login with the **full** **`setlogin`** line (see section B). Otherwise the 2-hour job fails while manual **`info`** may still confuse you until the next restart.

---

## F. Read-only analysts

See **`mysql_readonly_access_procedure.md`** (internal) and **`mysql_readonly_access_procedure_community.md`** (public redacted copy).
