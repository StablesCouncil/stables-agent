#!/usr/bin/env bash
# Publish a completed Minima archive export to a public directory (checksum, latest symlink, retention).
# Typical flow: Minima completes "archive action:exportraw file:.../archive_YYYY-MM-DD.raw.dat"
# then:  MINIMA_PUBLIC_ARCHIVE_DIR=/var/www/minima-archive ./publish-archive-raw.sh /path/to/that/file.raw.dat
#
# Env:
#   MINIMA_PUBLIC_ARCHIVE_DIR  (default: /var/www/minima-archive)
#   MINIMA_RAW_RETAIN_DAYS     (default: 14)
#
# Requires: bash, cp, ln, find, sha256sum (coreutils)

set -euo pipefail

SRC=${1:-}
if [[ -z "$SRC" || ! -f "$SRC" ]]; then
  echo "usage: MINIMA_PUBLIC_ARCHIVE_DIR=/var/www/minima-archive $0 /path/to/archive_YYYY-MM-DD.raw.dat" >&2
  exit 2
fi

OUTDIR="${MINIMA_PUBLIC_ARCHIVE_DIR:-/var/www/minima-archive}"
RETAIN="${MINIMA_RAW_RETAIN_DAYS:-14}"
BN="$(basename -- "$SRC")"
if [[ "$BN" =~ ^archive_[0-9]{4}-[0-9]{2}-[0-9]{2}\.raw\.dat$ ]]; then
  DEST_NAME="$BN"
else
  DEST_NAME="archive_$(date -u +%Y-%m-%d).raw.dat"
fi
DEST="${OUTDIR}/${DEST_NAME}"

mkdir -p "$OUTDIR"
cp -a -- "$SRC" "$DEST"
(
  cd "$OUTDIR" && sha256sum "$DEST_NAME" >"${DEST_NAME}.sha256"
)
ln -sfn "$DEST_NAME" "${OUTDIR}/archive_latest.raw.dat"

# Prune dated archives older than RETAIN days (latest symlink is not matched by -name)
find "$OUTDIR" -maxdepth 1 -type f \( -name 'archive_*.raw.dat' -o -name 'archive_*.raw.dat.sha256' \) -mtime "+${RETAIN}" -print -delete 2>/dev/null || true

echo "published ${DEST}"
