#!/usr/bin/env python3
"""
Trigger one Minima archive export over local HTTPS RPC (same pattern as Minima VPS docs:
https://.../archive%20action:exportraw%20file:...).

Reads -rpcpassword from `systemctl show minima -p ExecStart` (no argv secrets). Intended to
run on the archive VPS only as root.

Usage:
  python3 run-minima-exportraw-once.py integrity
  python3 run-minima-exportraw-once.py /var/www/minima-archive/.staging/archive_2026-04-18.raw.dat
"""

from __future__ import annotations

import base64
import re
import ssl
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request


def rpc_password_from_systemd() -> str:
    s = subprocess.check_output(
        ["systemctl", "show", "minima", "-p", "ExecStart", "--value"],
        text=True,
    )
    m = re.search(r"-rpcpassword\s+(.+?)\s+-rpcssl\b", s)
    if not m:
        raise RuntimeError("Could not parse -rpcpassword before -rpcssl from minima.service ExecStart.")
    return m.group(1).strip()


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: run-minima-exportraw-once.py integrity", file=sys.stderr)
        print("       run-minima-exportraw-once.py /absolute/path/to/output.raw.dat", file=sys.stderr)
        return 2

    arg = sys.argv[1]
    if arg == "integrity":
        cmd = "archive action:integrity"
        timeout = 300
    else:
        out_path = arg
        if not out_path.startswith("/"):
            print("error: output path must be absolute", file=sys.stderr)
            return 2
        cmd = f"archive action:exportraw file:{out_path}"
        timeout = 7200

    path = "/" + urllib.parse.quote(cmd, safe="/:.")
    url = "https://127.0.0.1:9005" + path

    pw = rpc_password_from_systemd()
    auth = base64.b64encode(f"minima:{pw}".encode()).decode()
    req = urllib.request.Request(url, method="GET")
    req.add_header("Authorization", f"Basic {auth}")

    ctx = ssl._create_unverified_context()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=timeout) as r:
            body = r.read()
    except urllib.error.HTTPError as e:
        print(e.read().decode(errors="replace")[:4000], file=sys.stderr)
        return 1
    except Exception as e:
        print(str(e), file=sys.stderr)
        return 1

    text = body.decode(errors="replace")
    print(text[:8000])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
