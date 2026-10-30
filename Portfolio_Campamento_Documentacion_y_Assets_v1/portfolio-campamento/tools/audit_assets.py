#!/usr/bin/env python3
"""Inspect PNG assets without changing any image bytes.

Usage:
    python3 tools/audit_assets.py assets --output qa-assets.json

Requires Pillow and NumPy. Alpha components and atlas candidates are geometric
observations, not confirmation of character identity or usable animation.
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import sys
from typing import Any

import numpy as np
from PIL import Image


def runs(line: np.ndarray) -> list[tuple[int, int]]:
    """Return half-open runs of true values."""
    edges = np.diff(np.pad(line.astype(np.int8), (1, 1)))
    return list(zip(np.flatnonzero(edges == 1).tolist(),
                    np.flatnonzero(edges == -1).tolist()))


def box(mask: np.ndarray) -> list[int] | None:
    ys = np.flatnonzero(mask.any(axis=1))
    xs = np.flatnonzero(mask.any(axis=0))
    if not len(xs) or not len(ys):
        return None
    return [int(xs[0]), int(ys[0]), int(xs[-1] + 1), int(ys[-1] + 1)]


def alpha_components(mask: np.ndarray, minimum: int, limit: int) -> dict[str, Any]:
    """Connected components using scanline runs and 8-connectivity."""
    parents: list[int] = []
    data: list[list[int]] = []  # x0, y0, x1, y1, pixels

    def root(i: int) -> int:
        while parents[i] != i:
            parents[i] = parents[parents[i]]
            i = parents[i]
        return i

    def union(a: int, b: int) -> int:
        a, b = root(a), root(b)
        if a == b:
            return a
        if data[a][4] < data[b][4]:
            a, b = b, a
        parents[b] = a
        d, e = data[a], data[b]
        d[0], d[1] = min(d[0], e[0]), min(d[1], e[1])
        d[2], d[3] = max(d[2], e[2]), max(d[3], e[3])
        d[4] += e[4]
        return a

    previous: list[tuple[int, int, int]] = []
    for y, line in enumerate(mask):
        current: list[tuple[int, int, int]] = []
        p = 0
        for start, end in runs(line):
            node = len(parents)
            parents.append(node)
            data.append([start, y, end, y + 1, end - start])
            while p < len(previous) and previous[p][1] < start:
                p += 1
            q = p
            while q < len(previous) and previous[q][0] <= end:
                node = union(node, previous[q][2])
                q += 1
            current.append((start, end, node))
        previous = current

    found = [d for i, d in enumerate(data) if parents[i] == i]
    kept = [d for d in found if d[4] >= minimum]
    kept.sort(key=lambda d: (-d[4], d[1], d[0]))
    selected = kept[:limit]
    selected.sort(key=lambda d: (d[1], d[0]))
    return {
        "connectivity": 8,
        "total": len(found),
        "above_minimum": len(kept),
        "minimum_pixels": minimum,
        "truncated": len(kept) > limit,
        "items": [
            {"bbox": d[:4], "pixels": d[4],
             "center": [(d[0] + d[2]) / 2, (d[1] + d[3]) / 2]}
            for d in selected
        ],
    }


def atlas_candidates(mask: np.ndarray, minimum: int, limit: int) -> dict[str, Any]:
    """Find separators in alpha projections; useful for spaced sprite sheets."""
    row_bands = runs(mask.any(axis=1))
    column_bands = runs(mask.any(axis=0))
    candidates: list[dict[str, Any]] = []
    for y0, y1 in row_bands:
        strip = mask[y0:y1]
        for x0, x1 in runs(strip.any(axis=0)):
            crop = strip[:, x0:x1]
            pixels = int(crop.sum())
            if pixels < minimum:
                continue
            bounds = box(crop)
            if bounds is not None:
                a, b, c, d = bounds
                candidates.append({
                    "x": x0 + a, "y": y0 + b,
                    "w": c - a, "h": d - b,
                    "pixels": pixels,
                })
    return {
        "method": "alpha projection bands; manual visual validation required",
        "row_bands": row_bands[:limit],
        "column_bands": column_bands[:limit],
        "candidate_count": len(candidates),
        "truncated": len(candidates) > limit,
        "frames": candidates[:limit],
    }


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def inspect(path: Path, base: Path, args: argparse.Namespace) -> dict[str, Any]:
    try:
        relative = str(path.relative_to(base))
    except ValueError:
        relative = path.name
    item: dict[str, Any] = {
        "path": relative,
        "bytes": path.stat().st_size,
        "sha256": sha256(path),
        "valid_png": False,
    }
    try:
        with Image.open(path) as check:
            item["format"] = check.format
            if check.format != "PNG":
                raise ValueError("File extension is PNG but decoder reports another format")
            check.verify()
        with Image.open(path) as original:
            item.update({"width": original.width, "height": original.height,
                         "mode": original.mode,
                         "image_frames": getattr(original, "n_frames", 1)})
            item["has_alpha_channel"] = (
                "A" in original.getbands() or "transparency" in original.info
            )
            rgba = np.asarray(original.convert("RGBA"))
        alpha = rgba[:, :, 3]
        visible = alpha > 0
        threshold_mask = alpha > args.alpha_threshold
        count = alpha.size
        item["valid_png"] = True
        item["alpha"] = {
            "min": int(alpha.min()), "max": int(alpha.max()),
            "zero_fraction": round(float(np.count_nonzero(alpha == 0) / count), 6),
            "opaque_fraction": round(float(np.count_nonzero(alpha == 255) / count), 6),
            "partial_fraction": round(float(np.count_nonzero((alpha > 0) & (alpha < 255)) / count), 6),
            "has_real_transparency": bool((alpha < 255).any()),
            "has_fully_transparent_pixels": bool((alpha == 0).any()),
        }
        item["visible_bbox"] = box(visible)
        item["analysis_alpha_threshold"] = args.alpha_threshold
        item["analysis_bbox"] = box(threshold_mask)
        item["touches_canvas_edges"] = {
            "top": bool(visible[0].any()), "right": bool(visible[:, -1].any()),
            "bottom": bool(visible[-1].any()), "left": bool(visible[:, 0].any()),
        }
        if not args.no_components:
            if bool(threshold_mask.all()):
                w, h = item["width"], item["height"]
                item["components"] = {
                    "connectivity": 8, "total": 1, "above_minimum": 1,
                    "minimum_pixels": args.minimum_component_pixels,
                    "truncated": False,
                    "items": [{"bbox": [0, 0, w, h], "pixels": w * h,
                               "center": [w / 2, h / 2]}],
                }
            else:
                item["components"] = alpha_components(
                    threshold_mask, args.minimum_component_pixels, args.max_components
                )
            item["atlas_candidates"] = atlas_candidates(
                threshold_mask, args.minimum_component_pixels, args.max_components
            )
    except Exception as exc:
        item["error"] = f"{type(exc).__name__}: {exc}"
    return item


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path,
                        help="PNG files or directories to scan recursively")
    parser.add_argument("--output", type=Path, help="Write the JSON report here; default stdout")
    parser.add_argument("--alpha-threshold", type=int, default=8)
    parser.add_argument("--minimum-component-pixels", type=int, default=16)
    parser.add_argument("--max-components", type=int, default=256)
    parser.add_argument("--no-components", action="store_true")
    args = parser.parse_args()
    if not 0 <= args.alpha_threshold <= 254:
        parser.error("--alpha-threshold must be between 0 and 254")
    if args.minimum_component_pixels < 1 or args.max_components < 1:
        parser.error("component limits must be positive")
    files: set[Path] = set()
    missing: list[str] = []
    for target in args.paths:
        if target.is_file() and target.suffix.lower() == ".png":
            files.add(target.resolve())
        elif target.is_dir():
            files.update(p.resolve() for p in target.rglob("*")
                         if p.is_file() and p.suffix.lower() == ".png")
        else:
            missing.append(str(target))
    base = args.paths[0].resolve()
    if not base.is_dir():
        base = base.parent
    items = [inspect(path, base, args) for path in sorted(files)]
    report = {
        "schema_version": "1.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "read_only_images": True,
        "coordinate_convention": "bbox=[left,top,right,bottom], right/bottom exclusive; frame={x,y,w,h}",
        "notes": [
            "Only the first image frame of an animated PNG is analyzed.",
            "Transparency is measured in the actual decoded alpha channel.",
            "Connected islands can be separate body parts or decorations, not necessarily individual sprites.",
            "Atlas candidates must be checked visually before use as animation frames.",
            "This report does not assess visual likeness, art consistency, clipping semantics or animation quality.",
        ],
        "summary": {
            "png_files": len(items),
            "valid_png_files": sum(bool(i["valid_png"]) for i in items),
            "files_with_real_transparency": sum(i.get("alpha", {}).get("has_real_transparency", False) for i in items),
            "total_bytes": sum(i["bytes"] for i in items),
            "missing_inputs": missing,
        },
        "files": items,
    }
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
        print(json.dumps({"report": str(args.output), "summary": report["summary"]}, ensure_ascii=False))
    else:
        sys.stdout.write(rendered)
    return 1 if missing or any(not i["valid_png"] for i in items) else 0


if __name__ == "__main__":
    raise SystemExit(main())
