#!/usr/bin/env python3
"""Verify or import original v213 scene bytes. Never overwrite a different asset."""
import argparse
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / "assets" / "scene-assets-v220.json").read_text(encoding="utf-8"))
def digest(data):
    return hashlib.sha256(data).hexdigest()
def valid(data, entry):
    git = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
    return len(data) == entry["bytes"] and digest(data) == entry["sha256"] and git == entry["gitBlob"]
def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--archive", type=Path, help="Original approved ZIP archive")
    ap.add_argument("--apply", action="store_true", help="Copy verified missing scenes (default is dry-run)")
    args = ap.parse_args()
    if args.apply and not args.archive:
        ap.error("--apply requires --archive")
    entries = manifest["scenes"]
    if len(entries) != 21 or len({e["file"] for e in entries}) != 21:
        raise SystemExit("Invalid manifest")
    pending, errors = [], []
    if args.archive:
        with ZipFile(args.archive) as z:
            if z.testzip() is not None:
                raise SystemExit("Damaged ZIP")
            for e in entries:
                path = root / e["file"]
                try:
                    data = z.read(e["file"])
                except KeyError:
                    errors.append(e["file"] + ": missing from ZIP")
                    continue
                if not valid(data, e):
                    errors.append(e["file"] + ": ZIP checksum mismatch")
                elif path.exists():
                    if not valid(path.read_bytes(), e):
                        errors.append(e["file"] + ": existing file differs; no overwrite")
                else:
                    pending.append((path, data))
        if errors:
            raise SystemExit("\n".join(errors))
        if args.apply:
            for path, data in pending:
                path.parent.mkdir(parents=True, exist_ok=True)
                with path.open("xb") as f:
                    f.write(data)
            print("Imported", len(pending), "original scene files")
        else:
            print("Dry run: verified all 21 ZIP assets;", len(pending), "missing destination files")
            return
    for e in entries:
        path = root / e["file"]
        if not path.is_file() or not valid(path.read_bytes(), e):
            errors.append(e["file"])
    if errors:
        raise SystemExit("Missing or mismatched: " + ", ".join(errors))
    print("PASS: 21 approved scene assets match SHA-256 and Git blob SHA")
if __name__ == "__main__":
    main()
