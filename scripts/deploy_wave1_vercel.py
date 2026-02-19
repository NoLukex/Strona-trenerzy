from __future__ import annotations

import csv
import json
import re
import shutil
import subprocess
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT.parent
FILTERED_CSV = BASE / "trenerzy_bydgoszcz_personalni.csv"
QUEUE_CSV = ROOT / "clients_deploy_queue.csv"
MCP_CONFIG = Path(r"C:\Users\Krysiek\.gemini\antigravity\mcp_config.json")
LOG_CSV = ROOT / "wave1_deploy_results.csv"


def detect_vercel_cmd() -> list[str]:
    explicit = Path(r"C:\Users\Krysiek\AppData\Roaming\npm\vercel.cmd")
    if explicit.exists():
        return [str(explicit)]
    if shutil.which("vercel"):
        return ["vercel"]
    return ["npx", "vercel"]


VERCEL_CMD = detect_vercel_cmd()


def slugify(text: str, used: set[str]) -> str:
    text = (
        text.replace("ą", "a")
        .replace("ć", "c")
        .replace("ę", "e")
        .replace("ł", "l")
        .replace("ń", "n")
        .replace("ó", "o")
        .replace("ś", "s")
        .replace("ź", "z")
        .replace("ż", "z")
        .replace("Ą", "a")
        .replace("Ć", "c")
        .replace("Ę", "e")
        .replace("Ł", "l")
        .replace("Ń", "n")
        .replace("Ó", "o")
        .replace("Ś", "s")
        .replace("Ź", "z")
        .replace("Ż", "z")
        .lower()
    )
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    if not text:
        text = "trener"
    base = text
    i = 2
    while text in used:
        text = f"{base}-{i}"
        i += 1
    used.add(text)
    return text


def normalize(value: str) -> str:
    return " ".join((value or "").replace("\xa0", " ").strip().split())


def potential_score(row: dict) -> float:
    score = 0.0
    rating = normalize(row.get("Rating", "")).replace(",", ".")
    try:
        score += float(rating) * 10
    except ValueError:
        score += 45.0

    for key, weight in (
        ("Phone", 15),
        ("Website", 14),
        ("Instagram", 10),
        ("Facebook", 8),
        ("Email", 12),
    ):
        if normalize(row.get(key, "")):
            score += weight

    title = normalize(row.get("Title", "")).lower()
    category = normalize(row.get("Category", "")).lower()

    if "kobiet" in category:
        score += 2
    if "trener personalny" in title or "trener osobisty" in title:
        score += 3
    if "bydgoszcz" in title:
        score += 2

    return score


def read_token() -> str:
    cfg = json.loads(MCP_CONFIG.read_text(encoding="utf-8"))
    env = cfg.get("mcpServers", {}).get("vercel-mcp", {}).get("env", {})
    token = env.get("VERCEL_TOKEN", "") or env.get("VERCEL_ACCESS_TOKEN", "").strip()
    if not token or token in {"YOUR_VERCEL_ACCESS_TOKEN", "YOUR_VERCEL_TOKEN"}:
        raise RuntimeError("Missing real Vercel token in mcp_config.json")
    return token


def run_cmd(
    args: list[str], *, input_text: str | None = None
) -> subprocess.CompletedProcess:
    return subprocess.run(
        VERCEL_CMD + args,
        cwd=str(ROOT),
        input=(input_text.encode("utf-8") if input_text is not None else None),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def detect_scope(token: str) -> str:
    req = urllib.request.Request(
        "https://api.vercel.com/v1/teams",
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="ignore"))
    except Exception:
        return ""

    teams = data.get("teams") or []
    if not teams:
        return ""

    first = teams[0]
    return (first.get("slug") or "").strip()


def set_env(token: str, scope: str, value: str, environment: str) -> tuple[bool, str]:
    scope_args = ["--scope", scope] if scope else []
    update = run_cmd(
        [
            "env",
            "update",
            "VITE_CLIENT_SLUG",
            environment,
            "--token",
            token,
            "--non-interactive",
            *scope_args,
        ],
        input_text=value + "\n",
    )
    if update.returncode == 0:
        return True, "updated"

    add = run_cmd(
        [
            "env",
            "add",
            "VITE_CLIENT_SLUG",
            environment,
            "--token",
            token,
            "--non-interactive",
            *scope_args,
        ],
        input_text=value + "\n",
    )
    if add.returncode == 0:
        return True, "added"

    err = (update.stderr + add.stderr).decode("utf-8", errors="ignore")
    return False, err.strip()


def main() -> None:
    token = read_token()
    scope = detect_scope(token)

    rows = list(csv.DictReader(FILTERED_CSV.open(encoding="utf-8-sig", newline="")))

    used = set()
    slug_by_title: dict[str, str] = {}
    for row in rows:
        title = normalize(row.get("Title", ""))
        slug_by_title[title] = slugify(title, used)

    ranked = sorted(rows, key=potential_score, reverse=True)[:10]

    results: list[dict[str, str]] = []

    for row in ranked:
        title = normalize(row.get("Title", ""))
        slug = slug_by_title[title]
        project_name = f"trener-{slug}"

        link = run_cmd(
            [
                "link",
                "--project",
                project_name,
                "--yes",
                "--token",
                token,
                "--non-interactive",
                *(["--scope", scope] if scope else []),
            ]
        )
        if link.returncode != 0:
            results.append(
                {
                    "slug": slug,
                    "title": title,
                    "project": project_name,
                    "status": "failed_link",
                    "url": "",
                    "note": link.stderr.decode("utf-8", errors="ignore")[:500],
                }
            )
            continue

        env_notes = []
        env_ok = True
        for env_name in ("production", "preview", "development"):
            ok, note = set_env(token, scope, slug, env_name)
            env_notes.append(f"{env_name}:{note}")
            env_ok = env_ok and ok

        if not env_ok:
            results.append(
                {
                    "slug": slug,
                    "title": title,
                    "project": project_name,
                    "status": "failed_env",
                    "url": "",
                    "note": "; ".join(env_notes)[:500],
                }
            )
            continue

        deploy = run_cmd(
            [
                "deploy",
                "--prod",
                "--yes",
                "--token",
                token,
                "--non-interactive",
                *(["--scope", scope] if scope else []),
            ]
        )
        out = deploy.stdout.decode("utf-8", errors="ignore")
        err = deploy.stderr.decode("utf-8", errors="ignore")

        if deploy.returncode != 0:
            results.append(
                {
                    "slug": slug,
                    "title": title,
                    "project": project_name,
                    "status": "failed_deploy",
                    "url": "",
                    "note": (out + "\n" + err)[:500],
                }
            )
            continue

        url_match = re.findall(r"https://[\w.-]+\.vercel\.app", out + "\n" + err)
        url = url_match[-1] if url_match else ""
        results.append(
            {
                "slug": slug,
                "title": title,
                "project": project_name,
                "status": "deployed",
                "url": url,
                "note": "; ".join(env_notes),
            }
        )

    with LOG_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["slug", "title", "project", "status", "url", "note"],
        )
        writer.writeheader()
        writer.writerows(results)

    queue_rows = list(csv.DictReader(QUEUE_CSV.open(encoding="utf-8", newline="")))
    status_by_slug = {r["slug"]: r["status"] for r in results}
    for row in queue_rows:
        slug = row.get("slug", "")
        if slug in status_by_slug and status_by_slug[slug] == "deployed":
            row["status"] = "deployed"
    with QUEUE_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f, fieldnames=["slug", "vercel_project", "env_VITE_CLIENT_SLUG", "status"]
        )
        writer.writeheader()
        writer.writerows(queue_rows)

    deployed = sum(1 for r in results if r["status"] == "deployed")
    print(f"wave1_total={len(results)}")
    print(f"wave1_deployed={deployed}")
    print(f"wave1_failed={len(results) - deployed}")
    print(f"report={LOG_CSV}")


if __name__ == "__main__":
    main()
