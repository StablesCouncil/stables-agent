#!/usr/bin/env python3
"""Run on the Council VPS as root. Appends MINIMA_DB_* to task_stablesagent-brain-base/.env
by parsing /root/.bash_history for a Minima / mysql info line mentioning StablesCouncil.
Does not print the password."""
from __future__ import annotations

import pathlib
import re
import sys

ENV_PATH = pathlib.Path("/root/stables-agent/task_stablesagent-brain-base/.env")
HIST_PATH = pathlib.Path("/root/.bash_history")


def extract_password(hist: str) -> str | None:
    # Minima log style: user:'StablesCouncil' password:'...' database:minima_archive
    pat = re.compile(
        r"user:'StablesCouncil'\s+password:'([^']+)'\s+database:minima_archive",
        re.IGNORECASE,
    )
    m = list(pat.finditer(hist))
    if m:
        return m[-1].group(1)
    # Alternate: password:')...@' without user quotes
    pat2 = re.compile(
        r"user:StablesCouncil\s+password:([^\s]+)\s+database:minima_archive",
        re.IGNORECASE,
    )
    m2 = list(pat2.finditer(hist))
    if m2:
        raw = m2[-1].group(1).strip("'\"")
        return raw
    return None


def main() -> int:
    if not HIST_PATH.is_file():
        print("NO_HISTORY", file=sys.stderr)
        return 1
    hist = HIST_PATH.read_text(errors="ignore")
    pw = extract_password(hist)
    if not pw:
        print("NO_PASSWORD_MATCH", file=sys.stderr)
        return 1

    if not ENV_PATH.is_file():
        print("NO_ENV_FILE", file=sys.stderr)
        return 1

    body = ENV_PATH.read_text(encoding="utf-8", errors="ignore")
    if "MINIMA_DB_USER=" in body:
        print("ALREADY_HAS_MINIMA_DB")
        return 0

    block = (
        "MINIMA_DB_HOST=127.0.0.1\n"
        "MINIMA_DB_PORT=3306\n"
        "MINIMA_DB_NAME=minima_archive\n"
        "MINIMA_DB_USER=StablesCouncil\n"
        f"MINIMA_DB_PASS={pw}\n"
    )
    ENV_PATH.write_text(body.rstrip("\n") + "\n" + block, encoding="utf-8")
    ENV_PATH.chmod(0o600)
    print("MERGE_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
