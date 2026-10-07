#!/usr/bin/env python3
"""
Copyright 2026 Stephen Thompson / The Founded Project

build_atlas.py: the Research Atlas extractor for The Founded Project.

Reads the manuscript vault READ-ONLY and writes structured ledgers into
atlas-data/ in this repo. The website reads those records; it never reads
the manuscript. Re-running the script is the correction process: fix the
manuscript file, run again, commit the regenerated data.

Inputs (per chapter folder under the six Part folders)
  CHxx - Draft.md              text of record: frontmatter, prose, [^notes], Sources
  CHxx - Research Map.md       claim table, validating sources, counterpoints
  CHxx - Contrarian Review.md  fifteen-question review with verdicts
  CHxx - Overview.md           core claim, purpose, key concepts, movement
  CHxx - Questions.md          diagnostic, inquiry, and workbook questions
  Frameworks / Story Notes / Revision Notes are author-private and NOT read.

Project-level inputs
  00 - Governance/Founded Canon v1.0.md, Canon Addendum v1.1.md,
  Founded Glossary v1.0.md

Outputs (atlas-data/)
  project.json chapters.json claims.json sources.json challenges.json
  terms.json gaps.json link-validation.json id-registry.json
  claims.csv sources.csv chapters.csv challenges.csv terms.csv
  master-dossier.md  dossier/CHxx.md  gap-report.md

Stable IDs
  FP-CH02 / FP-CH02-C014 / FP-S0123 / FP-CH02-X03 / FP-T-agency
  Assigned once and kept in id-registry.json. A record whose text changes
  gets a new ID; the old one is marked retired, never reused.

Honesty rules
  Every rule-assigned classification carries a *_basis field naming the
  rule, and review_status stays "unreviewed" until a person checks it.
  Editor markers [[FLAG: ...]] are stripped from all output and only
  counted. Nothing here invents a thesis, a summary, or a source.

Usage
  python3 scripts/atlas/build_atlas.py                 # rebuild ledgers
  python3 scripts/atlas/build_atlas.py --check-links   # also re-check URLs
  python3 scripts/atlas/build_atlas.py --manuscript "/path/to/vault"
"""

from __future__ import annotations

import argparse
import concurrent.futures
import csv
import datetime as dt
import json
import math
import re
import sys
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
DEFAULT_MANUSCRIPT = Path.home() / "Documents/Founded/Obsidian/The Founded Project Manuscript"
TODAY = dt.date.today().isoformat()
EDITION = "Private author edition 0.1"

PART_DIRS = [
    ("06 - Part I - Age of Extremes", "I", "Age of Extremes", "diagnosis"),
    ("07 - Part II - Dynamic Balance", "II", "Dynamic Balance", "foundation"),
    ("08 - Part III - Reclaiming Agency", "III", "Reclaiming Agency", "reclamation"),
    ("09 - Part IV - Governing Agency", "IV", "Governing Agency", "governance"),
    ("10 - Part V - Protecting Agency", "V", "Protecting Agency", "discernment"),
    ("11 - Part VI - Contributing Agency", "VI", "Contributing Agency", "contribution"),
]

CONTRARIAN_QUESTIONS = {
    1: "What could a smart critic say?",
    2: "Balance confused with compromise?",
    3: "Agency confused with blame?",
    4: "Governance confused with control?",
    5: "Contribution confused with self-erasure?",
    6: "Respects structural constraints?",
    7: "Protects moral boundaries?",
    8: "Avoids false equivalence?",
    9: "Enough lived experience?",
    10: "Needs research support?",
    11: "Serves the model?",
    12: "Sounds human?",
    13: "Overcenters AI?",
    14: "Overcenters the individual?",
    15: "Scales to family / community / institution / society?",
}

STOPWORDS = set("""
a an the and or but if then than that this these those of to in on at by for from with without
into onto over under about across after before between through during within as is are was were be
been being have has had do does did will would can could should may might must not no nor so such
it its they them their there here where when which who whom whose what why how all any each every
both few more most other some own same very just also only even still yet one two three four five
person people reader readers chapter chapters book life lives thing things way ways because while
toward towards against around through upon off out up down again further once
""".split())

FLAG_RE = re.compile(r"\[\[FLAG:.*?\]\]", re.S)
WIKILINK_RE = re.compile(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]")
MDLINK_RE = re.compile(r"\[([^\]]+)\]\((https?://(?:[^()\s]|\([^()\s]*\))+)\)")
URL_RE = re.compile(r"https?://(?:[^\s<>\"'\]*]|\([^()\s]*\))+")
PAGES_RE = re.compile(r"(?:\bpp?\.\s*|:\s*)(\d{1,4}\s*[\u2013\u2014-]\s*\d{1,4})\b|\b(chapters?|ch\.|books?|§|sections?)\s+([IVX\d][\w.\u2013-]*)", re.I)
NOTE_REF_RE = re.compile(r"\[\^([^\]]+)\]")
NOTE_DEF_RE = re.compile(r"^\[\^([^\]]+)\]:\s*(.*)$")
YEAR_RE = re.compile(r"\b(1[5-9]\d{2}|20\d{2})\b")
EMOJI_VERDICTS = [("🚩", "needs-stephen"), ("⚠️", "watch"), ("⚠", "watch"), ("✅", "holds")]


# --------------------------------------------------------------------------- text helpers

def read(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def strip_flags(text: str) -> tuple[str, int]:
    n = len(FLAG_RE.findall(text))
    t = FLAG_RE.sub("", text)
    t = re.sub(r"[ \t]{2,}", " ", t)
    t = re.sub(r"\s+([.,;:])", r"\1", t)
    return t, n


def wikilink_display(m: re.Match) -> str:
    target, alias = m.group(1), m.group(2)
    if alias:
        return alias.strip()
    return target.split("/")[-1].strip()


def plain(text: str) -> str:
    """Markdown to plain text. Links keep their label; URLs are tracked separately."""
    t = WIKILINK_RE.sub(wikilink_display, text)
    t = MDLINK_RE.sub(lambda m: m.group(1), t)
    t = re.sub(r"\*\*\*([^*]+)\*\*\*", r"\1", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"\1", t)
    t = re.sub(r"\*([^*\n]+)\*", r"\1", t)
    t = re.sub(r"`([^`]+)`", r"\1", t)
    t = t.replace(" ", " ")
    return re.sub(r"[ \t]{2,}", " ", t).strip()


def citation_plain(text: str) -> str:
    """Like plain() but keeps URLs visible after their labels, for citations."""
    t = WIKILINK_RE.sub(wikilink_display, text)
    t = MDLINK_RE.sub(lambda m: f"{m.group(1)} ({m.group(2)})", t)
    t = re.sub(r"\*\*\*([^*]+)\*\*\*", r"\1", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"\1", t)
    t = re.sub(r"\*([^*\n]+)\*", r"\1", t)
    return re.sub(r"[ \t]{2,}", " ", t).strip()


def urls_in(text: str) -> list[str]:
    seen, out = set(), []
    for u in URL_RE.findall(text):
        u = u.rstrip(".,;:")
        while u.endswith(")") and u.count(")") > u.count("("):
            u = u[:-1]
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def first_sentence(text: str) -> str:
    """The citation proper: text up to the first sentence break that is not an initial or abbreviation."""
    t = plain(text)
    for m in re.finditer(r"\.\s+(?=[A-Z\"\u201c])", t):
        before = t[: m.start()]
        if re.search(r"(?:^|\s)[A-Z]$|\b(?:eds?|trans|vol|no|pp?|ch|St|Dr|Mr|Ms|Jr|Sr|Inc|Co|U\.S|cf|et al)$", before):
            continue
        return before + "."
    return t


def lead_of(markdown: str) -> str:
    """Author/title lead: the bold run if present, else the citation up to its first title or quoted title."""
    m = re.match(r"^\*{2,3}(.+?)\*{2,3}", markdown)
    if m:
        return plain(m.group(1)).strip("* ").rstrip(".,")
    t = first_sentence(markdown)
    cut = len(t)
    for pat in (r",\s*[\"\u201c]", r",\s*\*", r"\s\("):
        mm = re.search(pat, markdown)
        if mm and mm.start() < cut:
            cut = mm.start()
    lead = plain(markdown[:cut]).strip().rstrip(",.;: ")
    return lead[:160] if lead else t[:160]


def pages_of(text: str) -> str | None:
    m = PAGES_RE.search(plain(text))
    if not m:
        return None
    return (m.group(1) or f"{m.group(2)} {m.group(3)}").strip()


def tokens(text: str) -> set[str]:
    words = re.findall(r"[a-z][a-z'-]{3,}", text.lower())
    out = set()
    for w in words:
        w = w.strip("'-")
        if w in STOPWORDS or len(w) < 4:
            continue
        # light stemming so "erodes" meets "erosion" halfway
        for suf in ("ing", "edly", "ed", "es", "s", "ly"):
            if w.endswith(suf) and len(w) - len(suf) >= 4:
                w = w[: -len(suf)]
                break
        out.add(w)
    return out


def norm_key(text: str, n: int = 120) -> str:
    t = plain(text).lower()
    t = re.sub(r"[^a-z0-9 ]+", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t[:n]


def split_h2(body: str) -> list[tuple[str, str]]:
    """Split markdown on '## ' headings. Returns [(heading, text)], heading '' for preamble."""
    out, cur, buf = [], "", []
    for line in body.split("\n"):
        if line.startswith("## "):
            out.append((cur, "\n".join(buf).strip()))
            cur, buf = line[3:].strip(), []
        else:
            buf.append(line)
    out.append((cur, "\n".join(buf).strip()))
    return out


def section(sections: list[tuple[str, str]], name: str, prefix: bool = False) -> str:
    for h, t in sections:
        if h == name or (prefix and h.startswith(name)):
            return t
    return ""


def bullets(text: str) -> list[dict]:
    """Top-level '- ' bullets with nested lines attached as children."""
    items = []
    for line in text.split("\n"):
        if re.match(r"^- ", line):
            items.append({"text": line[2:].strip(), "children": []})
        elif re.match(r"^\s{2,}[-*] ", line) and items:
            items[-1]["children"].append(line.strip()[2:].strip())
        elif line.strip() and items and not line.startswith("#") and not line.startswith("|"):
            # continuation line of the previous bullet
            items[-1]["text"] += " " + line.strip()
    return items


def numbered(text: str) -> list[str]:
    return [m.group(1).strip() for m in re.finditer(r"^\d+\.\s+(.*)$", text, re.M)]


def paragraphs(text: str) -> list[str]:
    return [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]


def table_rows(text: str) -> tuple[list[str], list[list[str]]]:
    header, rows = [], []
    for line in text.split("\n"):
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c):
            continue
        if not header:
            header = cells
        else:
            rows.append(cells)
    return header, rows


def sentences_with_notes(par: str) -> list[tuple[str, list[str]]]:
    """Split a paragraph into sentences; return (clean_sentence, [note keys])."""
    t = NOTE_REF_RE.sub(lambda m: f"⟦{m.group(1)}⟧", par)
    parts = re.split(r"((?<=[.!?])[\"”’)]*(?:⟦[^⟧]+⟧)*)\s+(?=[A-Z“\"(*])", t)
    sents = []
    for i in range(0, len(parts), 2):
        s = parts[i] + (parts[i + 1] if i + 1 < len(parts) else "")
        keys = re.findall(r"⟦([^⟧]+)⟧", s)
        clean = re.sub(r"⟦[^⟧]+⟧", "", s).strip()
        if clean:
            sents.append((clean, keys))
    return sents


def surnames(text: str) -> set[str]:
    """Capitalized words that look like names, from a short lead string."""
    words = re.findall(r"\b[A-Z][a-zA-Z'\-]{3,}\b", plain(text))
    skip = {"The", "This", "That", "With", "From", "Press", "University", "Journal", "Review",
            "Theory", "Research", "Institute", "Center", "Centre", "Foundation", "Report", "Study",
            "American", "National", "Social", "Science", "Psychology", "Health", "Public", "Human",
            "New", "York", "London", "Oxford", "Cambridge", "Stanford", "Harvard", "Princeton",
            "Books", "Editorial", "Documentary", "Netflix", "Wikipedia", "Global", "World", "United",
            "States", "Behavioral", "Clinical", "Political", "Economic", "Economics", "History"}
    return {w for w in words if w not in skip}


def italic_titles(text: str) -> list[str]:
    return [m.group(1).strip() for m in re.finditer(r"\*([^*\n]{4,})\*", text)]


def first_emoji_verdict(line: str) -> str | None:
    found = [(line.find(e), v) for e, v in EMOJI_VERDICTS if e in line]
    if not found:
        if re.search(r"\bN/A\b", line):
            return "not-applicable"
        return None
    # worst verdict wins when several appear
    order = {"needs-stephen": 0, "watch": 1, "holds": 2}
    return sorted((v for _, v in found), key=lambda v: order[v])[0]


# --------------------------------------------------------------------------- registry

class Registry:
    """Stable-ID registry. Keys are normalized content; IDs are never reused."""

    def __init__(self, path: Path):
        self.path = path
        self.data = {"claims": {}, "sources": {}, "challenges": {}, "counters": {}}
        if path.exists():
            self.data.update(json.loads(read(path)))
        self.seen: dict[str, set[str]] = defaultdict(set)

    def assign(self, kind: str, key: str, counter: str, fmt) -> str:
        table = self.data[kind]
        if key in table:
            table[key]["last_seen"] = TODAY
            table[key].pop("retired", None)
        else:
            n = self.data["counters"].get(counter, 0) + 1
            self.data["counters"][counter] = n
            table[key] = {"id": fmt(n), "first_seen": TODAY, "last_seen": TODAY}
        self.seen[kind].add(key)
        return table[key]["id"]

    def retire_unseen(self):
        retired = []
        for kind in ("claims", "sources", "challenges"):
            for key, rec in self.data[kind].items():
                if key not in self.seen[kind] and not rec.get("retired"):
                    rec["retired"] = TODAY
                    retired.append(rec["id"])
        return retired

    def save(self):
        self.path.write_text(json.dumps(self.data, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


# --------------------------------------------------------------------------- classification rules

def classify_source_type(text: str, urls: list[str]) -> tuple[str, str]:
    """Classify on the citation proper first; fall back to the whole annotation."""
    core = first_sentence(text)
    kind, basis = _classify_source_type(core, urls)
    if kind == "unclassified" and core != plain(text):
        kind, basis = _classify_source_type(text, urls)
        basis += " (matched in the annotation, not the citation)"
    return kind, basis


def _classify_source_type(text: str, urls: list[str]) -> tuple[str, str]:
    t = text.lower()
    u = " ".join(urls).lower()
    if "wikipedia" in t or "wikipedia.org" in u:
        return "encyclopedia (tertiary)", "names Wikipedia"
    if re.search(r"\(([A-Z][A-Za-z ,.]+): [^)]*?(1[5-9]|20)\d{2}\)", text):
        return "book", "Chicago-style (City: Publisher, Year) parenthetical"
    journal_domains = ["ncbi.nlm.nih.gov", "pubmed", "sciencedirect", "frontiersin", "journals.sagepub",
                       "doi.org", "springer", "wiley", "nature.com", "elifesciences", "tandfonline",
                       "jstor", "psycnet", "academic.oup.com", "cambridge.org/core", "pnas.org",
                       "annualreviews", "apa.org/pubs", "journals.plos", "bmj.com", "thelancet"]
    if any(d in u for d in journal_domains):
        return "peer-reviewed article", "URL domain is a journal or index"
    if any(d in u for d in [".gov/", "who.int", "imf.org", "federalreserve.gov", "cdc.gov", "census.gov", "bls.gov"]):
        return "government or intergovernmental report", "URL domain"
    if any(d in u for d in ["psychologytoday", "medium.com", "nytimes", "theatlantic", "newyorker", "vox.com", "theguardian", "washingtonpost"]):
        return "popular press", "URL domain"
    if re.search(r"\(netflix|\bdocumentary\b|\(film", t):
        return "film or documentary", "keyword"
    pub = r"(press|norton|penguin|random house|harper|simon|bloomsbury|publicaffairs|routledge|polity|melville|basic books|viking|knopf|little, brown|farrar|scribner|crown|portfolio|ecco|free press|houghton|doubleday|pantheon|beacon|hachette|macmillan|wiley|verso|\bup\b)"
    if re.search(r"\*[^*]+\*[^*]*\(" + pub, t) or re.search(r"\((?:new york|london|boston|chicago|oxford|cambridge|princeton|stanford|new haven|berkeley)[^)]*\d{4}\)", t):
        return "book", "publisher or city-year cue beside an italic title"
    if re.search(r"\bvol\.?\s*\d|\bjournal\b|\bquarterly\b|\bbulletin\b|\bpp?\.\s*\d|\b\d+\s*\(\d+\)|\breview\b[^.]*\b\d{4}\b", t):
        return "journal article", "volume, page, or journal cue"
    if any(k in t for k in ["gallup", "pew ", "commonwealth fund", "mckinsey", "brennan center", "aclu", "nirs", "nctq",
                            "center for humane technology", "surgeon general", "consumer financial protection",
                            "institute", "foundation", "survey", "statement", "curriculum", "data"]):
        return "institutional report or data", "institution keyword"
    if re.search(r"\((19|20)\d{2}\)", t) and italic_titles(text):
        return "book", "italic title with year"
    if italic_titles(text):
        return "book or long-form work", "italic title only"
    return "unclassified", "no rule matched; classify on review"


def classify_designation(text: str, source_type: str) -> tuple[str, str]:
    t = text.lower()
    if re.search(r"\b(aristotle|lao tzu|tao te ching|yi jing|confucius|plato|kant|rawls|berlin|popper|skinner|bandura|seligman|bowen|erikson|minsky|durkheim|tajfel|maslach|mcewen|sterling|felitti|porges|herman|loewenstein|kahneman|zuboff|putnam|fukuyama|greenleaf|bourdieu|boykoff|leary|whitehouse|van der kolk)\b", t) and source_type in ("book", "journal article", "peer-reviewed article", "book or long-form work"):
        return "primary (the work being cited)", "named original author of the theory or study"
    if source_type in ("peer-reviewed article", "journal article", "government or intergovernmental report", "institutional report or data"):
        return "primary research or data", "source type"
    if source_type in ("encyclopedia (tertiary)", "popular press", "film or documentary"):
        return "secondary or tertiary", "source type"
    if source_type == "book":
        return "secondary (synthesis)", "trade or academic book not matched as an original author"
    return "unclassified", "classify on review"


def resolution_from_effect(effect: str) -> str:
    e = effect.lower()
    if re.search(r"no (adjustment|change|revision)s? (is |are )?(needed|required|necessary)|already (handles|addresses|frames|meets)|no adjustment", e):
        return "no-change-needed"
    if re.search(r"suggested adjustment|one-sentence|would help|worth (a|an|adding|one)|should (add|note|acknowledge)|needs? (a|an|to)|consider adding|recommend", e):
        return "revision-suggested"
    return "open"


# --------------------------------------------------------------------------- parsers

def parse_frontmatter(raw: str) -> tuple[dict, str]:
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n?", raw, re.S)
    if not m:
        return {}, raw
    meta = {}
    for line in m.group(1).split("\n"):
        mm = re.match(r"^([a-z_]+):\s*(.*)$", line)
        if mm:
            meta[mm.group(1)] = mm.group(2).strip().strip('"').strip("'")
    return meta, raw[m.end():]


def parse_draft(path: Path) -> dict:
    raw = read(path)
    meta, body = parse_frontmatter(raw)
    body, flag_count = strip_flags(body)
    lines = body.split("\n")
    notes: dict[str, str] = {}
    prose_lines = []
    in_sources = False
    for line in lines:
        if line.startswith("## Sources"):
            in_sources = True
            continue
        d = NOTE_DEF_RE.match(line.strip())
        if d:
            notes[d.group(1)] = d.group(2).strip()
            continue
        if in_sources:
            continue
        prose_lines.append(line)
    prose = "\n".join(prose_lines)
    title = ""
    m = re.search(r"^# (.+)$", prose, re.M)
    if m:
        title = m.group(1).strip()
        prose = prose[: m.start()] + prose[m.end():]
    secs = []
    for heading, text in split_h2(prose):
        pars = []
        for p in paragraphs(text):
            if p.startswith("---") or re.match(r"^>\s*End of CH\d\d", p):
                continue
            quote = p.startswith(">")
            txt = re.sub(r"^>\s?", "", p, flags=re.M) if quote else p
            txt = " ".join(l.strip() for l in txt.split("\n"))
            pars.append({"text": txt, "quote": quote, "notes": NOTE_REF_RE.findall(txt)})
        if heading or pars:
            secs.append({"heading": heading or "(opening)", "paragraphs": pars})
    word_count = sum(len(plain(p["text"]).split()) for s in secs for p in s["paragraphs"])
    return {"meta": meta, "title": title, "sections": secs, "notes": notes,
            "flag_count": flag_count, "word_count": word_count}


def parse_overview(path: Path) -> dict:
    secs = split_h2(read(path))

    def txt(name):
        t = plain(section(secs, name))
        t = re.sub(r"\s*See CH\d\d - Draft\.?$", "", t.strip())
        return " ".join(t.split())

    def items(name):
        return [plain(b["text"]) for b in bullets(section(secs, name))]

    related = []
    for b in bullets(section(secs, "Related Core Theory Files")):
        m = re.search(r"(CT\d+ - [^\]|]+)", b["text"])
        related.append(m.group(1).strip() if m else plain(b["text"]))
    pull_quotes = [re.sub(r'^[“"]|[”"]$', "", q).strip() for q in items("Possible Pull Quotes")]
    return {
        "purpose": txt("Chapter Purpose"),
        "core_claim": txt("Core Claim"),
        "reader_problem": txt("Reader Problem"),
        "key_concepts": items("Key Concepts"),
        "related_core_theory": related,
        "ecosystem_connections": items("Ecosystem Connections"),
        "opening_story": items("Opening Story Candidates"),
        "movement": txt("Chapter Movement"),
        "required_research": txt("Required Research"),
        "contrarian_pressure": txt("Contrarian Pressure Points"),
        "takeaway": txt("Desired Reader Takeaway"),
        "pull_quotes": pull_quotes,
    }


def parse_questions(path: Path) -> dict:
    secs = split_h2(read(path))
    return {
        "diagnostic": [plain(b["text"]) for b in bullets(section(secs, "Diagnostic Questions for the Reader"))],
        "inquiry": [plain(b["text"]) for b in bullets(section(secs, "Inquiry Questions for the Drafting Agent"))],
        "workbook": [plain(b["text"]) for b in bullets(section(secs, "Workbook Questions"))],
    }


def parse_research_map(path: Path) -> dict:
    raw = read(path)
    m = re.search(r"\*\*Research (?:pass|pilot) completed (\d{4}-\d{2}-\d{2})", raw)
    pass_date = m.group(1) if m else None
    secs = split_h2(raw)

    # claim table
    claims_text = section(secs, "Empirical Claims", prefix=True)
    header, rows = table_rows(claims_text)
    hl = [h.lower() for h in header]
    claim_col = next((i for i, h in enumerate(hl) if h == "claim"), None)
    sec_col = next((i for i, h in enumerate(hl) if h in ("§", "section")), None)
    thread_col = next((i for i, h in enumerate(hl) if "thread" in h), None)
    bucket_col = len(header) - 1 if header else None
    table_claims = []
    for r in rows:
        if claim_col is None or len(r) <= claim_col:
            continue
        table_claims.append({
            "text": plain(r[claim_col]),
            "section_hint": plain(r[sec_col]) if sec_col is not None and len(r) > sec_col else None,
            "thread": plain(r[thread_col]) if thread_col is not None and len(r) > thread_col else None,
            "bucket_text": plain(r[bucket_col]) if bucket_col is not None and len(r) > bucket_col and bucket_col != claim_col else "",
            "label_col": plain(r[0]) if header and hl[0] not in ("claim", "§", "section") and len(r) > 0 else None,
        })

    # validating source buckets
    buckets = []
    vs = section(secs, "Validating Sources")
    cur = None
    for line in vs.split("\n"):
        h = re.match(r"^###\s*\((\d+)\)\s*(.*)$", line)
        if h:
            cur = {"n": int(h.group(1)), "title": plain(h.group(2)), "entries": [], "use": None, "raw_lines": []}
            buckets.append(cur)
            continue
        if cur is None:
            continue
        cur["raw_lines"].append(line)
    for b in buckets:
        for item in bullets("\n".join(b["raw_lines"])):
            t = item["text"]
            if re.match(r"^\*\*Use:?\*\*", t):
                b["use"] = plain(re.sub(r"^\*\*Use:?\*\*\s*", "", t))
                continue
            b["entries"].append({"markdown": t, "children": item["children"]})

    # counterpoints
    cps = []
    cp_text = section(secs, "Counterpoints", prefix=True)
    cur = None
    for line in cp_text.split("\n"):
        h = re.match(r"^###\s*(COUNTER|EDGE)-(\d+):\s*(.*)$", line)
        if h:
            cur = {"kind": h.group(1).lower(), "n": int(h.group(2)),
                   "label": f"{h.group(1)}-{h.group(2)}", "heading": plain(h.group(3)), "lines": []}
            cps.append(cur)
            continue
        if cur is not None:
            cur["lines"].append(line)
    for c in cps:
        items = bullets("\n".join(c["lines"]))
        c["effect"], c["adjustment"], c["objection"], c["evidence_md"] = None, None, [], []
        for it in items:
            t = it["text"]
            if re.match(r"^\*\*Effect on chapter:?\*\*", t):
                eff = re.sub(r"^\*\*Effect on chapter:?\*\*\s*", "", t)
                adj = re.search(r"\*\*Suggested adjustment:?\*\*\s*(.*)$", eff)
                if adj:
                    c["adjustment"] = plain(adj.group(1))
                    eff = eff[: adj.start()]
                c["effect"] = plain(eff)
                continue
            full = t + (" " + " ".join(it["children"]) if it["children"] else "")
            c["objection"].append(plain(full))
            if re.match(r"^\*\*", t) and (YEAR_RE.search(t) or URL_RE.search(t) or italic_titles(t)):
                c["evidence_md"].append(t)
        c.pop("lines")

    status = plain(section(secs, "Status"))
    return {"pass_date": pass_date, "table_claims": table_claims, "buckets": buckets,
            "counterpoints": cps, "status": status}


def parse_contrarian(path: Path) -> dict:
    raw = read(path)
    m = re.search(r"Applied to \*\*(.+?)\*\*", raw)
    applied_to = plain(m.group(1)) if m else None
    secs = split_h2(raw)
    results = section(secs, "Results")
    items = []
    cur = None
    for line in results.split("\n"):
        h = re.match(r"^\*\*(\d+)\.\s*(.+?)\*\*\s*(.*)$", line)
        if h:
            n = int(h.group(1))
            verdict = first_emoji_verdict(h.group(3)) or first_emoji_verdict(line) or "unparsed"
            cur = {"n": n, "question": plain(h.group(2)), "canonical": CONTRARIAN_QUESTIONS.get(n, plain(h.group(2))),
                   "verdict": verdict, "lines": []}
            rest = re.sub(r"^[\s✅⚠️⚠🚩]+", "", h.group(3)).strip()
            if rest and rest.upper() != "N/A" and rest != "N/A.":
                cur["lines"].append(rest)
            items.append(cur)
        elif cur is not None and line.strip():
            cur["lines"].append(line.strip())
    for it in items:
        it["text"] = plain(" ".join(it.pop("lines")))
    return {"applied_to": applied_to, "items": items,
            "revisions": [plain(x) for x in numbered(section(secs, "Top revisions to consider"))],
            "open_issues": [plain(b["text"]) for b in bullets(section(secs, "Open issues"))]}


def parse_glossary(path: Path) -> list[dict]:
    lines = read(path).split("\n")
    start = next((i for i, l in enumerate(lines) if re.match(r"^3\.\s+Alphabetical Entries", l)), 0)
    entries, i = [], start + 1
    while i < len(lines):
        if i + 1 < len(lines) and lines[i].strip() and lines[i + 1].startswith("Working definition."):
            term = lines[i].strip()
            rec = {"term": term, "working_definition": "", "what_it_is_not": "", "where_it_appears": "", "plain_language": ""}
            i += 1
            while i < len(lines) and not (i + 1 < len(lines) and lines[i].strip() and lines[i + 1].startswith("Working definition.")):
                l = lines[i].strip()
                for label, key in (("Working definition.", "working_definition"), ("What it is not.", "what_it_is_not"),
                                   ("Where it appears in the model.", "where_it_appears"), ("Plain language version.", "plain_language")):
                    if l.startswith(label):
                        rec[key] = l[len(label):].strip()
                        break
                i += 1
            slug = re.sub(r"[^a-z0-9]+", "-", term.lower()).strip("-")
            rec["id"] = f"FP-T-{slug}"
            entries.append(rec)
        else:
            i += 1
    return entries


def parse_canon(path: Path) -> dict:
    raw = read(path)
    def block(name):
        m = re.search(r"^# " + re.escape(name) + r"\s*\n(.*?)(?=\n---|\n# )", raw, re.S | re.M)
        return [l.strip() for l in m.group(1).split("\n") if l.strip()] if m else []
    return {"core_thesis": block("Core Thesis"), "founding_statement": block("Founding Statement"),
            "definition_of_agency": block("Definition of Agency")}


# --------------------------------------------------------------------------- taxonomy

class Taxonomy:
    def __init__(self, path: Path):
        self.data = json.loads(read(path))
        self.compiled = [(m, [re.compile(p, re.I) for p in m["patterns"]]) for m in self.data["mechanisms"]]
        self.by_id = {m["id"]: m for m in self.data["mechanisms"]}

    def tag_text(self, text: str) -> list[str]:
        out = []
        for m, pats in self.compiled:
            if any(p.search(text) for p in pats):
                out.append(m["id"])
        return out

    def tag_chapter(self, strong: str, key_concepts: list[str]) -> list[dict]:
        tags = {}
        for mid in self.tag_text(strong):
            tags[mid] = "title, headings, or core claim"
        kc = "\n".join(key_concepts)
        for m, pats in self.compiled:
            if m["id"] in tags:
                continue
            hits = sum(1 for p in pats for _ in p.finditer(kc))
            if hits >= 2:
                tags[m["id"]] = "two or more key-concept matches"
        return [{"id": k, "basis": v} for k, v in tags.items()]


# --------------------------------------------------------------------------- link checking

def check_url(url: str) -> dict:
    headers = {"User-Agent": "Mozilla/5.0 (FoundedResearchAtlas link check; +https://thefoundedproject.com)"}
    for method in ("HEAD", "GET"):
        try:
            req = urllib.request.Request(url, headers=headers, method=method)
            with urllib.request.urlopen(req, timeout=20) as resp:
                status = resp.status
                final = resp.geturl()
                if method == "GET":
                    resp.read(2048)
                return {"url": url, "status": status, "final_url": final,
                        "result": "reachable" if status < 400 else "error", "checked_at": TODAY}
        except urllib.error.HTTPError as e:
            if method == "HEAD" and e.code in (403, 405, 400, 404, 500, 501, 503):
                continue
            return {"url": url, "status": e.code, "final_url": e.geturl() if hasattr(e, "geturl") else url,
                    "result": "blocked" if e.code in (401, 403, 429) else "error", "checked_at": TODAY}
        except Exception as e:  # noqa: BLE001
            if method == "HEAD":
                continue
            return {"url": url, "status": None, "final_url": url, "result": f"unreachable: {type(e).__name__}", "checked_at": TODAY}
    return {"url": url, "status": None, "final_url": url, "result": "unreachable", "checked_at": TODAY}


def check_links(urls: list[str], cache_path: Path, force: bool) -> dict[str, dict]:
    cache = {}
    if cache_path.exists():
        for rec in json.loads(read(cache_path)):
            cache[rec["url"]] = rec
    todo = [u for u in urls if force or u not in cache]
    if todo:
        print(f"  checking {len(todo)} links ...", file=sys.stderr)
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
            for rec in ex.map(check_url, todo):
                cache[rec["url"]] = rec
    return cache


# --------------------------------------------------------------------------- build

def main():
    ap = argparse.ArgumentParser(description="Build the Founded Research Atlas ledgers from the manuscript.")
    ap.add_argument("--manuscript", default=str(DEFAULT_MANUSCRIPT))
    ap.add_argument("--out", default=str(REPO / "atlas-data"))
    ap.add_argument("--check-links", action="store_true", help="re-check every URL (otherwise reuse the cache)")
    args = ap.parse_args()

    root = Path(args.manuscript).expanduser()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "dossier").mkdir(exist_ok=True)
    if not root.exists():
        sys.exit(f"manuscript root not found: {root}")

    tax = Taxonomy(HERE / "taxonomy.json")
    reg = Registry(out / "id-registry.json")

    chapters, claims, sources, challenges = [], [], [], []
    source_by_key: dict[str, dict] = {}
    source_by_url: dict[str, str] = {}
    exact_lead_index: dict[str, str] = {}

    def source_key(kind, chapter_id, ident):
        return f"{kind}:{chapter_id}:{ident}"

    def add_source(kind: str, chapter_id: str, ident: str, markdown: str, role: str, role_basis: str,
                   extra: dict | None = None) -> str:
        """Create or merge a source record. Exact URL or exact lead text merges across chapters."""
        cite_plain = citation_plain(markdown)
        urls = urls_in(markdown)
        lead = lead_of(markdown)
        lead_key = norm_key(lead, 80)
        merge_id = None
        for u in urls:
            if u in source_by_url:
                merge_id = source_by_url[u]
                break
        if merge_id is None and lead_key and len(lead_key) > 25 and lead_key in exact_lead_index:
            merge_id = exact_lead_index[lead_key]
        key = source_key(kind, chapter_id, ident)
        if merge_id is None:
            sid = reg.assign("sources", key, "sources", lambda n: f"FP-S{n:04d}")
            if sid in source_by_key:  # same registry key seen twice (should not happen)
                merge_id = sid
        if merge_id is not None:
            rec = source_by_key[merge_id]
            rec["appearances"].append({"chapter_id": chapter_id, "origin": kind, "ident": ident, "citation": cite_plain})
            if chapter_id not in rec["chapter_ids"]:
                rec["chapter_ids"].append(chapter_id)
            if role == "direct" and rec["evidentiary_role"] != "direct":
                rec["evidentiary_role"], rec["role_basis"] = role, role_basis
            for u in urls:
                if u not in rec["urls"]:
                    rec["urls"].append(u)
                source_by_url[u] = merge_id
            if extra and extra.get("use") and not rec.get("use"):
                rec["use"] = extra["use"]
            reg.seen["sources"].add(key)
            return merge_id
        stype, stype_basis = classify_source_type(markdown, urls)
        desig, desig_basis = classify_designation(markdown, stype)
        titles = italic_titles(markdown)
        year = YEAR_RE.search(plain(markdown))
        rec = {
            "id": sid, "chapter_ids": [chapter_id],
            "appearances": [{"chapter_id": chapter_id, "origin": kind, "ident": ident, "citation": cite_plain}],
            "citation": cite_plain, "citation_markdown": markdown, "lead": lead,
            "citation_core": first_sentence(markdown),
            "author_or_institution": lead.split(",")[0].split(" (")[0].strip() if lead else None,
            "author_basis": "heuristic: text before the first comma or parenthesis of the lead",
            "title": titles[0] if titles else None, "year": year.group(1) if year else None,
            "urls": urls, "doi": next((u for u in urls if "doi.org" in u), None),
            "source_type": stype, "source_type_basis": stype_basis,
            "designation": desig, "designation_basis": desig_basis,
            "evidentiary_role": role, "role_basis": role_basis,
            "use": (extra or {}).get("use"), "notes": (extra or {}).get("notes"),
            "bucket": (extra or {}).get("bucket"),
            "pages_or_sections": pages_of(first_sentence(markdown)),
            "points_to": None,
            "claims_supported": [], "claims_qualified": [], "challenge_ids": [],
            "link_status": [], "verification_status": "unreviewed", "last_reviewed": None,
            "possible_duplicates": [],
        }
        source_by_key[sid] = rec
        for u in urls:
            source_by_url[u] = sid
        if lead_key and len(lead_key) > 25:
            exact_lead_index[lead_key] = sid
        sources.append(rec)
        return sid

    chapter_dirs = []
    for folder, numeral, label, stage in PART_DIRS:
        pdir = root / folder
        for cdir in sorted(pdir.iterdir()):
            m = re.match(r"^CH(\d\d) - (.+)$", cdir.name)
            if cdir.is_dir() and m:
                chapter_dirs.append((cdir, int(m.group(1)), m.group(2), numeral, label, stage, folder))

    print(f"Reading {len(chapter_dirs)} chapters from {root}", file=sys.stderr)

    for cdir, num, title, numeral, part_label, stage, folder in chapter_dirs:
        cid = f"FP-CH{num:02d}"
        tag = f"CH{num:02d}"
        draft = parse_draft(cdir / f"{tag} - Draft.md")
        ov = parse_overview(cdir / f"{tag} - Overview.md")
        qs = parse_questions(cdir / f"{tag} - Questions.md")
        rm = parse_research_map(cdir / f"{tag} - Research Map.md")
        cr = parse_contrarian(cdir / f"{tag} - Contrarian Review.md")

        ch_claim_ids, ch_source_ids, ch_challenge_ids = [], [], []
        gaps_local = []

        # ---- sources: draft footnotes (direct)
        footnote_sid: dict[str, str] = {}
        for key, text in draft["notes"].items():
            sid = add_source("draft-footnote", cid, key, text, "direct",
                             "cited inline in the chapter draft as a footnote",
                             {"notes": plain(text)})
            footnote_sid[key] = sid
            if sid not in ch_source_ids:
                ch_source_ids.append(sid)

        # ---- sources: research map buckets (corroborating unless matched to a footnote)
        bucket_sids: dict[int, list[str]] = defaultdict(list)
        bucket_use: dict[int, str | None] = {}
        for b in rm["buckets"]:
            bucket_use[b["n"]] = b["use"]
            for i, e in enumerate(b["entries"]):
                md = e["markdown"]
                pointer = bool(re.search(r"already (cited|documented)|cross-reference|covered in CH|see CH\d\d|documented in CH", md, re.I))
                role, basis = ("contextual", "pointer to a source documented in another chapter") if pointer else \
                    ("corroborating", "listed as a validating source in the Research Map; not cited inline")
                # does it match a footnote in this chapter? then it is the direct citation
                matched_fn = None
                lead_names = surnames(md.split(".")[0][:200])
                md_titles = {w for t in italic_titles(md) for w in tokens(t)}
                md_year = YEAR_RE.search(md)
                for key, fn_text in draft["notes"].items():
                    fn_names = surnames(fn_text[:200])
                    if lead_names & fn_names:
                        fn_year = YEAR_RE.search(fn_text)
                        fn_titles = {w for t in italic_titles(fn_text) for w in tokens(t)}
                        if (md_year and fn_year and md_year.group(1) == fn_year.group(1)) or len(md_titles & fn_titles) >= 2 or not md_year:
                            matched_fn = key
                            break
                if matched_fn:
                    sid = footnote_sid[matched_fn]
                    rec = source_by_key[sid]
                    rec["appearances"].append({"chapter_id": cid, "origin": "research-map", "ident": f"({b['n']}).{i+1}", "citation": citation_plain(md)})
                    for u in urls_in(md):
                        if u not in rec["urls"]:
                            rec["urls"].append(u)
                        source_by_url[u] = sid
                    if b["use"] and not rec.get("use"):
                        rec["use"] = b["use"]
                    rec["bucket"] = rec.get("bucket") or {"chapter_id": cid, "n": b["n"], "title": b["title"]}
                    reg.seen["sources"].add(source_key("research-map", cid, f"{b['n']}:{norm_key(md, 60)}"))
                else:
                    sid = add_source("research-map", cid, f"{b['n']}:{norm_key(md, 60)}", md, role, basis,
                                     {"use": b["use"], "bucket": {"chapter_id": cid, "n": b["n"], "title": b["title"]},
                                      "notes": " ".join(plain(c) for c in e["children"]) or None})
                if sid not in bucket_sids[b["n"]]:
                    bucket_sids[b["n"]].append(sid)
                if sid not in ch_source_ids:
                    ch_source_ids.append(sid)

        # ---- challenges: research map counterpoints
        for cp in rm["counterpoints"]:
            xid = reg.assign("challenges", f"{cid}:rm:{cp['label']}", f"challenges:{cid}", lambda n: f"{cid}-X{n:02d}")
            effect = cp["effect"] or ""
            resolution = resolution_from_effect(effect) if effect else "open"
            if cp["adjustment"]:
                resolution = "revision-suggested"
            ev_sids = []
            for j, md in enumerate(cp["evidence_md"]):
                sid = add_source("counterpoint", cid, f"{cp['label']}:{j}:{norm_key(md, 60)}", md, "adversarial",
                                 "cited in the Research Map as evidence for a counterpoint")
                ev_sids.append(sid)
                source_by_key[sid]["challenge_ids"].append(xid)
                if sid not in ch_source_ids:
                    ch_source_ids.append(sid)
            rec = {
                "id": xid, "chapter_id": cid, "origin": "research-map", "label": cp["label"],
                "kind": "counter" if cp["kind"] == "counter" else "edge", "topic": "evidence",
                "proposition": cp["heading"],
                "objection": " ".join(cp["objection"]) or cp["heading"],
                "evidence": [plain(x) for x in cp["evidence_md"]],
                "evidence_source_ids": ev_sids,
                "response": effect or None,
                "revision": cp["adjustment"],
                "resolution": resolution,
                "remaining_uncertainty": None if resolution == "no-change-needed" else
                    ("The Research Map suggests a revision that has not been confirmed in the draft." if resolution == "revision-suggested"
                     else "No response recorded in the Research Map."),
                "verdict": None, "applied_to": None, "claim_ids": [], "mechanisms": tax.tag_text(cp["heading"] + " " + " ".join(cp["objection"])),
                "review_status": "unreviewed",
            }
            challenges.append(rec)
            ch_challenge_ids.append(xid)

        # ---- challenges: contrarian review flags
        checks = []
        topic_of = {1: "evidence", 6: "evidence", 7: "evidence", 8: "evidence", 10: "evidence", 13: "evidence", 14: "evidence", 15: "evidence",
                    2: "model-fidelity", 3: "model-fidelity", 4: "model-fidelity", 5: "model-fidelity", 11: "model-fidelity",
                    9: "craft", 12: "craft"}
        for it in cr["items"]:
            checks.append({"n": it["n"], "question": it["canonical"], "verdict": it["verdict"]})
            if it["verdict"] in ("needs-stephen", "watch"):
                xid = reg.assign("challenges", f"{cid}:cr:Q{it['n']}", f"challenges:{cid}", lambda n: f"{cid}-X{n:02d}")
                rec = {
                    "id": xid, "chapter_id": cid, "origin": "contrarian-review", "label": f"Q{it['n']}",
                    "kind": "review-flag", "topic": topic_of.get(it["n"], "evidence"), "proposition": it["canonical"],
                    "objection": it["text"], "evidence": [], "evidence_source_ids": [],
                    "response": None, "revision": None,
                    "resolution": it["verdict"],
                    "remaining_uncertainty": "Flagged for Stephen's decision." if it["verdict"] == "needs-stephen" else "A risk to watch; no decision required yet.",
                    "verdict": it["verdict"], "applied_to": cr["applied_to"], "claim_ids": [],
                    "mechanisms": tax.tag_text(it["text"]), "review_status": "unreviewed",
                }
                challenges.append(rec)
                ch_challenge_ids.append(xid)

        ch_challenges = [c for c in challenges if c["chapter_id"] == cid]

        # ---- claims: core claim
        def new_claim(origin, text, **fields):
            key = f"{cid}:{origin}:{norm_key(text)}"
            clid = reg.assign("claims", key, f"claims:{cid}", lambda n: f"{cid}-C{n:03d}")
            rec = {
                "id": clid, "chapter_id": cid, "chapter_number": num, "text": text, "text_origin": origin,
                "type": "unverified", "type_basis": "", "importance": "unverified", "importance_basis": "",
                "confidence": "unreviewed", "supporting_source_ids": [], "qualifying_source_ids": [],
                "challenge_ids": [], "competing_explanation": None, "competing_explanation_basis": None,
                "establishes": None, "does_not_establish": None,
                "verification_status": "unsupported", "verification_detail": "",
                "review_status": "unreviewed", "location": None, "location_basis": None,
                "section_hint": None, "related_claim_ids": [], "mechanisms": tax.tag_text(text),
                "last_reviewed": None, "stage": stage, "part": numeral,
            }
            rec.update(fields)
            claims.append(rec)
            ch_claim_ids.append(clid)
            return rec

        core = None
        if ov["core_claim"]:
            core = new_claim("overview-core-claim", ov["core_claim"],
                             type="synthesis", type_basis="Overview › Core Claim: the chapter's own statement of its argument",
                             importance="load-bearing", importance_basis="the chapter's core claim by definition",
                             verification_status="argued",
                             verification_detail="Supported by the chapter's reasoning and the sourced claims listed beneath it; not separately cited.",
                             location={"section": None, "paragraph": None, "note": "Chapter-level claim from the Overview"},
                             location_basis="Overview file")
        else:
            gaps_local.append(("P1", "missing-thesis", f"{tag} Overview has no Core Claim section"))

        # ---- claims: footnoted sentences in the draft
        sentence_claims = []
        for si, s in enumerate(draft["sections"]):
            for pi, p in enumerate(s["paragraphs"]):
                if not p["notes"]:
                    continue
                sents = sentences_with_notes(p["text"])
                for idx, (sent, keys) in enumerate(sents):
                    if not keys:
                        continue
                    # a short footnoted sentence usually closes a thought; carry the sentence before it
                    if len(sent.split()) < 8 and idx > 0:
                        sent = sents[idx - 1][0] + " " + sent
                    sids = [footnote_sid[k] for k in keys if k in footnote_sid]
                    missing = [k for k in keys if k not in footnote_sid]
                    for k in missing:
                        gaps_local.append(("P2", "dangling-footnote", f"{tag}: footnote [^{k}] referenced but not defined"))
                    rec = new_claim("draft-sentence", plain(sent),
                                    supporting_source_ids=sids,
                                    verification_status="cited" if sids else "unsupported",
                                    verification_detail="A footnote sits on this sentence in the current draft." if sids else "Footnote key has no definition.",
                                    location={"section": s["heading"], "paragraph": pi + 1, "section_index": si + 1,
                                              "draft_version": draft["meta"].get("draft_status"), "draft_date": draft["meta"].get("draft_date")},
                                    location_basis="footnote position in the draft",
                                    importance="supporting", importance_basis="a sourced sentence inside the chapter's argument; importance not yet reviewed",
                                    context=plain(p["text"]))
                    rec["footnote_keys"] = keys
                    sentence_claims.append(rec)
                    for sid in sids:
                        source_by_key[sid]["claims_supported"].append(rec["id"])

        # ---- claims: research map table
        all_paras = [(si, pi, s["heading"], tokens(p["text"])) for si, s in enumerate(draft["sections"]) for pi, p in enumerate(s["paragraphs"])]
        rm_claims = []
        for row in rm["table_claims"]:
            refs = [int(x) for x in re.findall(r"\((\d+)\)", row["bucket_text"])]
            cross = re.findall(r"CH(\d\d)", row["bucket_text"])
            detail = ""
            if not refs and row["bucket_text"]:
                # try to resolve a named bucket, e.g. "Popper's paradox of tolerance"
                names = surnames(row["bucket_text"]) | {w.capitalize() for w in tokens(row["bucket_text"])}
                for b in rm["buckets"]:
                    hay = b["title"] + " " + " ".join(e["markdown"] for e in b["entries"])
                    if any(n.lower() in hay.lower() for n in names if len(n) > 4):
                        refs.append(b["n"])
                        detail = f"bucket resolved by name from '{row['bucket_text']}'"
                        break
            sids = []
            for n in refs:
                sids.extend(bucket_sids.get(n, []))
            sids = list(dict.fromkeys(sids))
            in_draft = any(source_by_key[s]["evidentiary_role"] == "direct" for s in sids)
            if sids:
                status = "mapped"
                detail = detail or ("The Research Map links this claim to a source bucket" + (", and that source is cited inline in the draft." if in_draft else "; the source is not cited inline in the current draft."))
            elif cross:
                status = "mapped-cross-chapter"
                detail = f"The Research Map points to sources documented in CH{', CH'.join(cross)}: {row['bucket_text']}"
            else:
                status = "unsupported"
                detail = f"No source bucket could be resolved from: '{row['bucket_text']}'" if row["bucket_text"] else "The Research Map lists no source for this claim."
            # locate in draft
            ct = tokens(row["text"])
            best, best_score = None, 0
            for si, pi, heading, pt in all_paras:
                score = len(ct & pt)
                if row["section_hint"] and norm_key(row["section_hint"], 40) in norm_key(heading, 40):
                    score += 2
                if score > best_score:
                    best, best_score = (si, pi, heading), score
            threshold = max(3, math.ceil(0.3 * max(len(ct), 1)))
            loc, loc_basis = None, None
            if best and best_score >= threshold:
                loc = {"section": best[2], "paragraph": best[1] + 1, "section_index": best[0] + 1,
                       "draft_version": draft["meta"].get("draft_status"), "draft_date": draft["meta"].get("draft_date")}
                loc_basis = f"keyword match to a draft paragraph ({best_score} shared terms); unreviewed"
            imp, imp_basis = "supporting", "listed under Empirical Claims in the Research Map; importance not yet reviewed"
            use_text = " ".join(filter(None, (bucket_use.get(n) for n in refs)))
            if re.search(r"central claim|chapter's central|load-bearing|spine|grounding the chapter|the chapter's (core|main) ", use_text + " " + rm["status"], re.I) and len(rm["table_claims"]) <= 2:
                imp, imp_basis = "load-bearing", "the Research Map's Use or Status text calls this the chapter's central or grounding claim"
            rec = new_claim("research-map", row["text"],
                            type="fact", type_basis="listed under 'Empirical Claims → Sources' in the Research Map",
                            importance=imp, importance_basis=imp_basis,
                            supporting_source_ids=sids, verification_status=status, verification_detail=detail,
                            location=loc, location_basis=loc_basis, section_hint=row["section_hint"],
                            establishes=use_text or None,
                            research_thread=row["thread"], bucket_refs=refs, bucket_text=row["bucket_text"],
                            cross_reference_chapters=[f"FP-CH{c}" for c in cross])
            rm_claims.append(rec)
            for sid in sids:
                source_by_key[sid]["claims_supported"].append(rec["id"])
            if status == "unsupported":
                gaps_local.append(("P1", "unsupported-claim", f"{rec['id']}: {row['text'][:120]}"))


        # ---- link sentence claims and research-map claims through shared sources; inherit type
        for sc in sentence_claims:
            for rc in rm_claims:
                if set(sc["supporting_source_ids"]) & set(rc["supporting_source_ids"]):
                    sc["related_claim_ids"].append(rc["id"])
                    rc["related_claim_ids"].append(sc["id"])
                    if sc["type"] == "unverified":
                        sc["type"], sc["type_basis"] = "fact", "cites a source the Research Map lists under Empirical Claims"
                    if not sc["establishes"] and rc["establishes"]:
                        sc["establishes"] = rc["establishes"]
                    if rc["verification_status"] == "mapped":
                        rc["verification_detail"] = "The Research Map links this claim to a source bucket, and that source is cited inline in the draft (see related claim)."
                    if rc["location"] is None and sc["location"]:
                        rc["location"] = dict(sc["location"])
                        rc["location_basis"] = f"the footnoted sentence {sc['id']} cites the same source; unreviewed"
            if sc["type"] == "unverified":
                sc["type_basis"] = "footnoted sentence; type not yet assigned (the Research Map does not list it as an empirical claim)"
            if not sc["establishes"]:
                notes = [source_by_key[s].get("notes") for s in sc["supporting_source_ids"] if source_by_key[s].get("notes")]
                sc["establishes"] = notes[0] if notes else None

        for rc in rm_claims:
            if rc["location"] is None:
                gaps_local.append(("P2", "claim-not-pinned-to-draft", f"{rc['id']}: no draft paragraph matched the Research Map wording ({rc['text'][:80]})"))

        # ---- map challenges to claims (keyword overlap) and to sources (surname)
        for x in ch_challenges:
            xt = tokens(x["proposition"] + " " + x["objection"])
            xnames = surnames(x["proposition"] + " " + x["objection"])
            for c in [c for c in claims if c["chapter_id"] == cid]:
                if c["text_origin"] == "overview-core-claim":
                    c["challenge_ids"].append(x["id"])
                    x["claim_ids"].append(c["id"])
                    continue
                overlap = len(tokens(c["text"]) & xt)
                src_hit = any(surnames(source_by_key[s]["lead"]) & xnames for s in c["supporting_source_ids"])
                if overlap >= 3 or src_hit:
                    c["challenge_ids"].append(x["id"])
                    x["claim_ids"].append(c["id"])
                    if x["origin"] == "research-map" and not c["competing_explanation"]:
                        c["competing_explanation"] = x["proposition"]
                        c["competing_explanation_basis"] = f"{x['label']} in the Research Map, matched by {'source name' if src_hit else 'keyword overlap'}; unreviewed"
                    if x["response"] and not c["does_not_establish"]:
                        c["does_not_establish"] = x["response"]
                    for sid in x["evidence_source_ids"]:
                        if sid not in c["qualifying_source_ids"]:
                            c["qualifying_source_ids"].append(sid)
                            source_by_key[sid]["claims_qualified"].append(c["id"])
            for sid in ch_source_ids:
                if surnames(source_by_key[sid]["lead"]) & xnames and x["id"] not in source_by_key[sid]["challenge_ids"]:
                    source_by_key[sid]["challenge_ids"].append(x["id"])

        if core:
            rm_counters = [x for x in ch_challenges if x["origin"] == "research-map" and x["kind"] == "counter"]
            if rm_counters:
                core["competing_explanation"] = rm_counters[0]["proposition"]
                core["competing_explanation_basis"] = f"{rm_counters[0]['label']}, the chapter's first steelmanned counterpoint; chapter-level, unreviewed"
            core["supporting_source_ids"] = list(dict.fromkeys(s for c in claims if c["chapter_id"] == cid for s in c["supporting_source_ids"]))
            core["verification_detail"] += f" {len(core['supporting_source_ids'])} source(s) sit beneath it in this chapter."

        # ---- pull quotes present in the draft?
        draft_norm = norm_key(" ".join(p["text"] for s in draft["sections"] for p in s["paragraphs"]), 10**7)
        pull_quotes = []
        for q in ov["pull_quotes"]:
            qn = norm_key(q, 10**6)
            words = qn.split()
            if qn and qn in draft_norm:
                state = "yes"
            elif any(" ".join(words[i:i + 7]) in draft_norm for i in range(max(0, len(words) - 6))):
                state = "partial"
            else:
                state = "no"
            pull_quotes.append({"text": q, "in_draft": state})

        # ---- chapter record
        headings = [s["heading"] for s in draft["sections"]]
        strong = " ".join([title] + headings)
        mechanisms = tax.tag_chapter(strong, ov["key_concepts"] + [ov["core_claim"]])
        related = set()
        for txt in (ov["required_research"], ov["contrarian_pressure"], ov["movement"], rm["status"],
                    " ".join(r["bucket_text"] for r in rm["table_claims"]),
                    " ".join(b["title"] for b in rm["buckets"]),
                    " ".join(e["markdown"] for b in rm["buckets"] for e in b["entries"])):
            for c in re.findall(r"CH(\d\d)", txt):
                if int(c) != num:
                    related.add(f"FP-CH{c}")
        chapter = {
            "id": cid, "number": num, "tag": tag, "title": title,
            "part": {"numeral": numeral, "label": part_label, "folder": folder},
            "stage": stage,
            "files": {k: str((cdir / f"{tag} - {v}.md").relative_to(root)) for k, v in
                      (("draft", "Draft"), ("research_map", "Research Map"), ("contrarian_review", "Contrarian Review"),
                       ("overview", "Overview"), ("questions", "Questions"))},
            "draft": {"status": draft["meta"].get("draft_status"), "date": draft["meta"].get("draft_date"),
                      "revised_date": draft["meta"].get("revised_date"), "word_count": draft["word_count"],
                      "editor_flags_stripped": draft["flag_count"],
                      "sections": [{"heading": s["heading"], "paragraphs": len(s["paragraphs"]),
                                    "words": sum(len(plain(p["text"]).split()) for p in s["paragraphs"]),
                                    "footnotes": sorted({k for p in s["paragraphs"] for k in p["notes"]})} for s in draft["sections"]]},
            "thesis": ov["core_claim"], "thesis_source": "Overview › Core Claim (Stephen's text)",
            "summary": {"purpose": ov["purpose"], "reader_problem": ov["reader_problem"],
                        "movement": ov["movement"], "takeaway": ov["takeaway"],
                        "source": "Overview › Chapter Purpose, Reader Problem, Chapter Movement, Desired Reader Takeaway"},
            "key_concepts": ov["key_concepts"],
            "mechanisms": mechanisms,
            "related_core_theory": ov["related_core_theory"],
            "ecosystem_connections": ov["ecosystem_connections"],
            "opening_story": {"items": ov["opening_story"], "audience": "author"},
            "pull_quotes": pull_quotes,
            "contrarian_pressure": ov["contrarian_pressure"],
            "required_research": ov["required_research"],
            "research": {"pass_date": rm["pass_date"], "status": rm["status"], "bucket_count": len(rm["buckets"]),
                         "buckets": [{"n": b["n"], "title": b["title"], "use": b["use"], "source_ids": bucket_sids.get(b["n"], [])} for b in rm["buckets"]]},
            "review": {"applied_to": cr["applied_to"], "checks": checks, "revisions": cr["revisions"],
                       "open_issues": cr["open_issues"], "audience": "author"},
            "study": {"diagnostic_questions": qs["diagnostic"], "workbook_questions": qs["workbook"],
                      "inquiry_questions": {"items": qs["inquiry"], "audience": "author"}},
            "claim_ids": ch_claim_ids, "source_ids": ch_source_ids, "challenge_ids": ch_challenge_ids,
            "related_chapter_ids": sorted(related),
            "prev_id": f"FP-CH{num-1:02d}" if num > 1 else None,
            "next_id": f"FP-CH{num+1:02d}" if num < len(chapter_dirs) else None,
            "counts": {"claims": len(ch_claim_ids), "sources": len(ch_source_ids), "challenges": len(ch_challenge_ids),
                       "cited_claims": sum(1 for c in claims if c["chapter_id"] == cid and c["verification_status"] == "cited"),
                       "unsupported_claims": sum(1 for c in claims if c["chapter_id"] == cid and c["verification_status"] == "unsupported"),
                       "open_challenges": sum(1 for x in ch_challenges if x["resolution"] in ("open", "needs-stephen", "revision-suggested"))},
            "_gaps": gaps_local,
        }
        if not qs["diagnostic"]:
            gaps_local.append(("P4", "missing-study-prompts", f"{tag} has no diagnostic questions"))
        if not ch_challenge_ids:
            gaps_local.append(("P4", "missing-challenge", f"{tag} has no challenge record"))
        chapters.append(chapter)
        print(f"  {tag}: {len(ch_claim_ids)} claims, {len(ch_source_ids)} sources, {len(ch_challenge_ids)} challenges", file=sys.stderr)

    # ---- possible duplicate sources across chapters (surname + year, not merged)
    by_sig: dict[tuple, list[str]] = defaultdict(list)
    for s in sources:
        names = sorted(surnames(s["lead"]))[:2]
        if names and s["year"]:
            by_sig[(tuple(names), s["year"])].append(s["id"])
    for ids in by_sig.values():
        if len(ids) > 1:
            for sid in ids:
                source_by_key[sid]["possible_duplicates"] = [x for x in ids if x != sid]

    # ---- resolve pointer sources ("covered in CH01") to the record they point at
    claim_by_id = {c["id"]: c for c in claims}
    for s in sources:
        if s["evidentiary_role"] != "contextual":
            continue
        refs = re.findall(r"CH(\d\d)", s["citation_markdown"])
        names = surnames(s["lead"])
        for r in refs:
            target_ch = f"FP-CH{r}"
            for t in sources:
                if t["id"] != s["id"] and target_ch in t["chapter_ids"] and t["evidentiary_role"] != "contextual" and surnames(t["lead"]) & names:
                    s["points_to"] = t["id"]
                    for clid in s["claims_supported"]:
                        c = claim_by_id[clid]
                        if t["id"] not in c["supporting_source_ids"]:
                            c["supporting_source_ids"].append(t["id"])
                            t["claims_supported"].append(clid)
                            c["verification_detail"] += f" Pointer resolved to {t['id']} in {target_ch}."
                    break
            if s["points_to"]:
                break
    # cross-chapter claims: find the named source in the referenced chapter
    for c in claims:
        if c["verification_status"] != "mapped-cross-chapter":
            continue
        names = surnames(c.get("bucket_text", ""))
        for target_ch in c.get("cross_reference_chapters", []):
            hit = next((t for t in sources if target_ch in t["chapter_ids"] and surnames(t["lead"]) & names), None)
            if hit:
                c["supporting_source_ids"].append(hit["id"])
                hit["claims_supported"].append(c["id"])
                c["verification_detail"] += f" Resolved to {hit['id']}."
                break

    # ---- link validation
    all_urls = sorted({u for s in sources for u in s["urls"]})
    link_cache = check_links(all_urls, out / "link-validation.json", args.check_links)
    for s in sources:
        s["link_status"] = [link_cache[u] for u in s["urls"] if u in link_cache]
    link_cache = {u: r for u, r in link_cache.items() if u in set(all_urls)}  # drop rows no source references any more
    (out / "link-validation.json").write_text(json.dumps(sorted(link_cache.values(), key=lambda r: r["url"]), indent=1) + "\n", encoding="utf-8")

    # ---- glossary and canon
    terms = parse_glossary(root / "00 - Governance/Founded Glossary v1.0.md")
    canon = parse_canon(root / "00 - Governance/Founded Canon v1.0.md")
    mech_terms = {m["glossary_term"] for m in tax.data["mechanisms"] if m.get("glossary_term")}
    for t in terms:
        t["mechanism_ids"] = [m["id"] for m in tax.data["mechanisms"] if m.get("glossary_term") == t["term"]]
        t["chapter_ids"] = [c["id"] for c in chapters if re.search(r"\b" + re.escape(t["term"].split(",")[0]) + r"\b", c["title"] + " " + " ".join(c["key_concepts"]), re.I)]
        t["source"] = "Founded Glossary v1.0"
    missing_terms = mech_terms - {t["term"] for t in terms}
    if missing_terms:
        print(f"  warning: taxonomy names glossary terms not found: {missing_terms}", file=sys.stderr)

    project = {
        "title": "The Founded Project",
        "subtitle": "A Theory of Human Flourishing",
        "author": "Stephen Thompson",
        "edition": EDITION,
        "updated": TODAY,
        "manuscript_root": str(root),
        "thesis": "Human flourishing emerges through the governance of competing forces within moral boundaries.",
        "thesis_source": "Founded Glossary v1.0, restating Founded Canon v1.0 Core Thesis with the Canon Addendum v1.1 moral boundary",
        "canon_core_thesis": canon["core_thesis"],
        "canon_definition_of_agency": canon["definition_of_agency"],
        "founding_statement": canon["founding_statement"],
        "sequence": ["Reclamation", "Agency", "Governance", "Discernment", "Contribution"],
        "parts": [{"numeral": n, "label": l, "stage": s, "chapter_ids": [c["id"] for c in chapters if c["part"]["numeral"] == n]} for _, n, l, s in PART_DIRS],
        "stages": tax.data["stages"], "mechanism_groups": tax.data["groups"], "mechanisms": tax.data["mechanisms"],
        "search_synonyms": tax.data["search_synonyms"],
        "scope": "Phases 1 and 2 of the Research Atlas Framework: a private author atlas and the evidentiary system. No public edition, DOI, or teaching exports yet.",
        "suggested_citation": f"Thompson, Stephen. The Founded Project: A Theory of Human Flourishing. Research Atlas, {EDITION.lower()}, {TODAY}. thefoundedproject.com/atlas (private).",
        "counts": {"chapters": len(chapters), "claims": len(claims), "sources": len(sources), "challenges": len(challenges), "terms": len(terms),
                   "links_checked": len(link_cache)},
        "id_scheme": {"chapter": "FP-CH02", "claim": "FP-CH02-C014", "source": "FP-S0123", "challenge": "FP-CH02-X03", "term": "FP-T-agency"},
    }

    retired = reg.retire_unseen()

    # ---- gaps
    gaps = build_gaps(chapters, claims, sources, challenges, link_cache)
    for c in chapters:
        c.pop("_gaps", None)

    # ---- write JSON
    def dump(name, obj):
        (out / name).write_text(json.dumps(obj, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    dump("project.json", project)
    dump("chapters.json", chapters)
    dump("claims.json", claims)
    dump("sources.json", sources)
    dump("challenges.json", challenges)
    dump("terms.json", terms)
    dump("gaps.json", gaps)
    reg.save()

    # ---- CSV
    def csv_out(name, rows, cols):
        with (out / name).open("w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(cols)
            for r in rows:
                w.writerow([flat(r.get(c)) for c in cols])

    def flat(v):
        if v is None:
            return ""
        if isinstance(v, list):
            return " | ".join(flat(x) for x in v)
        if isinstance(v, dict):
            return "; ".join(f"{k}={flat(x)}" for k, x in v.items() if x not in (None, "", []))
        return str(v)

    csv_out("claims.csv", claims, ["id", "chapter_id", "text_origin", "text", "type", "type_basis", "importance", "importance_basis",
                                   "verification_status", "verification_detail", "review_status", "supporting_source_ids",
                                   "qualifying_source_ids", "challenge_ids", "competing_explanation", "establishes",
                                   "does_not_establish", "location", "location_basis", "mechanisms", "related_claim_ids"])
    csv_out("sources.csv", sources, ["id", "chapter_ids", "citation", "author_or_institution", "title", "year", "urls", "doi",
                                     "source_type", "source_type_basis", "designation", "evidentiary_role", "role_basis", "use",
                                     "notes", "claims_supported", "claims_qualified", "challenge_ids", "link_status",
                                     "possible_duplicates", "verification_status"])
    csv_out("chapters.csv", [{**c, "part": c["part"]["label"], "mechanisms": [m["id"] for m in c["mechanisms"]],
                              "draft_status": c["draft"]["status"], "draft_date": c["draft"]["date"],
                              "claims": c["counts"]["claims"], "sources": c["counts"]["sources"], "challenges": c["counts"]["challenges"]} for c in chapters],
            ["id", "number", "title", "part", "stage", "draft_status", "draft_date", "thesis", "key_concepts", "mechanisms",
             "claims", "sources", "challenges", "related_chapter_ids"])
    csv_out("challenges.csv", challenges, ["id", "chapter_id", "origin", "label", "kind", "proposition", "objection", "evidence",
                                           "response", "revision", "resolution", "remaining_uncertainty", "claim_ids",
                                           "evidence_source_ids", "applied_to"])
    csv_out("terms.csv", terms, ["id", "term", "working_definition", "what_it_is_not", "where_it_appears", "plain_language", "mechanism_ids", "chapter_ids"])

    # ---- dossier and gap report
    write_dossier(out, project, chapters, claims, sources, challenges)
    write_gap_report(out, gaps, project)

    print(f"\nWrote {len(chapters)} chapters, {len(claims)} claims, {len(sources)} sources, {len(challenges)} challenges, {len(terms)} terms to {out}", file=sys.stderr)
    if retired:
        print(f"  retired {len(retired)} IDs no longer present: {', '.join(retired[:10])}{' ...' if len(retired) > 10 else ''}", file=sys.stderr)
    print(f"  gaps: " + ", ".join(f"{k}={len(v)}" for k, v in gaps["by_priority"].items()), file=sys.stderr)


# --------------------------------------------------------------------------- gaps

def build_gaps(chapters, claims, sources, challenges, link_cache) -> dict:
    items = []
    def add(priority, kind, chapter_id, ref, text):
        items.append({"priority": priority, "kind": kind, "chapter_id": chapter_id, "ref": ref, "text": text})

    for c in chapters:
        for p, k, t in c.get("_gaps", []):
            add(p, k, c["id"], None, t)
        if not c["thesis"]:
            add("P1", "missing-thesis", c["id"], None, f"{c['tag']} has no Core Claim in its Overview")
        if not c["summary"]["purpose"]:
            add("P1", "missing-summary", c["id"], None, f"{c['tag']} has no Chapter Purpose in its Overview")
        if c["counts"]["sources"] == 0:
            add("P1", "no-sources", c["id"], None, f"{c['tag']} has no source records at all")
        if c["counts"]["challenges"] == 0:
            add("P4", "missing-challenge", c["id"], None, f"{c['tag']} has no challenge record")
        for q in c["pull_quotes"]:
            if q["in_draft"] == "no":
                add("P5", "stale-pull-quote", c["id"], None, f"{c['tag']} Overview pull quote not found in the current draft: “{q['text'][:90]}…”")
        if c["draft"]["editor_flags_stripped"]:
            add("P5", "editor-flags-pending", c["id"], None, f"{c['tag']} draft carries {c['draft']['editor_flags_stripped']} [[FLAG]] editor markers (stripped from the atlas; resolve in the manuscript)")
        rm_only = [s for s in c["source_ids"]]
    src = {s["id"]: s for s in sources}
    for cl in claims:
        if cl["importance"] == "load-bearing" and cl["text_origin"] != "overview-core-claim" and not cl["supporting_source_ids"]:
            add("P1", "unsupported-load-bearing", cl["chapter_id"], cl["id"], f"{cl['id']} is load-bearing with no source: {cl['text'][:120]}")
        if cl["text_origin"] == "overview-core-claim" and not cl["supporting_source_ids"]:
            add("P1", "core-claim-without-sources", cl["chapter_id"], cl["id"], f"{cl['id']}: the chapter's core claim has no sourced claims beneath it")
        if cl["verification_status"] == "mapped" and "not cited inline" in cl["verification_detail"]:
            add("P3", "mapped-not-cited", cl["chapter_id"], cl["id"], f"{cl['id']}: Research Map source exists but the draft does not cite it: {cl['text'][:100]}")
        if cl["text_origin"] != "overview-core-claim" and not cl["competing_explanation"]:
            add("P5", "no-competing-explanation", cl["chapter_id"], cl["id"], f"{cl['id']}: no competing explanation mapped to this specific claim")
    for s in sources:
        if s["evidentiary_role"] == "contextual" and not s["points_to"]:
            add("P2", "unresolved-pointer", s["chapter_ids"][0] if s["chapter_ids"] else None, s["id"], f"{s['id']}: points to another chapter's source that could not be matched: {s['lead'][:80]}")
        if not s["urls"] and not s["pages_or_sections"] and s["source_type"] not in ("book",) and s["evidentiary_role"] != "contextual":
            add("P2", "missing-locator", s["chapter_ids"][0] if s["chapter_ids"] else None, s["id"], f"{s['id']}: no URL, DOI, or page locator: {s['citation'][:100]}")
        if s["source_type"] == "book" and not s["pages_or_sections"] and s["evidentiary_role"] == "direct":
            add("P5", "book-without-page-locator", s["chapter_ids"][0] if s["chapter_ids"] else None, s["id"], f"{s['id']}: book cited without a page or chapter locator: {s['lead'][:80]}")
        for ls in s["link_status"]:
            if ls["result"] != "reachable":
                add("P3", "broken-or-blocked-link", s["chapter_ids"][0] if s["chapter_ids"] else None, s["id"], f"{s['id']}: {ls['result']} ({ls['status']}) {ls['url']}")
        if s["source_type"] == "unclassified":
            add("P5", "unclassified-source", s["chapter_ids"][0] if s["chapter_ids"] else None, s["id"], f"{s['id']}: source type unclassified: {s['citation'][:100]}")
        if s["possible_duplicates"]:
            add("P5", "possible-duplicate-source", s["chapter_ids"][0] if s["chapter_ids"] else None, s["id"], f"{s['id']} may duplicate {', '.join(s['possible_duplicates'])}: {s['lead'][:80]}")
    for x in challenges:
        if x["resolution"] in ("open", "revision-suggested", "needs-stephen"):
            add("P4", f"unresolved-{x['resolution']}", x["chapter_id"], x["id"], f"{x['id']} [{x['label']}] {x['resolution']}: {x['proposition'][:120]}")
    order = {"P1": 0, "P2": 1, "P3": 2, "P4": 3, "P5": 4}
    items.sort(key=lambda g: (order[g["priority"]], g["chapter_id"] or "", g["kind"]))
    by_p = defaultdict(list)
    for g in items:
        by_p[g["priority"]].append(g)
    return {"generated": TODAY,
            "priorities": {"P1": "Unsupported or missing load-bearing material", "P2": "Missing locators",
                           "P3": "Broken links and sources mapped but not cited", "P4": "Unresolved counterpoints and review flags",
                           "P5": "Housekeeping: classification, duplicates, stale text, editor flags"},
            "by_priority": {p: by_p.get(p, []) for p in ("P1", "P2", "P3", "P4", "P5")},
            "counts_by_kind": dict(Counter(g["kind"] for g in items)), "items": items}


# --------------------------------------------------------------------------- dossier

def write_dossier(out: Path, project, chapters, claims, sources, challenges):
    cl_by = defaultdict(list)
    for c in claims:
        cl_by[c["chapter_id"]].append(c)
    x_by = defaultdict(list)
    for x in challenges:
        x_by[x["chapter_id"]].append(x)
    src = {s["id"]: s for s in sources}

    def chapter_md(c) -> str:
        L = [f"# {c['tag']} — {c['title']}", "",
             f"*Part {c['part']['numeral']}: {c['part']['label']} · Stage: {c['stage']} · Draft: {c['draft']['status'] or 'unknown'} ({c['draft']['date'] or 'n.d.'}) · {c['draft']['word_count']} words*", "",
             "## Thesis (Overview › Core Claim)", "", c["thesis"] or "_No core claim recorded._", "",
             "## Five-minute summary (Overview text)", "",
             f"**Purpose.** {c['summary']['purpose']}", "", f"**Reader problem.** {c['summary']['reader_problem']}", "",
             f"**Movement.** {c['summary']['movement']}", "", f"**Takeaway.** {c['summary']['takeaway']}", "",
             "## Key concepts", ""] + [f"- {k}" for k in c["key_concepts"]] + ["",
             "## Mechanisms", "", ", ".join(m["id"] for m in c["mechanisms"]) or "_none tagged_", "",
             "## Draft architecture", ""] + [f"- {s['heading']} ({s['paragraphs']} ¶, {s['words']} words{', notes: ' + ', '.join(s['footnotes']) if s['footnotes'] else ''})" for s in c["draft"]["sections"]] + ["",
             "## Claims", "", "| ID | Origin | Type | Importance | Status | Sources | Claim |", "|---|---|---|---|---|---|---|"]
        for cl in cl_by[c["id"]]:
            L.append(f"| {cl['id']} | {cl['text_origin']} | {cl['type']} | {cl['importance']} | {cl['verification_status']} | {', '.join(cl['supporting_source_ids'])} | {cl['text'].replace('|', '/')[:220]} |")
        L += ["", "## Sources", ""]
        for sid in c["source_ids"]:
            s = src[sid]
            links = ("; ".join(f"{l['result']} {l['status'] or ''}".strip() for l in s["link_status"])) if s["link_status"] else "no link"
            L.append(f"- **{s['id']}** [{s['evidentiary_role']} · {s['source_type']}] {s['citation']}  \n  _Link: {links}._" + (f" _Use: {s['use']}_" if s.get("use") else ""))
        L += ["", "## Challenge records", ""]
        for x in x_by[c["id"]]:
            L += [f"### {x['id']} · {x['label']} · {x['resolution']}", "", f"**Proposition.** {x['proposition']}", "",
                  f"**Objection.** {x['objection']}", ""]
            if x["response"]:
                L += [f"**Response.** {x['response']}", ""]
            if x["revision"]:
                L += [f"**Revision.** {x['revision']}", ""]
            if x["remaining_uncertainty"]:
                L += [f"**Remaining uncertainty.** {x['remaining_uncertainty']}", ""]
        L += ["## Study prompts (Questions › Diagnostic)", ""] + [f"- {q}" for q in c["study"]["diagnostic_questions"]] + ["",
              "## Review checklist (Contrarian Review)", "", f"Applied to: {c['review']['applied_to']}", ""] + \
             [f"- {k['n']}. {k['question']} — {k['verdict']}" for k in c["review"]["checks"]] + ["",
              "### Top revisions to consider", ""] + [f"{i+1}. {r}" for i, r in enumerate(c["review"]["revisions"])] + ["",
              "### Open issues", ""] + [f"- {o}" for o in c["review"]["open_issues"]] + [""]
        return "\n".join(L)

    head = [f"# {project['title']}: {project['subtitle']} — Research Atlas Master Dossier", "",
            f"*{project['edition']} · generated {project['updated']} · {project['counts']['chapters']} chapters, {project['counts']['claims']} claims, {project['counts']['sources']} sources, {project['counts']['challenges']} challenge records*", "",
            "## Central thesis", "", project["thesis"], "", "> " + "  \n> ".join(project["canon_core_thesis"]), "",
            "## How to read this dossier", "",
            "Every record is extracted by rule from the manuscript's own files: the Draft (text of record), Research Map, Contrarian Review, Overview, and Questions. "
            "Claim types and importance are rule-assigned and marked unreviewed until a person checks them. Editor markers were stripped and counted. "
            "Nothing here was written to fill a gap; gaps are listed in gap-report.md.", "",
            "**Verification states.** `cited`: a footnote sits on the sentence in the current draft. `mapped`: the Research Map ties the claim to a source. "
            "`mapped-cross-chapter`: the source lives in another chapter's map. `argued`: the chapter's core claim, supported by the sourced claims beneath it. `unsupported`: no source found.", "",
            "**Evidentiary roles.** direct (cited inline), corroborating (in the Research Map, not cited inline), adversarial (evidence for a counterpoint), contextual (pointer to another chapter).", "",
            "## Chapters", ""]
    for c in chapters:
        head.append(f"- [{c['tag']} — {c['title']}](dossier/{c['tag']}.md) · {c['counts']['claims']} claims · {c['counts']['sources']} sources · {c['counts']['challenges']} challenges")
    head.append("")
    body = []
    for c in chapters:
        md = chapter_md(c)
        (out / "dossier" / f"{c['tag']}.md").write_text(md + "\n", encoding="utf-8")
        body.append(md)
    (out / "master-dossier.md").write_text("\n".join(head) + "\n\n---\n\n" + "\n\n---\n\n".join(body) + "\n", encoding="utf-8")


def write_gap_report(out: Path, gaps, project):
    L = [f"# Evidentiary gap report — {project['title']}", "", f"*Generated {gaps['generated']} from {project['counts']['claims']} claims, {project['counts']['sources']} sources, {project['counts']['challenges']} challenge records.*", "",
         "Priorities run from P1 (fix before anything else) to P5 (housekeeping). Every line names the record ID so it can be found in the atlas.", ""]
    for p, label in gaps["priorities"].items():
        rows = gaps["by_priority"].get(p, [])
        L += [f"## {p}. {label} ({len(rows)})", ""]
        by_kind = defaultdict(list)
        for g in rows:
            by_kind[g["kind"]].append(g)
        for kind, items in by_kind.items():
            L += [f"### {kind} ({len(items)})", ""]
            for g in items:
                L.append(f"- {g['text']}")
            L.append("")
    (out / "gap-report.md").write_text("\n".join(L) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
