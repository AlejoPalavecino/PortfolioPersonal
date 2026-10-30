#!/usr/bin/env python3
"""Build manifests and the local preview catalog from the real asset files.

This script only reads source assets. It writes assets-manifest.json,
config/world-layout.json and preview/catalog.js. It can be run again after
new PNG brand files are added.

Usage from the kit root: python3 tools/build_catalog.py
"""

from __future__ import annotations

import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import wave
import xml.etree.ElementTree as ET

import numpy as np
from PIL import Image


SECTIONS = {
    "world": (0, "Mundo"),
    "destinations": (1, "Destinos"),
    "character": (2, "Personaje"),
    "decoration": (3, "Decoración"),
    "effects": (4, "Efectos"),
    "brand": (5, "Identidad"),
    "icons": (6, "Interfaz"),
    "audio": (7, "Audio"),
    "fonts": (8, "Tipografía"),
}

NAMES = {
    "world-backdrop": "Cordillera y paisaje lejano",
    "camp-ground": "Terreno del campamento",
    "camp-foreground": "Vegetación de primer plano",
    "poi-projects": "Taller · Proyectos",
    "poi-about": "Fogón · Sobre mí",
    "poi-journey": "Bitácora · Trayectoria",
    "poi-contact": "Radio · Contacto",
    "avatar-master": "Alejo · Personaje maestro",
    "alejo-portrait": "Alejo · Retrato pixel art",
    "avatar-movement-atlas": "Alejo · Poses y caminata",
    "camp-props-atlas": "Objetos reutilizables",
    "camp-effects-atlas": "Fuego, humo y agua",
    "favicon-master": "Símbolo · Fuente para favicon",
    "portfolio-share-cover": "Portada para compartir",
    "ui-open": "Abrir una ficha",
    "ui-close": "Cerrar una ficha",
    "discovery": "Descubrimiento",
    "step-soft": "Paso suave",
    "camp-ambience-loop": "Ambiente suave · Bucle de 12 s",
    "Lexend-Variable": "Lexend · Texto y controles",
    "PixelifySans-Variable": "Pixelify Sans · Títulos",
    "arrow-down": "Flecha abajo",
    "arrow-left": "Flecha izquierda",
    "arrow-right": "Flecha derecha",
    "arrow-up": "Flecha arriba",
    "book-open": "Bitácora",
    "briefcase-business": "Proyectos",
    "download": "Descargar CV",
    "external-link": "Enlace externo",
    "mail": "Correo",
    "map": "Mapa",
    "menu": "Menú",
    "volume-2": "Sonido activo",
    "volume-x": "Sonido desactivado",
    "x": "Cerrar",
}

NOTES = {
    "world-backdrop": "Fondo opaco. Se compone detrás del terreno sin deformar su proporción.",
    "camp-ground": "Capa con transparencia real. Los caminos y claros son una propuesta artística; no contienen colisiones programadas.",
    "camp-foreground": "Capa opcional de profundidad. Está oculta inicialmente en la composición para conservar visibles los destinos.",
    "poi-projects": "Edificio separado, con cartel vacío para añadir el título mediante la interfaz web.",
    "poi-about": "Zona del fogón y presentación personal; el efecto de fuego se integra por separado.",
    "poi-journey": "Mesa y bitácora para presentar la trayectoria.",
    "poi-contact": "Puesto de radio para acceder al contacto profesional.",
    "avatar-master": "Diseño maestro inspirado en la fotografía aportada. La foto original no se incluye en este kit.",
    "alejo-portrait": "Retrato estilizado para presentación personal; no sustituye una fotografía documental.",
    "avatar-movement-atlas": "20 cuadros con metadatos reales. Secuencias iniciales; revisar el movimiento al tamaño final.",
    "camp-props-atlas": "8 objetos con recortes variables y anclajes. Seleccioná cada nombre para inspeccionarlo.",
    "camp-effects-atlas": "3 secuencias de 4 cuadros. Las celdas incluyen chispas y fragmentos separados.",
    "favicon-master": "Arte fuente del símbolo. Preparar y revisar sus exportaciones pequeñas durante la integración.",
    "portfolio-share-cover": "Portada ilustrada para compartir el portfolio.",
}


def read_json(path: Path, fallback):
    return json.loads(path.read_text(encoding="utf-8")) if path.is_file() else fallback


def digest(path: Path) -> str:
    hasher = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def png_metadata(path: Path) -> dict:
    with Image.open(path) as image:
        width, height = image.size
        alpha = np.asarray(image.convert("RGBA"))[:, :, 3]
    ys, xs = np.where(alpha > 8)
    bounds = {"x": 0, "y": 0, "w": width, "h": height}
    if len(xs):
        bounds = {"x": int(xs.min()), "y": int(ys.min()),
                  "w": int(xs.max() - xs.min() + 1),
                  "h": int(ys.max() - ys.min() + 1)}
    return {
        "width": width, "height": height,
        "hasRealTransparency": bool((alpha < 255).any()),
        "visibleBounds": bounds,
        "boundsAlphaThreshold": 8,
        "defaultAnchor": {
            "x": bounds["x"] + bounds["w"] / 2,
            "y": bounds["y"] + bounds["h"],
        },
    }


def build_assets(root: Path) -> list[dict]:
    asset_root = root / "assets"
    audio_data = read_json(asset_root / "audio/metadataaudio.json", {}).get("files", [])
    audio_by_file = {item["file"]: item for item in audio_data}
    font_sources = read_json(asset_root / "fonts/sources.json", [])
    font_source_by_file = {item["file"]: item for item in font_sources}
    media = [p for p in asset_root.rglob("*") if p.is_file() and
             p.suffix.lower() in {".png", ".svg", ".wav", ".ttf", ".woff", ".woff2", ".otf"}]
    media.sort(key=lambda p: (SECTIONS.get(p.relative_to(asset_root).parts[0], (99, "Otros"))[0], p.name))
    result = []
    for path in media:
        relative = path.relative_to(root).as_posix()
        section = path.relative_to(asset_root).parts[0]
        asset_id = path.stem if section not in {"icons", "audio", "fonts"} else f"{section}-{path.stem}"
        item = {"id": asset_id, "name": NAMES.get(path.stem, path.stem),
                "path": relative, "category": SECTIONS.get(section, (99, "Otros"))[1],
                "bytes": path.stat().st_size, "sha256": digest(path)}
        if path.suffix.lower() == ".png":
            item.update({"kind": "image", "mimeType": "image/png", "sourceKind": "generated-art"})
            item.update(png_metadata(path))
            atlas_path = path.with_suffix(".json")
            atlas = read_json(atlas_path, {})
            if isinstance(atlas, dict) and atlas.get("frames"):
                item.update({"kind": "spritesheet", "atlasMetadata": atlas_path.relative_to(root).as_posix(),
                             "frames": atlas["frames"], "animations": atlas.get("animations", {}),
                             "fps": atlas.get("fps", 6), "defaultAnimation": atlas.get("defaultAnimation"),
                             "qualityNotes": atlas.get("qualityNotes", [])})
                if atlas.get("sha256") != item["sha256"]:
                    raise ValueError(f"Atlas metadata does not match current PNG: {relative}")
            item["notes"] = NOTES.get(path.stem, "Ilustración generada para el kit del campamento.")
            item["wide"] = section == "world" or path.stem == "portfolio-share-cover"
        elif path.suffix.lower() == ".svg":
            svg = ET.parse(path).getroot()
            view_box = [float(v) for v in svg.attrib.get("viewBox", "0 0 24 24").split()]
            item.update({"kind": "icon", "mimeType": "image/svg+xml", "viewBox": view_box,
                         "sourceKind": "third-party", "source": "Lucide",
                         "licensePath": "assets/icons/LICENSE-lucide.txt",
                         "notes": "Icono SVG de Lucide; conservar su licencia al distribuir."})
        elif path.suffix.lower() == ".wav":
            with wave.open(str(path), "rb") as audio:
                rate, channels = audio.getframerate(), audio.getnchannels()
                seconds = audio.getnframes() / rate
            audio_info = audio_by_file.get(path.name, {})
            item.update({"kind": "audio", "mimeType": "audio/wav", "sourceKind": "original-synthesis",
                         "durationSeconds": round(seconds, 5), "sampleRate": rate, "channels": channels,
                         "loop": audio_info.get("loop", False),
                         "recommendedGain": audio_info.get("recommended_gain", 0.5),
                         "notes": audio_info.get("purpose_es", "Sonido original sintetizado para el campamento.")})
        else:
            source = font_source_by_file.get(path.relative_to(asset_root).as_posix(), {})
            family = "Pixelify Sans" if "Pixelify" in path.stem else "Lexend"
            license_name = "PixelifySans-OFL.txt" if "Pixelify" in path.stem else "Lexend-OFL.txt"
            item.update({"kind": "font", "mimeType": "font/ttf" if path.suffix.lower() == ".ttf" else "font/" + path.suffix[1:],
                         "family": family, "sourceKind": "third-party", "license": "SIL Open Font License 1.1",
                         "licensePath": "assets/fonts/" + license_name,
                         "sourceUrl": source.get("url"), "stylesheet": "assets/fonts/fonts.css",
                         "notes": "Fuente local; no se incluye como imagen en la galería."})
        result.append(item)
    return result


def make_scenes(assets: list[dict]) -> list[dict]:
    by_id = {a["id"]: a for a in assets}

    def covered_background(width: int, height: int) -> dict | None:
        asset = by_id.get("world-backdrop")
        if not asset:
            return None
        scale = max(width / asset["width"], height / asset["height"])
        return {"asset": asset["id"], "name": "Paisaje lejano",
                "x": (width - asset["width"] * scale) / 2,
                "y": (height - asset["height"] * scale) / 2,
                "scale": scale, "z": 0}

    def isolated(asset_id: str, x: float, y: float, visible_width: float, z: int) -> dict | None:
        asset = by_id.get(asset_id)
        if not asset:
            return None
        bounds = asset["visibleBounds"]
        return {"asset": asset_id, "name": asset["name"], "x": x, "y": y,
                "scale": visible_width / bounds["w"],
                "anchorX": bounds["x"] + bounds["w"] / 2,
                "anchorY": bounds["y"] + bounds["h"], "z": z,
                "placementBasis": "alpha>8 visual bounds; full source file remains unchanged"}

    def frame_layer(asset_id: str, frame_name: str, x: float, y: float, height: float, z: int) -> dict | None:
        asset = by_id.get(asset_id)
        if not asset:
            return None
        frame = next((f for f in asset.get("frames", []) if f["name"] == frame_name), None)
        if not frame:
            return None
        return {"asset": asset_id, "frame": frame_name, "name": frame_name,
                "x": x, "y": y, "scale": height / frame["h"],
                "anchorX": frame.get("anchorX", frame["w"] / 2),
                "anchorY": frame.get("anchorY", frame["h"]), "z": z}

    def scene(name: str, width: int, height: int, ground_x: float, ground_y: float,
              ground_width: float, destinations: list[tuple], avatar: tuple,
              decorations: list[tuple]) -> dict:
        layers = [covered_background(width, height)]
        if "camp-ground" in by_id:
            layers.append({"asset": "camp-ground", "name": "Terreno", "x": ground_x,
                           "y": ground_y, "width": ground_width, "z": 10})
        for asset_id, x, y, visible_width in destinations:
            layers.append(isolated(asset_id, x, y, visible_width, int(y)))
        ax, ay, ah = avatar
        layers.append(frame_layer("avatar-movement-atlas", "idle-down", ax, ay, ah, int(ay) + 1))
        for frame_name, x, y, target_height in decorations:
            layers.append(frame_layer("camp-props-atlas", frame_name, x, y, target_height, int(y) + 1))
        if "camp-foreground" in by_id:
            layers.append({"asset": "camp-foreground", "name": "Primer plano · opcional",
                           "x": ground_x, "y": ground_y, "width": ground_width,
                           "z": 5000, "visible": False})
        return {"name": name, "width": width, "height": height,
                "referenceOnly": True, "coordinateUnits": "logical scene pixels",
                "notes": "Composición de referencia para revisar escala y distribución. No define colisiones, caminos navegables ni un mapa de juego validado. Los destinos se colocan por el apoyo inferior de su silueta; el fondo conserva su proporción. El primer plano se deja oculto para no tapar destinos.",
                "layers": [layer for layer in layers if layer is not None]}

    return [
        scene("Escritorio · 1536 × 1152", 1536, 1152, 0, 128, 1536,
              [("poi-projects", 1000, 500, 520), ("poi-about", 320, 680, 320),
               ("poi-journey", 550, 860, 135), ("poi-contact", 1160, 800, 250)],
              (750, 800, 84), [("pine", 115, 1080, 230), ("bush", 1420, 1070, 70)]),
        scene("Celular · 768 × 1152", 768, 1152, -66, 440, 900,
              [("poi-projects", 520, 670, 300), ("poi-about", 150, 770, 220),
               ("poi-journey", 280, 930, 95), ("poi-contact", 600, 900, 190)],
              (380, 925, 70), []),
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    root = args.root.resolve()
    assets = build_assets(root)
    scenes = make_scenes(assets)
    kinds = Counter(a["kind"] for a in assets)
    media_paths = {a["path"] for a in assets}
    supporting = [p.relative_to(root).as_posix() for p in sorted((root / "assets").rglob("*"))
                  if p.is_file() and p.relative_to(root).as_posix() not in media_paths]
    manifest = {
        "schemaVersion": "1.0", "title": "Campamento creativo · Alejo Palavecino",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "purpose": "Kit de assets para desarrollar un portfolio. No es una web publicada ni un juego completo.",
        "pathsRelativeTo": "kit root", "sourceImagesModifiedByBuilder": False,
        "summary": {"assetFiles": len(assets), "galleryFiles": sum(a["kind"] != "font" for a in assets),
                    "byKind": dict(sorted(kinds.items())), "totalAssetBytes": sum(a["bytes"] for a in assets)},
        "assets": assets, "supportingFiles": supporting,
        "worldLayout": "config/world-layout.json", "preview": "preview/index.html",
        "limits": [
            "Las composiciones son referencias de distribución; no representan navegación ni colisiones implementadas.",
            "Los atlas contienen coordenadas verificadas y ciclos iniciales que deben revisarse en el contexto final.",
            "El arte tiene apariencia pixelada; no se afirma una cuadrícula lógica uniforme de producción manual.",
            "El material profesional pendiente se describe en docs/CONTENIDO_PENDIENTE.md.",
        ],
    }
    layout = {"schemaVersion": "1.0", "referenceOnly": True,
              "assetManifest": "../assets-manifest.json", "coordinateUnits": "logical scene pixels",
              "scenes": scenes}
    gallery = []
    for asset in assets:
        if asset["kind"] == "font":
            continue
        entry = {k: asset[k] for k in ["id", "name", "kind", "category", "notes", "wide", "frames", "animations", "fps", "defaultAnimation"] if k in asset}
        entry["src"] = "../" + asset["path"]
        gallery.append(entry)
    catalog = {"title": "Campamento de Alejo · Kit visual",
               "subtitle": "Piezas originales, secuencias y composiciones de referencia para desarrollar el portfolio.",
               "assets": gallery, "scenes": scenes}
    (root / "config").mkdir(parents=True, exist_ok=True)
    (root / "preview").mkdir(parents=True, exist_ok=True)
    (root / "assets-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (root / "config/world-layout.json").write_text(json.dumps(layout, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (root / "preview/catalog.js").write_text("// Generated by tools/build_catalog.py from the real asset files.\nwindow.CAMP_CATALOG = " + json.dumps(catalog, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(json.dumps({"summary": manifest["summary"], "compositions": len(scenes),
                      "written": ["assets-manifest.json", "config/world-layout.json", "preview/catalog.js"]}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
