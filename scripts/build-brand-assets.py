#!/usr/bin/env python3
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
BRAND_DIR = ROOT / "assets" / "brand"
APP_DIR = ROOT / "app"

OG_SOURCE = BRAND_DIR / "opengraph-source.png"
ICON_SOURCE = BRAND_DIR / "icon-source.png"


def load_rgb(path: Path) -> Image.Image:
    return Image.open(path).convert("RGB")


def load_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", optimize=True)


def main() -> None:
    og = ImageOps.fit(load_rgb(OG_SOURCE), (1200, 630), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    save_png(og, APP_DIR / "opengraph-image.png")

    icon_source = load_rgb(ICON_SOURCE)
    icon = ImageOps.fit(icon_source, (512, 512), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    save_png(icon, APP_DIR / "icon.png")

    apple_icon = ImageOps.fit(icon_source, (180, 180), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    save_png(apple_icon, APP_DIR / "apple-icon.png")

    favicon_source = ImageOps.fit(load_rgba(ICON_SOURCE), (256, 256), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    favicon_source.save(APP_DIR / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])


if __name__ == "__main__":
    main()
