#!/usr/bin/env python3
"""One-shot script to download original-resolution images from leicai99.com
into assets/projects/<slug>/. Idempotent — skips files already present."""

import re
import urllib.parse
import urllib.request
import concurrent.futures
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent

PROJECTS = {
    "design-octopus-ai-model": "octopus-ai",
    "design-stemmentorup": "mentorup",
    "design-autonomous-safety": "smart-brook",
    "design-esp-mobile": "espoirer",
    "design-nexaai-ai-tools": "nexa-ai-tools",
}

CDN = re.compile(r'https://cdn\.prod\.website-files\.com/[^"\'\s]*\.(?:png|jpg|jpeg|webp|svg|gif)')
RESIZE = re.compile(r'-p-\d+\.')
HEX_PREFIX = re.compile(r'^[a-f0-9]{20,}_')


def fetch(url: str) -> str:
    with urllib.request.urlopen(url, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def clean_name(url: str) -> str:
    base = urllib.parse.unquote(url.rsplit("/", 1)[-1])
    base = HEX_PREFIX.sub("", base)
    base = base.replace(" ", "_")
    base = re.sub(r"[^A-Za-z0-9._-]", "_", base)
    base = re.sub(r"_+", "_", base)
    return base


def download(url_dest):
    url, dest = url_dest
    if dest.exists() and dest.stat().st_size > 0:
        return ("skip", dest)
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            data = r.read()
        dest.write_bytes(data)
        return ("ok", dest, len(data))
    except Exception as exc:
        return ("err", dest, str(exc))


def collect():
    plan = []
    for old_slug, new_slug in PROJECTS.items():
        page = fetch(f"https://www.leicai99.com/projects/{old_slug}")
        urls = sorted(set(CDN.findall(page)))
        urls = [u for u in urls if not RESIZE.search(u)]
        out_dir = ROOT / "projects" / new_slug
        for u in urls:
            plan.append((u, out_dir / clean_name(u)))
        print(f"  {new_slug:18s} {len(urls):3d} originals")
    return plan


def main():
    print("Scanning old project pages…")
    plan = collect()
    print(f"\nDownloading {len(plan)} files (parallel)…\n")
    ok = sk = err = 0
    bytes_total = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for r in pool.map(download, plan):
            if r[0] == "ok":
                ok += 1
                bytes_total += r[2]
            elif r[0] == "skip":
                sk += 1
            else:
                err += 1
                print(f"  ERR  {r[1].name}: {r[2]}", file=sys.stderr)
    print(f"\nDone: {ok} downloaded, {sk} already present, {err} failed.")
    print(f"Total downloaded: {bytes_total / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()
