#!/usr/bin/env python3
"""Conservative secret-pattern scanner; never prints matched values."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SKIP_PARTS = {".git", "node_modules", "dist", ".next"}
PATTERNS = {
    "Google API key-like string": re.compile(r"AIza[0-9A-Za-z_-]{30,}"),
    "private key PEM header": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "possible assigned credential": re.compile(
        r"(?:api[_-]?key|client[_-]?secret|refresh[_-]?token|service[_-]?role[_-]?key)\s*[=:]\s*['\"](?!YOUR_|your_|<|MY_)[^'\"]{16,}['\"]",
        re.IGNORECASE,
    ),
}
found = []
for path in ROOT.rglob("*"):
    if not path.is_file() or any(part in SKIP_PARTS for part in path.parts):
        continue
    if path.name == ".env.example" or path.suffix in {".lock", ".map", ".tsbuildinfo"}:
        continue
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        continue
    for label, pattern in PATTERNS.items():
        if pattern.search(text):
            found.append((path.relative_to(ROOT).as_posix(), label))
if found:
    for path, label in found:
        print(f"REVIEW: {path} — {label} (value suppressed)")
    print(f"Potential matches: {len(found)}. Review manually; this is not a complete secret scanner.")
    sys.exit(1)
print("No matches for the limited secret patterns. This is not proof that the package contains no secrets.")
