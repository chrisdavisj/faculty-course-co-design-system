"""
Credential Registry integration.
Fetches CTDL resources at startup and provides competency alignment utilities.
"""
import re
import httpx

GRAPH_BASE    = "https://credentialengineregistry.org/graph"
RESOURCE_BASE = "https://credentialengineregistry.org/resources"

JOB_CTID = "ce-0bb27534-f864-4c49-8bac-d5c0e7f0e2b4"

COURSE_CTIDS = [
    "ce-e87d4f45-7866-474b-b01a-c171947a8eb1",  # CSC 249 — Forsyth Tech
    "ce-a37328b3-7cbb-4243-b653-8f467038fe9e",  # C949 — WGU
    "ce-5cafd3aa-f44a-4db7-bd3c-5b1cd1e1cce6",  # C950 — WGU
    "ce-19178d10-eb41-456a-942f-8fc69b31f9a9",
    "ce-d4a7a7f0-65cb-4434-935e-ff004bc3fad5",
    "ce-b906ca6d-abec-43ac-9b35-5237ceeb9a18",
]

_STOPWORDS = {
    "a","an","and","are","as","at","be","by","for","from","has","he",
    "in","is","it","its","of","on","that","the","to","was","were",
    "will","with","this","their","or","various","can","how","use",
    "using","able","ability","basic","understand","understanding",
    "knowledge","skills","apply","applying","demonstrate","principles",
}


# ── CTDL helpers ─────────────────────────────────────────────────────────────

def _fetch(ctid: str) -> dict | None:
    try:
        r = httpx.get(f"{GRAPH_BASE}/{ctid}", timeout=12, follow_redirects=True)
        r.raise_for_status()
        data = r.json()
        return data["@graph"][0] if "@graph" in data else data
    except Exception as exc:
        print(f"[CR] Warning: could not fetch {ctid}: {exc}")
        return None


def _name(resource: dict) -> str:
    n = resource.get("ceterms:name", {})
    return n.get("en-US", "") if isinstance(n, dict) else str(n)


def _institution(resource: dict) -> str:
    for key in ("ceterms:ownedBy", "ceterms:offeredBy"):
        owned = resource.get(key, [])
        if isinstance(owned, list) and owned:
            inst = owned[0]
            if isinstance(inst, dict):
                n = inst.get("ceterms:name", {})
                return n.get("en-US", "") if isinstance(n, dict) else str(n)
    return ""


def _competencies(resource: dict) -> list[str]:
    # jobs: ceterms:targetCompetency   courses: ceterms:teaches
    field = resource.get("ceterms:targetCompetency") or resource.get("ceterms:teaches") or []
    if isinstance(field, dict):
        field = [field]
    return [
        item["ceterms:targetNodeName"]["en-US"]
        for item in field
        if isinstance(item, dict)
        and "ceterms:targetNodeName" in item
        and "en-US" in item["ceterms:targetNodeName"]
    ]


# ── Alignment scoring ─────────────────────────────────────────────────────────

def tokenize(text: str) -> set[str]:
    words = re.findall(r"\b[a-z]{3,}\b", text.lower())
    return {w for w in words if w not in _STOPWORDS}


def strength_of_fit(faculty_text: str, registry_text: str) -> str:
    """Return HIGH / MEDIUM / LOW based on keyword overlap."""
    f_tok = tokenize(faculty_text)
    r_tok = tokenize(registry_text)
    if not r_tok:
        return "LOW"
    ratio = len(f_tok & r_tok) / len(r_tok)
    if ratio >= 0.30:
        return "HIGH"
    if ratio >= 0.10:
        return "MEDIUM"
    return "LOW"


def coverage_pct(faculty_text: str, competency_list: list[str]) -> int:
    """Percentage of registry competencies with at least MEDIUM fit."""
    if not competency_list:
        return 0
    covered = sum(
        1 for c in competency_list
        if strength_of_fit(faculty_text, c) in ("HIGH", "MEDIUM")
    )
    return round(100 * covered / len(competency_list))


# ── Startup loader ────────────────────────────────────────────────────────────

def load() -> dict:
    """
    Fetch all CR resources. Returns:
      {
        "job":     {ctid, name, competencies, uri}  | None,
        "courses": [{ctid, name, institution, competencies, uri}, ...],
      }
    Falls back gracefully if any resource is unreachable.
    """
    print("[CR] Loading Credential Registry data…")

    job = None
    raw_job = _fetch(JOB_CTID)
    if raw_job:
        job = {
            "ctid":         JOB_CTID,
            "name":         _name(raw_job),
            "competencies": _competencies(raw_job),
            "uri":          f"{RESOURCE_BASE}/{JOB_CTID}",
        }
        print(f"[CR] Job: {job['name']}  ({len(job['competencies'])} competencies)")

    courses = []
    for ctid in COURSE_CTIDS:
        raw = _fetch(ctid)
        if raw:
            course = {
                "ctid":         ctid,
                "name":         _name(raw),
                "institution":  _institution(raw),
                "competencies": _competencies(raw),
                "uri":          f"{RESOURCE_BASE}/{ctid}",
            }
            courses.append(course)
            print(f"[CR]   Course: {course['name']} @ {course['institution'] or '?'}  ({len(course['competencies'])} competencies)")

    print(f"[CR] Ready: {len(courses)} courses, {'1 job' if job else 'job unavailable'}.")
    return {"job": job, "courses": courses}
