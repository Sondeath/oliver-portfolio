"""Rebuild web derivatives. Requires Pillow, fonttools[woff], and brotli.

Original fonts and full-size hero/project captures remain the source of truth.
Run from any directory: python scripts/optimize-assets.py
"""
from pathlib import Path
from PIL import Image
from fontTools import subset
import json

ROOT = Path(__file__).resolve().parent.parent
REPORT = []

for name in ("anton-regular", "inter-regular", "inter-medium"):
    source = ROOT / f"assets/fonts/{name}.ttf"
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    font = subset.load_font(str(source), options)
    selection = subset.Subsetter(options=options)
    selection.populate(unicodes=subset.parse_unicodes(
        "U+0000-024F,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+20AC,U+2122"))
    selection.subset(font)
    destination = source.with_suffix(".woff2")
    subset.save_font(font, str(destination), options)
    REPORT.append({"file": str(destination.relative_to(ROOT)), "bytes": destination.stat().st_size})

for asset, widths, quality in (
    ("hero-purple/monitor", (480, 800), 88),
    ("hero-purple/shirt", (480, 800), 88),
    ("projects/live/becool-shop", (480, 800), 88),
    ("projects/live/becool-marathon", (480, 800), 88),
    ("work-liquid/odtlacok-o", (640, 800, 1254), 82),
    ("work-liquid/liquid-aura", (960,), 82),
):
    source = ROOT / f"assets/{asset}.webp"
    with Image.open(source) as original:
        for width in widths:
            height = round(original.height * width / original.width)
            result = original.resize((width, height), Image.Resampling.LANCZOS)
            destination = source.with_stem(source.stem + f"-{width}")
            result.save(destination, "WEBP", quality=quality,
                        alpha_quality=85 if asset.startswith("work-liquid/") else 100, method=6)
            REPORT.append({"file": str(destination.relative_to(ROOT)), "width": width,
                           "height": height, "bytes": destination.stat().st_size})

print(json.dumps(REPORT, indent=2))
