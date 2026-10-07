#!/usr/bin/env python3
"""
Copyright 2026 Stephen Thompson / The Founded Project

Pull every string the atlas says in its own voice out of copy.js and
method.js, write them to one Markdown file, and run Stephen's voice gate on
it. Manuscript text never passes through here; only the atlas's own prose.

Usage: python3 scripts/atlas/export_copy.py [out.md]
"""
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
FILES = [REPO / "app/atlas/_components/copy.js", REPO / "app/atlas/_components/method.js"]
VOICE_CHECK = Path.home() / "Documents/Founded/Scripts/voice_check.py"

STR_RE = re.compile(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"|`((?:[^`\\]|\\.)*)`")


def strings(path: Path):
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    text = re.sub(r"^\s*//.*$", "", text, flags=re.M)
    out = []
    for m in STR_RE.finditer(text):
        s = next(g for g in m.groups() if g is not None)
        s = s.replace("\\'", "'").replace('\\"', '"')
        if len(s.split()) >= 3 and not s.startswith("/") and not re.fullmatch(r"[A-Za-z0-9_\-:/. ,]+\.[a-z]{2,4}", s):
            out.append(s)
    return out


def main():
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / "atlas-data" / "atlas-copy.md"
    lines = ["# Research Atlas copy (voice check)", ""]
    for f in FILES:
        lines += [f"## {f.name}", ""]
        for s in strings(f):
            lines.append(s)
            lines.append("")
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {out} ({sum(1 for l in lines if l.strip()) - 3} lines)")
    if VOICE_CHECK.exists():
        sys.exit(subprocess.call([sys.executable, str(VOICE_CHECK), "--class", "essay", str(out)]))
    print("voice_check.py not found; skipped")


if __name__ == "__main__":
    main()
